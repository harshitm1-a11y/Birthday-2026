import urllib.request
import urllib.parse
import json
import os
import re

SONGS = [
    {
        'id': 'party-desi-boyz',
        'title': 'Make Some Noise For The Desi Boyz',
        'artist': 'KK, Bob & Pritam (Desi Boyz)',
        'category': 'party',
        'query': 'Make Some Noise For The Desi Boyz',
        'filename': 'party-desi-boyz.m4a',
        'desc': 'Iconic high-energy title track: Make some noise for the Desi Boyz!'
    },
    {
        'id': 'punjabi-daru-badnaam',
        'title': 'Daru Badnaam',
        'artist': 'Param Singh & Kamal Kahlon',
        'category': 'punjabi',
        'query': 'Daru Badnaam Kamal Kahlon Param Singh',
        'filename': 'punjabi-daru-badnaam.m4a',
        'desc': 'All-time massive Punjabi celebration anthem: Daru badnaam kardi!'
    },
    {
        'id': 'retro-gulabi-aankhen',
        'title': 'Gulabi Aankhen',
        'artist': 'Mohammed Rafi (The Train)',
        'category': 'retro',
        'query': 'Gulabi Aankhen Mohammed Rafi',
        'filename': 'retro-gulabi-aankhen.m4a',
        'desc': 'Evergreen romantic celebration: Gulabi aankhen jo teri dekhi, sharabi yeh dil ho gaya!'
    },
    {
        'id': 'retro-pal-pal-dil-ke-paas',
        'title': 'Pal Pal Dil Ke Paas',
        'artist': 'Kishore Kumar (Blackmail)',
        'category': 'retro',
        'query': 'Pal Pal Dil Ke Paas Kishore Kumar',
        'filename': 'retro-pal-pal-dil-ke-paas.m4a',
        'desc': 'Timeless golden classic: Pal pal dil ke paas tum rehti ho'
    },
    {
        'id': 'retro-chura-liya',
        'title': 'Chura Liya Hai Tumne Jo Dil Ko',
        'artist': 'Asha Bhosle & Mohammed Rafi (Yaadon Ki Baaraat)',
        'category': 'retro',
        'query': 'Chura Liya Hai Tumne Jo Dil Ko Asha Bhosle',
        'filename': 'retro-chura-liya.m4a',
        'desc': 'Legendary romantic retro melody with beautiful acoustic glasses and guitar intro'
    },
    {
        'id': 'retro-badan-pe-sitare',
        'title': 'Badan Pe Sitare Lapete Huye',
        'artist': 'Mohammed Rafi (Prince)',
        'category': 'retro',
        'query': 'Badan Pe Sitare Lapete Huye Mohammed Rafi',
        'filename': 'retro-badan-pe-sitare.m4a',
        'desc': 'Iconic classic party melody: Badan pe sitare lapete huye, o jaan-e-tamanna kidhar jaa rahi ho'
    },
    {
        'id': 'retro-yeh-shaam-mastani',
        'title': 'Yeh Sham Mastani',
        'artist': 'Kishore Kumar (Kati Patang)',
        'category': 'retro',
        'query': 'Yeh Shaam Mastani Kati Patang Kishore',
        'filename': 'retro-yeh-shaam-mastani.m4a',
        'desc': 'Soulful evening romance: Yeh sham mastani madhosh kiye jaaye'
    },
    {
        'id': 'retro-likhe-jo-khat-tujhe',
        'title': 'Likhe Jo Khat Tujhe',
        'artist': 'Mohammed Rafi (Kanyadaan)',
        'category': 'retro',
        'query': 'Likhe Jo Khat Tujhe Mohammed Rafi',
        'filename': 'retro-likhe-jo-khat-tujhe.m4a',
        'desc': 'All-time nostalgic love song: Likhe jo khat tujhe woh teri yaad mein'
    },
    {
        'id': 'retro-o-mere-dil-ke-chain',
        'title': 'O Mere Dil Ke Chain',
        'artist': 'Kishore Kumar (Mere Jeevan Saathi)',
        'category': 'retro',
        'query': 'O Mere Dil Ke Chain Kishore Kumar',
        'filename': 'retro-o-mere-dil-ke-chain.m4a',
        'desc': 'Timeless romantic peace: O mere dil ke chain, chain aaye mere dil ko dua kijiye'
    },
    {
        'id': 'retro-khaike-paan',
        'title': 'Khaike Paan Banaras Wala',
        'artist': 'Kishore Kumar (Don)',
        'category': 'retro',
        'query': 'Khaike Paan Banaras Wala Kishore Kumar',
        'filename': 'retro-khaike-paan.m4a',
        'desc': 'Fun, energetic vintage celebration: Khaike paan banaras wala!'
    },
    {
        'id': 'retro-mere-sapnon-ki-rani',
        'title': 'Mere Sapnon Ki Rani',
        'artist': 'Kishore Kumar (Aradhana)',
        'category': 'retro',
        'query': 'Mere Sapno Ki Rani Aradhana',
        'filename': 'retro-mere-sapnon-ki-rani.m4a',
        'desc': 'Iconic vintage train romance anthem: Mere sapnon ki rani kab aayegi tu'
    },
    {
        'id': 'retro-bachna-ae-haseeno',
        'title': 'Bachna Ae Haseeno',
        'artist': 'Kishore Kumar (Hum Kisise Kum Naheen)',
        'category': 'retro',
        'query': 'Bachna Ae Haseeno Hum Kisise Kum Naheen',
        'filename': 'retro-bachna-ae-haseeno.m4a',
        'desc': 'Vintage dance sensation: Bachna ae haseeno lo main aa gaya!'
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

for idx, item in enumerate(SONGS):
    print(f"[{idx+1}/{len(SONGS)}] Searching: {item['query']}...")
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
                    reel_filename = f"reel-retro-{idx+1:02d}.m4a"
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
                        'reel_id': f"reel-retro-{idx+1:02d}",
                        'reel_src': f"/audio/reels/{reel_filename}",
                        'streamUrl': preview_url,
                        'album': album_name,
                        'trackName': track_name,
                        'artistName': artist_name
                    })
    except Exception as e:
        print(f"   ! Error for {item['query']}: {e}")

print(f"\nSuccessfully downloaded {len(downloaded_tracks)} songs!")

with open('scripts/retro_manifest.json', 'w', encoding='utf-8') as f:
    json.dump(downloaded_tracks, f, indent=2)

# --- 1. Update reelSongs.ts ---
with open('sameeksha-birthday/src/utils/reelSongs.ts', 'r', encoding='utf-8') as f:
    reel_content = f.read()

new_reel_items = []
for idx, item in enumerate(downloaded_tracks):
    new_reel_items.append({
        "id": f"reel-retro-{idx+1:02d}",
        "songTitle": item['title'],
        "artist": item['artist'],
        "album": item['album'] or item['title'],
        "category": "celebration" if item['category'] in ['party', 'retro'] else ("punjabi" if item['category'] == 'punjabi' else "romantic"),
        "src": item['reel_src'],
        "streamUrl": item['streamUrl'],
        "duration": "0:30"
    })

pattern = r'export const REEL_SONGS: ReelSongTrack\[\] = \[\n'
match = re.search(pattern, reel_content)
if match:
    insert_pos = match.end()
    json_items = ",\n".join(json.dumps(it, indent=2) for it in new_reel_items) + ",\n"
    json_items_indented = "\n".join("  " + line if line else "" for line in json_items.split("\n"))
    updated_reel = reel_content[:insert_pos] + json_items_indented + reel_content[insert_pos:]
    with open('sameeksha-birthday/src/utils/reelSongs.ts', 'w', encoding='utf-8') as f:
        f.write(updated_reel)
    print("✓ Updated sameeksha-birthday/src/utils/reelSongs.ts with Desi Boyz, Daru Badnaam, and Retro classics!")

# --- 2. Update audio.ts ---
with open('sameeksha-birthday/src/utils/audio.ts', 'r', encoding='utf-8') as f:
    audio_content = f.read()

# Update category type
audio_content = audio_content.replace(
    "category: 'hindi' | 'punjabi' | 'theme' | 'birthday' | 'party';",
    "category: 'hindi' | 'punjabi' | 'theme' | 'birthday' | 'party' | 'retro';"
)

def format_playlist_track(t):
    return f"""  {{
    id: '{t["id"]}',
    title: '{t["title"]}',
    artist: '{t["artist"]}',
    category: '{t["category"]}',
    type: 'file',
    src: '{t["src"]}',
    duration: '{t["duration"]}',
    description: '{t["description"]}',
  }},"""

# Retro tracks section
retro_tracks = [t for t in downloaded_tracks if t['category'] == 'retro']
desi_party = [t for t in downloaded_tracks if t['id'] == 'party-desi-boyz']
daru_punjabi = [t for t in downloaded_tracks if t['id'] == 'punjabi-daru-badnaam']

retro_section = """  // ========== 5. GOLDEN RETRO CLASSICS (Rafi, Kishore Kumar, Asha Bhosle) ==========
""" + "\n".join(format_playlist_track(t) for t in retro_tracks) + "\n"

# Insert party-desi-boyz before party section closes
if desi_party:
    audio_content = audio_content.replace(
        "  // ========== 4. PARTY DANCE BUSTERS ==========\n",
        "  // ========== 4. PARTY DANCE BUSTERS ==========\n" + format_playlist_track(desi_party[0]) + "\n"
    )

# Insert punjabi-daru-badnaam in punjabi section
if daru_punjabi:
    audio_content = audio_content.replace(
        "  // ========== 3. PUNJABI REAL VOCAL HITS ==========\n",
        "  // ========== 3. PUNJABI REAL VOCAL HITS ==========\n" + format_playlist_track(daru_punjabi[0]) + "\n"
    )

# Insert retro section right before export interface PhotoReelTrack
audio_content = audio_content.replace(
    "];\n\nexport interface PhotoReelTrack {",
    retro_section + "];\n\nexport interface PhotoReelTrack {"
)

# Also add to PHOTO_REEL_SOUNDTRACKS
photo_reel_entries = ""
for t in downloaded_tracks:
    photo_reel_entries += f"  {{ trackId: '{t['id']}', songTitle: '{t['title']}', artist: '{t['artist']}', chorusStartTime: 0 }},\n"

audio_content = audio_content.replace(
    "export const PHOTO_REEL_SOUNDTRACKS: PhotoReelTrack[] = [\n",
    "export const PHOTO_REEL_SOUNDTRACKS: PhotoReelTrack[] = [\n" + photo_reel_entries
)

with open('sameeksha-birthday/src/utils/audio.ts', 'w', encoding='utf-8') as f:
    f.write(audio_content)

print("✓ Updated sameeksha-birthday/src/utils/audio.ts with Retro category & tracks!")
