import os
import shutil

# Remove reels directories
reels_dirs = [
    'sameeksha-birthday/public/audio/reels',
    'audio/reels',
    'docs/audio/reels',
    'sameeksha-birthday/dist/audio/reels'
]

removed_bytes = 0

for d in reels_dirs:
    if os.path.exists(d):
        for r, _, fs in os.walk(d):
            for f in fs:
                removed_bytes += os.path.getsize(os.path.join(r, f))
        shutil.rmtree(d, ignore_errors=True)
        print(f'Removed directory: {d}')

# Remove duplicate .m4a files that have .mp3 equivalents
duplicate_m4a = [
    'party-desi-boyz.m4a',
    'party-long-drive.m4a',
    'party-mujhko-yaad-sataye.m4a',
    'party-hookah-bar.m4a',
    'retro-chura-liya.m4a',
    'retro-gulabi-aankhen.m4a',
    'retro-o-mere-dil-ke-chain.m4a'
]

base_dirs = [
    'sameeksha-birthday/public/audio',
    'audio',
    'docs/audio',
    'sameeksha-birthday/dist/audio'
]

for b in base_dirs:
    for m in duplicate_m4a:
        fp = os.path.join(b, m)
        if os.path.exists(fp):
            removed_bytes += os.path.getsize(fp)
            os.remove(fp)
            print(f'Removed duplicate: {fp}')

print(f'\nTotal freed disk space: {removed_bytes / (1024 * 1024):.2f} MB!')
