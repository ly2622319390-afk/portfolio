#!/bin/bash
# Deploy portfolio to GitHub Pages
set -e

ROOT="E:/claudecode"
cd "$ROOT"

# Create a fresh deploy branch
git branch -D gh-pages 2>/dev/null || true
git checkout --orphan gh-pages

# Copy portfolio as index
cp portfolio.html index.html

# Add all files except large videos (>100MB), node_modules, and dev files
git add index.html .gitignore
git add "个人照片.jpg" "李颖-AI.pdf" "作品网站封面底图.JPG" "运营经历.pdf" "首页个人作品集.pdf" 2>/dev/null || true

# Add directories (skip large video files)
git add assets/ 2>/dev/null || true
git add 运营/ 2>/dev/null || true
git add 中药/ 2>/dev/null || true
git add 游戏/ 2>/dev/null || true

# Only add small video files (<100MB)
for f in 视频作品/*.mp4; do
  size=$(stat -c%s "$f" 2>/dev/null)
  if [ "$size" -lt 100000000 ] 2>/dev/null; then
    git add "$f"
  else
    echo "Skipping large file: $f ($(( size / 1000000 ))MB)"
  fi
done
# Add remaining video files (thumbnails, images)
git add 视频作品/*.jpg 视频作品/*.png 2>/dev/null || true

# Commit and push
git commit -m "Deploy portfolio site"
git push -f origin gh-pages

# Back to main
git checkout main
echo "✅ Deployed to gh-pages!"
echo "🌐 Enable GitHub Pages at:"
echo "   https://github.com/ly2622319390-afk/bomb-timer/settings/pages"
echo "📎 Select branch: gh-pages, root: /"
echo "🔗 Your site will be at:"
echo "   https://ly2622319390-afk.github.io/bomb-timer/"
