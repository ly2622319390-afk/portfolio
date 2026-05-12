import { readFileSync, writeFileSync } from 'fs';

let html = readFileSync('E:/claudecode/index.html', 'utf-8');

// The slideshow template at line ~1996
// We need to replace ${m.src} with ${optSrc(m.src)} in both video and img tags
// The expression is: ${m.src.endsWith('.mp4')?`<video src="${m.src}"...`:`<img src="${m.src}"...`}

// Strategy: find the specific pattern and do targeted replacements
// Replace `<video src="${m.src}"` with `<video src="${optSrc(m.src)}"` in slide templates
// and `<img src="${m.src}"` with `<img src="${optSrc(m.src)}"`
// But only inside the .endsWith expression

// Find the endsWith expression in the HTML
const idx = html.indexOf("m.src.endsWith('.mp4')");
if (idx > -1) {
  // Extract the surrounding context
  const ctx = html.substring(idx, idx + 300);
  console.log('Slide expression starts at', idx);
  console.log('Context:', ctx.substring(0, 150));

  // Replace just the video src
  const oldVid = 'endsWith(\'.mp4\')?`<video src="${m.src}" muted playsinline preload="metadata"></video>`:`<img src="${m.src}" alt="${m.label}">`';
  const newVid = 'endsWith(\'.mp4\')?`<video src="${optSrc(m.src)}" muted playsinline preload="metadata"></video>`:`<img src="${optSrc(m.src)}" alt="${m.label}">`';

  if (html.includes(oldVid)) {
    html = html.replaceAll(oldVid, newVid);
    console.log('Replaced slideshow template');
  } else {
    console.log('Exact string not found - checking for differences');
    // Debug: show hex dump of the area
    const seg = html.substring(idx, idx + 150);
    for (let i = 0; i < seg.length; i++) {
      if (seg[i] !== oldVid[i]) {
        console.log(`Diff at pos ${i}: got "${seg[i]}" (${seg.charCodeAt(i)}) expected "${oldVid[i]}" (${oldVid.charCodeAt(i)})`);
        console.log(`Around: ...${seg.substring(Math.max(0,i-10), i+20)}...`);
        break;
      }
    }
  }
} else {
  console.log('NOT FOUND: slideshow expression');
}

// Now handle the static layout default media
// The template is inside aiOMedia.innerHTML = ` ... `
// The relevant part: isVideo?`<video src="${defaultMedia}" ...`:`<img src="${defaultMedia}" ...`
const staticIdx = html.indexOf('isVideo?`<video src="${defaultMedia}"');
if (staticIdx > -1) {
  console.log('Static expr at', staticIdx);
  const oldStatic = 'isVideo?`<video src="${defaultMedia}" controls playsinline autoplay preload="metadata"></video>`:`<img src="${defaultMedia}" alt="">`';
  const newStatic = 'isVideo?`<video src="${optSrc(defaultMedia)}" controls playsinline autoplay preload="metadata"></video>`:`<img src="${optSrc(defaultMedia)}" alt="">`';
  if (html.includes(oldStatic)) {
    html = html.replaceAll(oldStatic, newStatic);
    console.log('Replaced static template');
  } else {
    console.log('Static exact string not found, checking...');
    const seg = html.substring(staticIdx, staticIdx + 200);
    console.log('Static context:', JSON.stringify(seg.substring(0, 150)));
  }
} else {
  console.log('NOT FOUND: static expression');
}

writeFileSync('E:/claudecode/index.html', html, 'utf-8');
console.log('Done');
