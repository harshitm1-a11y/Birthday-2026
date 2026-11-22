import urllib.request
import os
import shutil
from concurrent.futures import ThreadPoolExecutor

TRACKS = [
    {
        'filename': 'party-long-drive.mp3',
        'url': 'https://archive.org/download/best-of-2012-bollywood-songs/Khiladi%20786%20%282012%29%20-%2003%20-%20Long%20Drive.mp3'
    },
    {
        'filename': 'party-mujhko-yaad-sataye.mp3',
        'url': 'https://archive.org/download/best-of-2006-bollywood-songs/Phir%20Hera%20Pheri%20%282006%29%20-%2001%20-%20Mujhko%20Yaad%20Sataye%20Teri.mp3'
    },
    {
        'filename': 'party-hookah-bar.mp3',
        'url': 'https://archive.org/download/best-of-2012-bollywood-songs/Khiladi%20786%20%282012%29%20-%2005%20-%20Hookah%20Bar.mp3'
    },
    {
        'filename': 'retro-gulabi-aankhen.mp3',
        'url': 'https://archive.org/download/best-of-oldies-vol.-1-bollywood-songs/Gulabi%20Aankhen%20Jo%20Teri%20Dekhi%20-%20The%20Train%20-%20Yaadein%20Vol.%2035%20%28Jhankar%20Beat%29.mp3'
    },
    {
        'filename': 'retro-chura-liya.mp3',
        'url': 'https://archive.org/download/best-of-oldies-vol.-1-bollywood-songs/Chura%20Liya%20Hai%20Tumne%20-%20Yaadon%20Ki%20Baraat-%20Yaadein%20Vol.%2010.mp3'
    },
    {
        'filename': 'retro-o-mere-dil-ke-chain.mp3',
        'url': 'https://archive.org/download/best-of-oldies-vol.-1-bollywood-songs/O%20Mere%20Dil%20Ke%20Chain%20-%20Mere%20Jeevan%20Saathi%20-%20Yaadein%20Vol.%2035%20%28Jhankar%20Beat%29.mp3'
    }
]

dest_dirs = [
    'sameeksha-birthday/public/audio',
    'audio',
    'docs/audio'
]

# Ensure desi-boyz is copied to all 3 directories as well
src_desi = 'sameeksha-birthday/public/audio/party-desi-boyz.mp3'
if os.path.exists(src_desi):
    shutil.copy2(src_desi, 'audio/party-desi-boyz.mp3')
    shutil.copy2(src_desi, 'docs/audio/party-desi-boyz.mp3')
    print('Copied party-desi-boyz.mp3 to audio/ and docs/audio/')

def download_track(item):
    fn = item['filename']
    url = item['url']
    target = os.path.join(dest_dirs[0], fn)
    print(f'Starting download: {fn}...')
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=30) as resp, open(target, 'wb') as out:
            out.write(resp.read())
        size = os.path.getsize(target)
        print(f'Done: {fn} ({size / 1024 / 1024:.2f} MB)')
        # Copy to other 2 directories
        for d in dest_dirs[1:]:
            os.makedirs(d, exist_ok=True)
            shutil.copy2(target, os.path.join(d, fn))
        return True
    except Exception as e:
        print(f'Error downloading {fn}: {e}')
        return False

with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(download_track, TRACKS))

print(f'All finished! Success count: {sum(1 for r in results if r)}/{len(TRACKS)}')
