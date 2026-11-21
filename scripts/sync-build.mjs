import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('sameeksha-birthday/dist');

if (!fs.existsSync(srcDir)) {
  console.error('Source dist directory does not exist:', srcDir);
  process.exit(1);
}

function syncToDirectory(targetDir, name) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy root files
  fs.copyFileSync(path.join(srcDir, 'index.html'), path.join(targetDir, 'index.html'));
  if (fs.existsSync(path.join(srcDir, '404.html'))) {
    fs.copyFileSync(path.join(srcDir, '404.html'), path.join(targetDir, '404.html'));
  }
  fs.writeFileSync(path.join(targetDir, '.nojekyll'), '');

  // Copy assets
  if (fs.existsSync(path.join(srcDir, 'assets'))) {
    const targetAssets = path.join(targetDir, 'assets');
    if (fs.existsSync(targetAssets)) {
      fs.rmSync(targetAssets, { recursive: true, force: true });
    }
    fs.cpSync(path.join(srcDir, 'assets'), targetAssets, { recursive: true });
  }

  // Copy images
  if (fs.existsSync(path.join(srcDir, 'images'))) {
    const targetImages = path.join(targetDir, 'images');
    if (fs.existsSync(targetImages)) {
      fs.rmSync(targetImages, { recursive: true, force: true });
    }
    fs.cpSync(path.join(srcDir, 'images'), targetImages, { recursive: true });
  }

  // Copy audio
  if (fs.existsSync(path.join(srcDir, 'audio'))) {
    const targetAudio = path.join(targetDir, 'audio');
    if (fs.existsSync(targetAudio)) {
      fs.rmSync(targetAudio, { recursive: true, force: true });
    }
    fs.cpSync(path.join(srcDir, 'audio'), targetAudio, { recursive: true });
  }

  console.log(`✓ Successfully synced build to ${name}!`);
}

// Sync to root (/)
syncToDirectory(path.resolve('.'), 'root');

// Sync to docs (/docs) for repositories configured to deploy from /docs
syncToDirectory(path.resolve('docs'), 'docs');
