import json
import re

with open('scripts/new_songs_manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

print(f"Loaded {len(manifest)} new tracks from manifest.")

# 1. Update reelSongs.ts
with open('sameeksha-birthday/src/utils/reelSongs.ts', 'r', encoding='utf-8') as f:
    reel_content = f.read()

# Build new reel tracks list for REEL_SONGS
new_reel_items = []
for idx, item in enumerate(manifest):
    new_reel_items.append({
        "id": f"reel-req-{idx+1:02d}",
        "songTitle": item['title'],
        "artist": item['artist'],
        "album": item['album'] or item['title'],
        "category": "celebration" if item['category'] == 'party' else ("punjabi" if item['category'] == 'punjabi' else "romantic"),
        "src": item['reel_src'],
        "streamUrl": item['streamUrl'],
        "duration": "0:30"
    })

# Find REEL_SONGS = [ ... ]
pattern = r'export const REEL_SONGS: ReelSongTrack\[\] = \[\n'
match = re.search(pattern, reel_content)
if match:
    insert_pos = match.end()
    json_items = ",\n".join(json.dumps(it, indent=2) for it in new_reel_items) + ",\n"
    # Indent
    json_items_indented = "\n".join("  " + line if line else "" for line in json_items.split("\n"))
    updated_reel = reel_content[:insert_pos] + json_items_indented + reel_content[insert_pos:]
    with open('sameeksha-birthday/src/utils/reelSongs.ts', 'w', encoding='utf-8') as f:
        f.write(updated_reel)
    print("✓ Updated sameeksha-birthday/src/utils/reelSongs.ts with new top-priority memory reel songs!")
else:
    print("! Could not find pattern in reelSongs.ts")

# 2. Update audio.ts
with open('sameeksha-birthday/src/utils/audio.ts', 'r', encoding='utf-8') as f:
    audio_content = f.read()

# Group new tracks by category
hindi_tracks = [t for t in manifest if t['category'] == 'hindi']
punjabi_tracks = [t for t in manifest if t['category'] == 'punjabi']
party_tracks = [t for t in manifest if t['category'] == 'party']

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

# Insert hindi tracks at the end of HINDI section (before birthday section)
hindi_insertion = "\n".join(format_playlist_track(t) for t in hindi_tracks) + "\n"
audio_content = audio_content.replace(
    "  // ========== 2. BIRTHDAY CELEBRATION HITS ==========",
    hindi_insertion + "  // ========== 2. BIRTHDAY CELEBRATION HITS =========="
)

# Insert punjabi tracks at the end of PUNJABI section (before party section)
punjabi_insertion = "\n".join(format_playlist_track(t) for t in punjabi_tracks) + "\n"
audio_content = audio_content.replace(
    "  // ========== 4. PARTY DANCE BUSTERS ==========",
    punjabi_insertion + "  // ========== 4. PARTY DANCE BUSTERS =========="
)

# Insert party tracks at the end of PARTY section (before export interface PhotoReelTrack)
party_insertion = "\n".join(format_playlist_track(t) for t in party_tracks) + "\n"
audio_content = audio_content.replace(
    "];\n\nexport interface PhotoReelTrack {",
    party_insertion + "];\n\nexport interface PhotoReelTrack {"
)

# Also add to PHOTO_REEL_SOUNDTRACKS
photo_reel_entries = ""
for t in manifest:
    photo_reel_entries += f"  {{ trackId: '{t['id']}', songTitle: '{t['title']}', artist: '{t['artist']}', chorusStartTime: 0 }},\n"

audio_content = audio_content.replace(
    "export const PHOTO_REEL_SOUNDTRACKS: PhotoReelTrack[] = [\n",
    "export const PHOTO_REEL_SOUNDTRACKS: PhotoReelTrack[] = [\n" + photo_reel_entries
)

with open('sameeksha-birthday/src/utils/audio.ts', 'w', encoding='utf-8') as f:
    f.write(audio_content)

print("✓ Updated sameeksha-birthday/src/utils/audio.ts with 12 new playlist and reel tracks!")
