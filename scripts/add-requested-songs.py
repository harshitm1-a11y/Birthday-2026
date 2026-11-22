import urllib.request
import urllib.parse
import json
import os
import shutil

NEW_TRACKS = [
    {
        'id': 'party-long-drive',
        'title': 'Long Drive',
        'artist': 'Mika Singh (Khiladi 786)',
        'category': 'party',
        'query': 'Long Drive Khiladi 786 Mika',
        'filename': 'party-long-drive.m4a',
        'desc': 'High energy dance track with Mika Singh iconic vocals: Long drive pe chal mere naal soniye!'
    },
    {
        'id': 'party-mujhko-yaad-sataye',
        'title': 'Mujhko Yaad Sataye Teri',
        'artist': 'Himesh Reshammiya (Phir Hera Pheri)',
        'category': 'party',
        'query': 'Mujhe Yaad Sataye Teri Himesh',
        'filename': 'party-mujhko-yaad-sataye.m4a',
        'desc': 'Legendary nostalgic superhit by Himesh Reshammiya: Haaye haaye yaad sataye teri!'
    },
    {
        'id': 'party-hookah-bar',
        'title': 'Hookah Bar',
        'artist': 'Himesh Reshammiya (Khiladi 786)',
        'category': 'party',
        'query': 'Hookah Bar Khiladi 786',
        'filename': 'party-hookah-bar.m4a',
        'desc': 'Blockbuster energetic party club anthem: Tera pyaar pyaar pyaar hookah bar!'
    },
    {
        'id': 'party-subha-hone-na-de',
        'title': 'Subha Hone Na De (Tu Mera Hero)',
        'artist': 'Mika Singh & Shefali Alvares (Desi Boyz)',
        'category': 'party',
        'query': 'Subha Hone Na De Mika Singh',
        'filename': 'party-subha-hone-na-de.m4a',
        'desc': 'Ultimate party anthem: Subha hone na de, saath khone na de, tu mera hero!'
    },
    {
        'id': 'punjabi-mauja-hi-mauja',
        'title': 'Mauja Hi Mauja',
        'artist': 'Mika Singh (Jab We Met)',
        'category': 'punjabi',
        'query': 'Mauja Hi Mauja Mika Singh',
        'filename': 'punjabi-mauja-hi-mauja.m4a',
        'desc': 'High-octane Punjabi bhangra celebration anthem by Mika Singh'
    },
    {
        'id': 'hindi-aashiq-banaya',
        'title': 'Aashiq Banaya Aapne',
        'artist': 'Himesh Reshammiya & Shreya Ghoshal',
        'category': 'hindi',
        'query': 'Aashiq Banaya Aapne Himesh Shreya Ghoshal',
        'filename': 'hindi-aashiq-banaya.m4a',
        'desc': 'All-time romantic classic duet by Himesh Reshammiya and Shreya Ghoshal'
    },
    {
        'id': 'hindi-zara-sa',
        'title': 'Zara Sa',
        'artist': 'KK & Pritam (Jannat)',
        'category': 'hindi',
        'query': 'Zara Sa KK Jannat',
        'filename': 'hindi-zara-sa.m4a',
        'desc': 'Iconic heartfelt romance ballad by KK: Zara sa dil mein de jagah tu'
    },
    {
        'id': 'hindi-kya-mujhe-pyaar-hai',
        'title': 'Kya Mujhe Pyaar Hai',
        'artist': 'KK & Pritam (Woh Lamhe)',
        'category': 'hindi',
        'query': 'Kya Mujhe Pyaar Hai KK',
        'filename': 'hindi-kya-mujhe-pyaar-hai.m4a',
        'desc': 'Timeless nostalgic love song by legendary singer KK'
    },
    {
        'id': 'party-dhinka-chika',
        'title': 'Dhinka Chika',
        'artist': 'Mika Singh & Amrita Kak (Ready)',
        'category': 'party',
        'query': 'Dhinka Chika Ready Salman',
        'filename': 'party-dhinka-chika.m4a',
        'desc': 'Celebration dance floor buster by Mika Singh'
    },
    {
        'id': 'party-desi-girl',
        'title': 'Desi Girl',
        'artist': 'Shankar Mahadevan & Sunidhi Chauhan (Dostana)',
        'category': 'party',
        'query': 'Desi Girl Dostana',
        'filename': 'party-desi-girl.m4a',
        'desc': 'All-time favorite Bollywood dance celebration: My desi girl!'
    },
    {
        'id': 'party-dilliwaali-girlfriend',
        'title': 'Dilliwaali Girlfriend',
        'artist': 'Arijit Singh & Sunidhi Chauhan (YJHD)',
        'category': 'party',
        'query': 'Dilliwaali Girlfriend',
        'filename': 'party-dilliwaali-girlfriend.m4a',
        'desc': 'Superhit dance duet by Arijit Singh and Sunidhi Chauhan'
    },
    {
        'id': 'party-tune-maari-entriyaan',
        'title': 'Tune Maari Entriyaan',
        'artist': 'KK, Bappi Lahiri & Neeti Mohan (Gunday)',
        'category': 'party',
        'query': 'Tune Maari Entriyaan Gunday',
        'filename': 'party-tune-maari-entriyaan.m4a',
        'desc': 'Tang tang seetiyaan and pure celebratory energy'
    }
]

# Ensure dirs exist
dirs = [
    'sameeksha-birthday/public/audio',
    'docs/audio',
    'sameeksha-birthday/public/audio/reels',
    'docs/audio/reels'
]
for d in dirs:
    os.makedirs(d, exist_ok=True)

downloaded_tracks = []

for idx, item in enumerate(NEW_TRACKS):
    print(f"[{idx+1}/{len(NEW_TRACKS)}] Searching: {item['query']}...")
    url = 'https://itunes.apple.com/search?term=' + urllib.parse.quote(item['query']) + '&country=IN&entity=song&limit=1'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data['results']:
                r = data['results'][0]
                preview_url = r.get('previewUrl')
                track_name = r.get('trackName', item['title'])
                artist_name = r.get('artistName', item['artist'])
                album_name = r.get('collectionName', '')

                if preview_url:
                    # Download preview file
                    audio_req = urllib.request.Request(preview_url, headers={'User-Agent': 'Mozilla/5.0'})
                    with urllib.request.urlopen(audio_req) as audio_resp:
                        audio_data = audio_resp.read()

                    # Save to /audio/
                    p1 = os.path.join('sameeksha-birthday/public/audio', item['filename'])
                    p2 = os.path.join('docs/audio', item['filename'])
                    with open(p1, 'wb') as f:
                        f.write(audio_data)
                    with open(p2, 'wb') as f:
                        f.write(audio_data)

                    # Also save to /audio/reels/
                    reel_filename = f"reel-custom-{idx+1:02d}.m4a"
                    r1 = os.path.join('sameeksha-birthday/public/audio/reels', reel_filename)
                    r2 = os.path.join('docs/audio/reels', reel_filename)
                    with open(r1, 'wb') as f:
                        f.write(audio_data)
                    with open(r2, 'wb') as f:
                        f.write(audio_data)

                    print(f"   ✓ Downloaded: {item['filename']} ({len(audio_data)//1024} KB) -> {track_name}")

                    downloaded_tracks.append({
                        'id': item['id'],
                        'title': item['title'],
                        'artist': item['artist'],
                        'category': item['category'],
                        'type': 'file',
                        'src': f"/audio/{item['filename']}",
                        'duration': '3:30',
                        'description': item['desc'],
                        'reel_id': f"reel-custom-{idx+1:02d}",
                        'reel_src': f"/audio/reels/{reel_filename}",
                        'streamUrl': preview_url,
                        'album': album_name,
                        'trackName': track_name,
                        'artistName': artist_name
                    })
    except Exception as e:
        print(f"   ! Error for {item['query']}: {e}")

print(f"\nSuccessfully downloaded {len(downloaded_tracks)} songs!")

# Write summary JSON for downstream updates
with open('scripts/new_songs_manifest.json', 'w', encoding='utf-8') as f:
    json.dump(downloaded_tracks, f, indent=2)
