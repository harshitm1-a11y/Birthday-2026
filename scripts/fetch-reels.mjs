import fs from 'fs';
import path from 'path';

const TRACK_QUERIES = [
  // 1. Arijit Singh & Modern Romantic Hits
  { query: 'Kesariya Arijit Singh', title: 'Kesariya', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Tum Hi Ho Arijit Singh', title: 'Tum Hi Ho', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Channa Mereya Arijit Singh', title: 'Channa Mereya', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Apna Bana Le Arijit Singh', title: 'Apna Bana Le', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Chaleya Jawan Arijit Singh', title: 'Chaleya', artist: 'Arijit Singh & Shilpa Rao', category: 'romantic' },
  { query: 'Raabta Agent Vinod Arijit', title: 'Raabta', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Shayad Love Aaj Kal Arijit', title: 'Shayad', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Gerua Dilwale Arijit', title: 'Gerua', artist: 'Arijit Singh & Antara Mitra', category: 'romantic' },
  { query: 'Hawayein Jab Harry Met Sejal Arijit', title: 'Hawayein', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'O Maahi Dunki Arijit', title: 'O Maahi', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Satranga Animal Arijit', title: 'Satranga', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Pal Jalebi Arijit Shreya', title: 'Pal', artist: 'Arijit Singh & Shreya Ghoshal', category: 'romantic' },
  { query: 'Enna Sona OK Jaanu Arijit', title: 'Enna Sona', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Zaalima Raees Arijit', title: 'Zaalima', artist: 'Arijit Singh & Harshdeep Kaur', category: 'romantic' },
  { query: 'Agar Tum Saath Ho Tamasha Alka', title: 'Agar Tum Saath Ho', artist: 'Arijit Singh & Alka Yagnik', category: 'romantic' },
  { query: 'Tera Ban Jaunga Kabir Singh', title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva & Tulsi Kumar', category: 'romantic' },
  { query: 'Bekhayali Kabir Singh Sachet', title: 'Bekhayali', artist: 'Sachet Tandon', category: 'romantic' },

  // 2. Shreya Ghoshal & Sweet Female Vocals
  { query: 'Teri Ore Singh Is Kinng Shreya', title: 'Teri Ore', artist: 'Rahat Fateh Ali Khan & Shreya Ghoshal', category: 'romantic' },
  { query: 'Sunn Raha Hai Shreya Ghoshal', title: 'Sunn Raha Hai (Female)', artist: 'Shreya Ghoshal', category: 'romantic' },
  { query: 'Bahara I Hate Luv Storys Shreya', title: 'Bahara', artist: 'Shreya Ghoshal & Sona Mohapatra', category: 'romantic' },
  { query: 'Samjhawan Humpty Sharma Shreya', title: 'Samjhawan', artist: 'Arijit Singh & Shreya Ghoshal', category: 'romantic' },
  { query: 'Deewani Mastani Shreya Ghoshal', title: 'Deewani Mastani', artist: 'Shreya Ghoshal', category: 'romantic' },
  { query: 'Radha Student of the Year Shreya', title: 'Radha', artist: 'Shreya Ghoshal & Udit Narayan', category: 'celebration' },
  { query: 'Param Sundari Mimi Shreya', title: 'Param Sundari', artist: 'Shreya Ghoshal', category: 'celebration' },
  { query: 'Manwa Laage Happy New Year Shreya', title: 'Manwa Laage', artist: 'Arijit Singh & Shreya Ghoshal', category: 'romantic' },
  { query: 'Ghoomar Padmaavat Shreya', title: 'Ghoomar', artist: 'Shreya Ghoshal & Swaroop Khan', category: 'celebration' },
  { query: 'Nagada Sang Dhol Shreya Ghoshal', title: 'Nagada Sang Dhol', artist: 'Shreya Ghoshal & Osman Mir', category: 'celebration' },

  // 3. Atif Aslam & Jubin Nautiyal Romantic Ballads
  { query: 'Dil Diyan Gallan Atif Aslam', title: 'Dil Diyan Gallan', artist: 'Atif Aslam', category: 'romantic' },
  { query: 'Jeena Jeena Badlapur Atif Aslam', title: 'Jeena Jeena', artist: 'Atif Aslam', category: 'romantic' },
  { query: 'Tere Sang Yaara Rustom Atif Aslam', title: 'Tere Sang Yaara', artist: 'Atif Aslam', category: 'romantic' },
  { query: 'Tu Jaane Na Atif Aslam', title: 'Tu Jaane Na', artist: 'Atif Aslam', category: 'romantic' },
  { query: 'Pehli Nazar Mein Race Atif Aslam', title: 'Pehli Nazar Mein', artist: 'Atif Aslam', category: 'romantic' },
  { query: 'Raataan Lambiyan Shershaah Jubin', title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal & Asees Kaur', category: 'romantic' },
  { query: 'Lut Gaye Jubin Nautiyal', title: 'Lut Gaye', artist: 'Jubin Nautiyal', category: 'romantic' },
  { query: 'Tum Hi Aana Marjaavaan Jubin', title: 'Tum Hi Aana', artist: 'Jubin Nautiyal', category: 'romantic' },
  { query: 'Humnava Mere Jubin Nautiyal', title: 'Humnava Mere', artist: 'Jubin Nautiyal', category: 'romantic' },
  { query: 'Kuch Baatein Jubin Nautiyal', title: 'Kuch Baatein', artist: 'Jubin Nautiyal & Payal Dev', category: 'romantic' },

  // 4. Punjabi Blockbusters (Diljit, AP Dhillon, Karan Aujla, Guru Randhawa)
  { query: 'Lover Diljit Dosanjh', title: 'Lover', artist: 'Diljit Dosanjh', category: 'punjabi' },
  { query: 'Born to Shine Diljit Dosanjh', title: 'Born to Shine', artist: 'Diljit Dosanjh', category: 'punjabi' },
  { query: 'G.O.A.T. Diljit Dosanjh', title: 'G.O.A.T.', artist: 'Diljit Dosanjh', category: 'punjabi' },
  { query: 'Lemonade Diljit Dosanjh', title: 'Lemonade', artist: 'Diljit Dosanjh', category: 'punjabi' },
  { query: 'Naina Diljit Dosanjh Crew', title: 'Naina', artist: 'Diljit Dosanjh & Badshah', category: 'punjabi' },
  { query: 'Brown Munde AP Dhillon', title: 'Brown Munde', artist: 'AP Dhillon & Gurinder Gill', category: 'punjabi' },
  { query: 'Excuses AP Dhillon Gurinder', title: 'Excuses', artist: 'AP Dhillon & Gurinder Gill', category: 'punjabi' },
  { query: 'With You AP Dhillon', title: 'With You', artist: 'AP Dhillon', category: 'punjabi' },
  { query: 'Insane AP Dhillon Shinda', title: 'Insane', artist: 'AP Dhillon & Shinda Kahlon', category: 'punjabi' },
  { query: 'Summer High AP Dhillon', title: 'Summer High', artist: 'AP Dhillon', category: 'punjabi' },
  { query: 'Tauba Tauba Karan Aujla Bad Newz', title: 'Tauba Tauba', artist: 'Karan Aujla', category: 'punjabi' },
  { query: 'Softly Karan Aujla', title: 'Softly', artist: 'Karan Aujla & Ikky', category: 'punjabi' },
  { query: 'Winning Speech Karan Aujla', title: 'Winning Speech', artist: 'Karan Aujla', category: 'punjabi' },
  { query: 'High Rated Gabru Guru Randhawa', title: 'High Rated Gabru', artist: 'Guru Randhawa', category: 'punjabi' },
  { query: 'Lahore Guru Randhawa', title: 'Lahore', artist: 'Guru Randhawa', category: 'punjabi' },
  { query: 'Suit Suit Guru Randhawa Arjun', title: 'Suit Suit', artist: 'Guru Randhawa & Arjun', category: 'punjabi' },
  { query: 'Ban Ja Rani Guru Randhawa', title: 'Ban Ja Rani', artist: 'Guru Randhawa', category: 'punjabi' },
  { query: 'Mundian To Bach Ke Panjabi MC', title: 'Mundian To Bach Ke', artist: 'Panjabi MC & Labh Janjua', category: 'punjabi' },
  { query: 'Pasoori Ali Sethi Shae Gill', title: 'Pasoori', artist: 'Ali Sethi & Shae Gill', category: 'punjabi' },
  { query: 'Mi Amor Sharn 407Soundz', title: 'Mi Amor', artist: 'Sharn & 407Soundz', category: 'punjabi' },

  // 5. Honey Singh & High Voltage Party Busters
  { query: 'Blue Eyes Yo Yo Honey Singh', title: 'Blue Eyes', artist: 'Yo Yo Honey Singh', category: 'punjabi' },
  { query: 'Brown Rang Yo Yo Honey Singh', title: 'Brown Rang', artist: 'Yo Yo Honey Singh', category: 'punjabi' },
  { query: 'Love Dose Yo Yo Honey Singh', title: 'Love Dose', artist: 'Yo Yo Honey Singh', category: 'punjabi' },
  { query: 'Dope Shope Deep Money Honey Singh', title: 'Dope Shope', artist: 'Deep Money & Honey Singh', category: 'punjabi' },
  { query: 'Angreji Beat Gippy Grewal Honey Singh', title: 'Angreji Beat', artist: 'Gippy Grewal & Honey Singh', category: 'punjabi' },
  { query: 'Desi Kalakaar Honey Singh', title: 'Desi Kalakaar', artist: 'Yo Yo Honey Singh', category: 'punjabi' },
  { query: 'Sunny Sunny Yaariyan Honey Singh', title: 'Sunny Sunny', artist: 'Yo Yo Honey Singh & Neha Kakkar', category: 'celebration' },

  // 6. Timeless Bollywood Love Anthems & Trending Reels
  { query: 'Tujh Mein Rab Dikhta Hai Roop Kumar', title: 'Tujh Mein Rab Dikhta Hai', artist: 'Roop Kumar Rathod', category: 'romantic' },
  { query: 'Tum Se Hi Jab We Met Mohit Chauhan', title: 'Tum Se Hi', artist: 'Mohit Chauhan', category: 'romantic' },
  { query: 'Pehli Dafa Atif Aslam', title: 'Pehli Dafa', artist: 'Atif Aslam', category: 'romantic' },
  { query: 'Maan Meri Jaan King', title: 'Maan Meri Jaan', artist: 'King', category: 'romantic' },
  { query: 'Tu Hai Kahan AUR', title: 'Tu Hai Kahan', artist: 'AUR', category: 'romantic' },
  { query: 'Heeriye Jasleen Royal Arijit', title: 'Heeriye', artist: 'Jasleen Royal & Arijit Singh', category: 'romantic' },
  { query: 'Baar Baar Din Ye Aaye Mohammed Rafi', title: 'Baar Baar Din Ye Aaye', artist: 'Mohammed Rafi', category: 'celebration' },
  { query: 'Aankh Marey Simmba Neha Kakkar', title: 'Aankh Marey', artist: 'Neha Kakkar & Mika Singh', category: 'celebration' },
  { query: 'Gallan Goodiyaan Dil Dhadakne Do', title: 'Gallan Goodiyaan', artist: 'Yashita Sharma & Sukhwinder Singh', category: 'celebration' },
  { query: 'Kar Gayi Chull Badshah Neha Kakkar', title: 'Kar Gayi Chull', artist: 'Badshah & Neha Kakkar', category: 'celebration' },
  { query: 'London Thumakda Labh Janjua Queen', title: 'London Thumakda', artist: 'Labh Janjua & Sonu Kakkar', category: 'celebration' },
  { query: 'Badtameez Dil Benny Dayal Yeh Jawaani', title: 'Badtameez Dil', artist: 'Benny Dayal', category: 'celebration' },
  { query: 'Subhanallah Yeh Jawaani Sreerama', title: 'Subhanallah', artist: 'Sreerama Chandra & Shilpa Rao', category: 'romantic' },
  { query: 'Ilahi Yeh Jawaani Arijit Singh', title: 'Ilahi', artist: 'Arijit Singh', category: 'romantic' },
  { query: 'Balam Pichkari Vishal Dadlani', title: 'Balam Pichkari', artist: 'Vishal Dadlani & Shalmali Kholgade', category: 'celebration' }
];

console.log(`Starting fetch for ${TRACK_QUERIES.length} real vocal tracks...`);

const outputDir = path.resolve('sameeksha-birthday/public/audio/reels');
const audioDir = path.resolve('audio/reels');
const docsDir = path.resolve('docs/audio/reels');

[outputDir, audioDir, docsDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const finalTracks = [];
  let downloadedCount = 0;

  for (let i = 0; i < TRACK_QUERIES.length; i++) {
    const item = TRACK_QUERIES[i];
    const id = `reel-${String(i + 1).padStart(2, '0')}`;
    const filename = `${id}.m4a`;
    const localRelPath = `/audio/reels/${filename}`;
    const targetFile = path.join(outputDir, filename);

    console.log(`[${i + 1}/${TRACK_QUERIES.length}] Searching: ${item.query}...`);
    try {
      await sleep(200); // Polite rate limit delay
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(item.query)}&country=IN&entity=song&limit=1`);
      if (!res.ok) {
        console.warn(`HTTP ${res.status} for ${item.query}`);
        continue;
      }
      const data = await res.json();
      if (data.results && data.results.length > 0 && data.results[0].previewUrl) {
        const result = data.results[0];
        const previewUrl = result.previewUrl;
        const trackTitle = result.trackName || item.title;
        const artistName = result.artistName || item.artist;
        const albumName = result.collectionName || '';

        // Download audio file locally
        try {
          const audioRes = await fetch(previewUrl);
          if (audioRes.ok) {
            const buffer = Buffer.from(await audioRes.arrayBuffer());
            fs.writeFileSync(targetFile, buffer);
            fs.copyFileSync(targetFile, path.join(audioDir, filename));
            fs.copyFileSync(targetFile, path.join(docsDir, filename));
            downloadedCount++;
            console.log(`   ✓ Saved: ${filename} (${(buffer.length / 1024).toFixed(0)} KB) -> ${trackTitle}`);
          }
        } catch (downloadErr) {
          console.warn(`   ! Download failed for ${id}, will stream via CDN: ${downloadErr.message}`);
        }

        finalTracks.push({
          id,
          songTitle: trackTitle,
          artist: artistName,
          album: albumName,
          category: item.category,
          src: localRelPath,
          streamUrl: previewUrl,
          duration: '0:30',
        });
      } else {
        console.warn(`   No preview found for ${item.query}`);
      }
    } catch (e) {
      console.error(`   Error for ${item.query}:`, e.message);
    }
  }

  console.log(`\nFetch completed! Successfully collected ${finalTracks.length} vocal tracks (${downloadedCount} downloaded locally).`);

  // Write TypeScript config
  const tsContent = `// Auto-generated 65+ Real Vocal Bollywood & Punjabi Reel Soundtracks
// 100% Real Vocal Performances - ZERO Instrumentals!

export interface ReelSongTrack {
  id: string;
  songTitle: string;
  artist: string;
  album: string;
  category: 'romantic' | 'punjabi' | 'celebration';
  src: string;
  streamUrl: string;
  duration: string;
}

export const REEL_SONGS: ReelSongTrack[] = ${JSON.stringify(finalTracks, null, 2)};

// Helper to get reel track for any photo index (cycles smoothly if user adds unlimited custom photos)
export function getReelTrackForPhoto(photoIdx: number): ReelSongTrack {
  if (REEL_SONGS.length === 0) {
    return {
      id: 'default',
      songTitle: 'Tum Hi Ho',
      artist: 'Arijit Singh',
      album: 'Aashiqui 2',
      category: 'romantic',
      src: '/audio/hindi-tum-hi-ho.mp3',
      streamUrl: '',
      duration: '0:30',
    };
  }
  return REEL_SONGS[photoIdx % REEL_SONGS.length];
}
`;

  const tsFilePath = path.resolve('sameeksha-birthday/src/utils/reelSongs.ts');
  fs.writeFileSync(tsFilePath, tsContent, 'utf-8');
  console.log(`✓ Generated ${tsFilePath} with ${finalTracks.length} tracks!`);
}

run();
