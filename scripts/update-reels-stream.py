import json
import re
import os

with open('sameeksha-birthday/src/utils/reelSongs.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace src with streamUrl if streamUrl is present
# e.g. "src": "/audio/reels/reel-retro-01.m4a",\n    "streamUrl": "https://..."
def replace_src(match):
    src_val = match.group(1)
    stream_val = match.group(2)
    return f'"src": "{stream_val}",\n    "streamUrl": "{stream_val}"'

new_text = re.sub(
    r'"src":\s*"(?:/audio/reels/[^"]+)",\s*\n\s*"streamUrl":\s*"([^"]+)"',
    r'"src": "\1",\n    "streamUrl": "\1"',
    text
)

with open('sameeksha-birthday/src/utils/reelSongs.ts', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated reelSongs.ts to stream directly from CDN!')
