import os
import re

content_path = 'sameeksha-birthday/src/content/siteContent.ts'
with open(content_path, 'r', encoding='utf-8') as f:
    text = f.read()

matches = re.findall(r"src:\s*'(/images/[^']+)'", text)
print(f'Total photos in siteContent: {len(matches)}')

missing_public = []
missing_root = []
missing_docs = []

for p in matches:
    rel = p.lstrip('/')
    if not os.path.exists(os.path.join('sameeksha-birthday/public', rel)):
        missing_public.append(p)
    if not os.path.exists(os.path.join('.', rel)):
        missing_root.append(p)
    if not os.path.exists(os.path.join('docs', rel)):
        missing_docs.append(p)

print('Missing in sameeksha-birthday/public:', missing_public)
print('Missing in root /images:', missing_root)
print('Missing in docs /images:', missing_docs)

# Now check audio files
audio_path = 'sameeksha-birthday/src/utils/audio.ts'
with open(audio_path, 'r', encoding='utf-8') as f:
    atext = f.read()

amatches = re.findall(r"src:\s*'(/audio/[^']+)'", atext)
print(f'\nTotal audio files in audio.ts: {len(amatches)}')
missing_audio_public = []
missing_audio_root = []
missing_audio_docs = []

for a in set(amatches):
    rel = a.lstrip('/')
    if not os.path.exists(os.path.join('sameeksha-birthday/public', rel)):
        missing_audio_public.append(a)
    if not os.path.exists(os.path.join('.', rel)):
        missing_audio_root.append(a)
    if not os.path.exists(os.path.join('docs', rel)):
        missing_audio_docs.append(a)

print('Missing audio in public:', missing_audio_public)
print('Missing audio in root:', missing_audio_root)
print('Missing audio in docs:', missing_audio_docs)
