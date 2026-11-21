import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('sameeksha-birthday/dist');

if (!fs.existsSync(srcDir)) {
  console.error('Source dist directory does not exist:', srcDir);
  process.exit(1);
}

// Sync entry files to root for GitHub Pages direct root deployment
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

console.log('✓ Successfully synced build to root for GitHub Pages!');
