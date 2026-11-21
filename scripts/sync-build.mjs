import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('sameeksha-birthday/dist');

if (!fs.existsSync(srcDir)) {
  console.error('Source dist directory does not exist:', srcDir);
  process.exit(1);
}

// 1. Sync to docs/ (for GitHub Pages /docs folder deployment)
const docsDir = path.resolve('docs');
fs.cpSync(srcDir, docsDir, { recursive: true });
console.log('✓ Successfully synced build to docs/');

// 2. Sync to root dist/
const distDir = path.resolve('dist');
fs.cpSync(srcDir, distDir, { recursive: true });
console.log('✓ Successfully synced build to dist/');

// 3. Copy critical entry files to root so root deployment also serves index.html directly
fs.copyFileSync(path.join(srcDir, 'index.html'), path.resolve('index.html'));
fs.copyFileSync(path.join(srcDir, '404.html'), path.resolve('404.html'));
fs.writeFileSync(path.resolve('.nojekyll'), '');

if (fs.existsSync(path.join(srcDir, 'assets'))) {
  fs.cpSync(path.join(srcDir, 'assets'), path.resolve('assets'), { recursive: true });
}
if (fs.existsSync(path.join(srcDir, 'images'))) {
  fs.cpSync(path.join(srcDir, 'images'), path.resolve('images'), { recursive: true });
}
if (fs.existsSync(path.join(srcDir, 'audio'))) {
  fs.cpSync(path.join(srcDir, 'audio'), path.resolve('audio'), { recursive: true });
}

console.log('✓ Successfully prepared all GitHub Pages deployment targets (root, docs, dist)!');
