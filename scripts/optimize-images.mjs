import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from 'fs';
import { join, parse, relative, sep } from 'path';
import { cwd } from 'process';

const ROOT = cwd();
const OPT_DIR = join(ROOT, 'optimized');

// Scan directories and root files
const SCAN_DIRS = ['中药', '游戏', '运营', 'AI对话网站', '视频作品', '封面与简历'];
const ROOT_FILES = ['个人照片.jpg', '作品集网站封面底图.JPG'];

const SIZE_RULES = [
  { test: (name) => name.includes('作品集网站封面底图'), maxWidth: 1920 },
  { test: (name) => name.includes('个人照片'), maxWidth: 400 },
  { test: (name) => /封面\.(png|jpg|jpeg)$/i.test(name), maxWidth: 800 },
  { test: () => true, maxWidth: 1200 },
];

function getMaxWidth(filename) {
  for (const rule of SIZE_RULES) {
    if (rule.test(filename)) return rule.maxWidth;
  }
  return 1200;
}

function isImage(file) {
  return /\.(png|jpg|jpeg)$/i.test(file);
}

function collectFiles() {
  const files = [];

  // Root level files
  for (const f of ROOT_FILES) {
    const fp = join(ROOT, f);
    if (existsSync(fp)) files.push({ src: fp, rel: f });
  }

  // Directory files
  for (const dir of SCAN_DIRS) {
    const dirPath = join(ROOT, dir);
    if (!existsSync(dirPath)) continue;
    for (const f of readdirSync(dirPath)) {
      if (!isImage(f)) continue;
      const fp = join(dirPath, f);
      if (!statSync(fp).isFile()) continue;
      files.push({ src: fp, rel: join(dir, f) });
    }
  }

  return files;
}

async function optimize() {
  if (!existsSync(OPT_DIR)) mkdirSync(OPT_DIR, { recursive: true });

  const files = collectFiles();
  console.log(`Found ${files.length} images to process.\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of files) {
    const { src, rel } = file;
    const parsed = parse(rel);
    const outDir = join(OPT_DIR, parsed.dir);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const maxWidth = getMaxWidth(parsed.base);
    const originalSize = statSync(src).size;
    totalOriginal += originalSize;

    const ext = parsed.ext.toLowerCase();
    const outWebp = join(outDir, parsed.name + '.webp');

    try {
      const img = sharp(src);
      const meta = await img.metadata();

      let resizeOpts = {};
      if (meta.width > maxWidth) {
        resizeOpts = { width: maxWidth, withoutEnlargement: true };
      }

      // WebP output
      const webpBuf = await img
        .clone()
        .resize(resizeOpts)
        .webp({ quality: 80, effort: 4 })
        .toBuffer();

      const webpSize = webpBuf.length;
      await sharp(webpBuf).toFile(outWebp);

      // LQIP for hero background
      if (parsed.base.includes('作品集网站封面底图')) {
        const lqip = await sharp(src)
          .resize({ width: 30 })
          .blur(5)
          .webp({ quality: 30 })
          .toBuffer();
        await sharp(lqip).toFile(join(outDir, parsed.name + '.lqip.webp'));
        const lqipSize = lqip.length;
        console.log(`  LQIP:      ${(lqipSize/1024).toFixed(1)} KB`);
      }

      totalOptimized += webpSize;
      const pct = ((1 - webpSize/originalSize) * 100).toFixed(1);
      console.log(`${rel.padEnd(45)} ${(originalSize/1024).toFixed(0)}KB → ${(webpSize/1024).toFixed(0)}KB (${pct}% off)  maxW:${maxWidth}`);
    } catch (err) {
      console.error(`FAIL: ${rel} — ${err.message}`);
    }
  }

  // Copy uncategorized files (e.g., JPG covers in 视频作品)
  // Also copy any .jpg files in root that we might have missed
  const extraRoot = ['鹅鸭杀AIGC封面.jpg', '鹅鸭杀搞笑向视频封面.jpg'];
  for (const f of extraRoot) {
    const src = join(ROOT, '视频作品', f);
    if (existsSync(src)) {
      const dst = join(OPT_DIR, '视频作品', f);
      if (!existsSync(join(OPT_DIR, '视频作品'))) mkdirSync(join(OPT_DIR, '视频作品'), { recursive: true });
      copyFileSync(src, dst);
      console.log(`${f.padEnd(45)} copied (non-image)`);
    }
  }

  const savedMB = (totalOriginal - totalOptimized) / (1024*1024);
  console.log(`\n--- Summary ---`);
  console.log(`Original:  ${(totalOriginal/(1024*1024)).toFixed(1)} MB`);
  console.log(`Optimized: ${(totalOptimized/(1024*1024)).toFixed(1)} MB`);
  console.log(`Saved:     ${savedMB.toFixed(1)} MB (${(savedMB/(totalOriginal/(1024*1024))*100).toFixed(1)}%)`);
}

optimize().catch(err => { console.error(err); process.exit(1); });
