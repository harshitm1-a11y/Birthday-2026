// Advanced Audio Manager with Multi-Genre Playlist (Hindi, Punjabi, Theme/BGM, Birthday, Party), Audio Ducking, and Sound Effects
import { getAssetUrl } from './assets';

export interface PlaylistTrack {
  id: string;
  title: string;
  artist: string;
  category: 'hindi' | 'punjabi' | 'theme' | 'birthday' | 'party' | 'retro';
  type: 'file' | 'synth';
  src?: string;
  duration: string;
  description: string;
}

export const PLAYLIST_TRACKS: PlaylistTrack[] = [
  // ========== 1. HINDI ROMANTIC VOCAL HITS ==========
  {
    id: 'hindi-tum-hi-ho',
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh (Aashiqui 2)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-tum-hi-ho.mp3',
    duration: '4:22',
    description: 'Iconic heartfelt Bollywood romantic ballad with soulful Arijit Singh vocals',
  },
  {
    id: 'hindi-channa-mereya',
    title: 'Channa Mereya',
    artist: 'Arijit Singh (Ae Dil Hai Mushkil)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-channa-mereya.mp3',
    duration: '4:49',
    description: 'Soul-stirring romantic masterpiece by Arijit Singh',
  },
  {
    id: 'hindi-raataan-lambiyan',
    title: 'Raataan Lambiyan',
    artist: 'Jubin Nautiyal & Asees Kaur (Shershaah)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-raataan-lambiyan.mp3',
    duration: '3:50',
    description: 'Heart-touching romantic melody with magical male-female duet vocals',
  },
  {
    id: 'hindi-dil-diyan-gallan',
    title: 'Dil Diyan Gallan',
    artist: 'Atif Aslam',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-dil-diyan-gallan.mp3',
    duration: '4:20',
    description: 'Soulful romantic waltz celebrating true love and sweet moments',
  },
  {
    id: 'hindi-chahun-main-ya-naa',
    title: 'Chahun Main Ya Naa',
    artist: 'Arijit Singh & Palak Muchhal',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-chahun-main-ya-naa.mp3',
    duration: '5:04',
    description: 'Pure romantic confession with angelic male and female vocals',
  },
  {
    id: 'hindi-tujh-mein-rab',
    title: 'Tujh Mein Rab Dikhta Hai',
    artist: 'Roop Kumar Rathod',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-tujh-mein-rab.mp3',
    duration: '4:41',
    description: 'Timeless anthem of unconditional love and devotion',
  },
  {
    id: 'hindi-sunn-raha-hai',
    title: 'Sunn Raha Hai Na Tu',
    artist: 'Ankit Tiwari (Aashiqui 2)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-sunn-raha-hai.mp3',
    duration: '6:30',
    description: 'Emotionally intense romantic rock ballad with soaring vocals',
  },
  {
    id: 'hindi-tera-ban-jaunga',
    title: 'Tera Ban Jaunga',
    artist: 'Akhil Sachdeva & Tulsi Kumar',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-tera-ban-jaunga.mp3',
    duration: '3:56',
    description: 'Romantic pledge of eternal love and togetherness',
  },

  {
    id: 'hindi-aashiq-banaya',
    title: 'Aashiq Banaya Aapne',
    artist: 'Himesh Reshammiya & Shreya Ghoshal',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-aashiq-banaya.m4a',
    duration: '3:30',
    description: 'All-time romantic classic duet by Himesh Reshammiya and Shreya Ghoshal',
  },
  {
    id: 'hindi-zara-sa',
    title: 'Zara Sa',
    artist: 'KK & Pritam (Jannat)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-zara-sa.m4a',
    duration: '3:30',
    description: 'Iconic heartfelt romance ballad by KK: Zara sa dil mein de jagah tu',
  },
  {
    id: 'hindi-kya-mujhe-pyaar-hai',
    title: 'Kya Mujhe Pyaar Hai',
    artist: 'KK & Pritam (Woh Lamhe)',
    category: 'hindi',
    type: 'file',
    src: '/audio/hindi-kya-mujhe-pyaar-hai.m4a',
    duration: '3:30',
    description: 'Timeless nostalgic love song by legendary singer KK',
  },
  // ========== 2. BIRTHDAY CELEBRATION HITS ==========
  {
    id: 'birthday-pop',
    title: 'Happy Birthday Pop Celebration',
    artist: 'Joyful Birthday Pop Anthem',
    category: 'birthday',
    type: 'file',
    src: '/audio/birthday-pop.mp3',
    duration: '3:12',
    description: 'Upbeat, modern, catchy celebration birthday song for cake cutting',
  },
  {
    id: 'bollywood-birthday',
    title: 'Baar Baar Din Ye Aaye',
    artist: 'Mohammed Rafi (Farz)',
    category: 'birthday',
    type: 'file',
    src: '/audio/bollywood-birthday.mp3',
    duration: '4:48',
    description: 'All-time classic Bollywood birthday anthem for Sameeksha baby',
  },
  {
    id: 'birthday-teddy',
    title: 'Teddy Sings Happy Birthday',
    artist: 'Cute Mascot Ensemble',
    category: 'birthday',
    type: 'file',
    src: '/audio/birthday-teddy.mp3',
    duration: '2:35',
    description: 'Adorable mascot song celebrating Sameeksha\'s 23rd birthday',
  },

  // ========== 3. PUNJABI REAL VOCAL HITS ==========
  {
    id: 'punjabi-daru-badnaam',
    title: 'Daru Badnaam',
    artist: 'Param Singh & Kamal Kahlon',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-daru-badnaam.m4a',
    duration: '3:30',
    description: 'All-time massive Punjabi celebration anthem: Daru badnaam kardi!',
  },
  {
    id: 'punjabi-bhangra',
    title: 'Mundian To Bach Ke',
    artist: 'Panjabi MC & Labh Janjua',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-bhangra.mp3',
    duration: '3:55',
    description: 'Iconic worldwide Punjabi anthem with heavy dhol, tumbi and energetic vocals',
  },
  {
    id: 'party-angreji-beat',
    title: 'Angreji Beat Te',
    artist: 'Gippy Grewal & Yo Yo Honey Singh',
    category: 'punjabi',
    type: 'file',
    src: '/audio/party-angreji-beat.mp3',
    duration: '3:30',
    description: 'Massive Punjabi party banger with energetic dhol and party rhythm',
  },
  {
    id: 'punjabi-blue-eyes',
    title: 'Blue Eyes',
    artist: 'Yo Yo Honey Singh',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-blue-eyes.mp3',
    duration: '3:40',
    description: 'Chart-topping Punjabi dance pop hit for Sameeksha',
  },
  {
    id: 'punjabi-laung-gawacha',
    title: 'Mera Laung Gawacha',
    artist: 'Bhangra Club Legends',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-laung-gawacha.mp3',
    duration: '7:26',
    description: 'All-time Punjabi folk-pop classic with soulful vocals and thumping beats',
  },
  {
    id: 'punjabi-gidda-bhangra',
    title: 'Gidda Pao Haan Deo',
    artist: 'Bhangra Dhol Beats',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-gidda-bhangra.mp3',
    duration: '3:38',
    description: 'High voltage Punjabi Gidda dance celebration track',
  },

  {
    id: 'punjabi-mauja-hi-mauja',
    title: 'Mauja Hi Mauja',
    artist: 'Mika Singh (Jab We Met)',
    category: 'punjabi',
    type: 'file',
    src: '/audio/punjabi-mauja-hi-mauja.m4a',
    duration: '3:30',
    description: 'High-octane Punjabi bhangra celebration anthem by Mika Singh',
  },
  // ========== 4. PARTY DANCE BUSTERS ==========
  {
    id: 'party-desi-boyz',
    title: 'Make Some Noise For The Desi Boyz',
    artist: 'KK, Bob & Pritam (Desi Boyz)',
    category: 'party',
    type: 'file',
    src: '/audio/party-desi-boyz.mp3',
    duration: '4:06',
    description: 'Iconic high-energy title track: Make some noise for the Desi Boyz!',
  },
  {
    id: 'party-brown-rang',
    title: 'Brown Rang',
    artist: 'Yo Yo Honey Singh',
    category: 'party',
    type: 'file',
    src: '/audio/party-brown-rang.mp3',
    duration: '2:58',
    description: 'Iconic dance party anthem that gets everyone moving',
  },
  {
    id: 'party-dope-shope',
    title: 'Dope Shope',
    artist: 'Deep Money & Yo Yo Honey Singh',
    category: 'party',
    type: 'file',
    src: '/audio/party-dope-shope.mp3',
    duration: '3:10',
    description: 'Super-hit party electronic club groove',
  },
  {
    id: 'party-love-dose',
    title: 'Love Dose',
    artist: 'Yo Yo Honey Singh',
    category: 'party',
    type: 'file',
    src: '/audio/party-love-dose.mp3',
    duration: '3:48',
    description: 'Flirty, joyful party romance dance hit',
  },
  {
    id: 'party-long-drive',
    title: 'Long Drive',
    artist: 'Mika Singh (Khiladi 786)',
    category: 'party',
    type: 'file',
    src: '/audio/party-long-drive.mp3',
    duration: '4:15',
    description: 'High energy dance track with Mika Singh iconic vocals: Long drive pe chal mere naal soniye!',
  },
  {
    id: 'party-mujhko-yaad-sataye',
    title: 'Mujhko Yaad Sataye Teri',
    artist: 'Himesh Reshammiya (Phir Hera Pheri)',
    category: 'party',
    type: 'file',
    src: '/audio/party-mujhko-yaad-sataye.mp3',
    duration: '5:24',
    description: 'Legendary nostalgic superhit by Himesh Reshammiya: Haaye haaye yaad sataye teri!',
  },
  {
    id: 'party-hookah-bar',
    title: 'Hookah Bar',
    artist: 'Himesh Reshammiya (Khiladi 786)',
    category: 'party',
    type: 'file',
    src: '/audio/party-hookah-bar.mp3',
    duration: '4:15',
    description: 'Blockbuster energetic party club anthem: Tera pyaar pyaar pyaar hookah bar!',
  },
  {
    id: 'party-subha-hone-na-de',
    title: 'Subha Hone Na De (Tu Mera Hero)',
    artist: 'Mika Singh & Shefali Alvares (Desi Boyz)',
    category: 'party',
    type: 'file',
    src: '/audio/party-subha-hone-na-de.m4a',
    duration: '3:30',
    description: 'Ultimate party anthem: Subha hone na de, saath khone na de, tu mera hero!',
  },
  {
    id: 'party-dhinka-chika',
    title: 'Dhinka Chika',
    artist: 'Mika Singh & Amrita Kak (Ready)',
    category: 'party',
    type: 'file',
    src: '/audio/party-dhinka-chika.m4a',
    duration: '3:30',
    description: 'Celebration dance floor buster by Mika Singh',
  },
  {
    id: 'party-desi-girl',
    title: 'Desi Girl',
    artist: 'Shankar Mahadevan & Sunidhi Chauhan (Dostana)',
    category: 'party',
    type: 'file',
    src: '/audio/party-desi-girl.m4a',
    duration: '3:30',
    description: 'All-time favorite Bollywood dance celebration: My desi girl!',
  },
  {
    id: 'party-dilliwaali-girlfriend',
    title: 'Dilliwaali Girlfriend',
    artist: 'Arijit Singh & Sunidhi Chauhan (YJHD)',
    category: 'party',
    type: 'file',
    src: '/audio/party-dilliwaali-girlfriend.m4a',
    duration: '3:30',
    description: 'Superhit dance duet by Arijit Singh and Sunidhi Chauhan',
  },
  {
    id: 'party-tune-maari-entriyaan',
    title: 'Tune Maari Entriyaan',
    artist: 'KK, Bappi Lahiri & Neeti Mohan (Gunday)',
    category: 'party',
    type: 'file',
    src: '/audio/party-tune-maari-entriyaan.m4a',
    duration: '3:30',
    description: 'Tang tang seetiyaan and pure celebratory energy',
  },
  // ========== 5. GOLDEN RETRO CLASSICS (Rafi, Kishore Kumar, Asha Bhosle) ==========
  {
    id: 'retro-gulabi-aankhen',
    title: 'Gulabi Aankhen',
    artist: 'Mohammed Rafi (The Train)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-gulabi-aankhen.mp3',
    duration: '3:21',
    description: 'Evergreen romantic celebration: Gulabi aankhen jo teri dekhi, sharabi yeh dil ho gaya!',
  },
  {
    id: 'retro-pal-pal-dil-ke-paas',
    title: 'Pal Pal Dil Ke Paas',
    artist: 'Kishore Kumar (Blackmail)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-pal-pal-dil-ke-paas.m4a',
    duration: '3:30',
    description: 'Timeless golden classic: Pal pal dil ke paas tum rehti ho',
  },
  {
    id: 'retro-chura-liya',
    title: 'Chura Liya Hai Tumne Jo Dil Ko',
    artist: 'Asha Bhosle & Mohammed Rafi (Yaadon Ki Baaraat)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-chura-liya.mp3',
    duration: '4:43',
    description: 'Legendary romantic retro melody with beautiful acoustic glasses and guitar intro',
  },
  {
    id: 'retro-badan-pe-sitare',
    title: 'Badan Pe Sitare Lapete Huye',
    artist: 'Mohammed Rafi (Prince)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-badan-pe-sitare.m4a',
    duration: '3:30',
    description: 'Iconic classic party melody: Badan pe sitare lapete huye, o jaan-e-tamanna kidhar jaa rahi ho',
  },
  {
    id: 'retro-yeh-shaam-mastani',
    title: 'Yeh Sham Mastani',
    artist: 'Kishore Kumar (Kati Patang)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-yeh-shaam-mastani.m4a',
    duration: '3:30',
    description: 'Soulful evening romance: Yeh sham mastani madhosh kiye jaaye',
  },
  {
    id: 'retro-likhe-jo-khat-tujhe',
    title: 'Likhe Jo Khat Tujhe',
    artist: 'Mohammed Rafi (Kanyadaan)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-likhe-jo-khat-tujhe.m4a',
    duration: '3:30',
    description: 'All-time nostalgic love song: Likhe jo khat tujhe woh teri yaad mein',
  },
  {
    id: 'retro-o-mere-dil-ke-chain',
    title: 'O Mere Dil Ke Chain',
    artist: 'Kishore Kumar (Mere Jeevan Saathi)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-o-mere-dil-ke-chain.mp3',
    duration: '4:24',
    description: 'Timeless romantic peace: O mere dil ke chain, chain aaye mere dil ko dua kijiye',
  },
  {
    id: 'retro-khaike-paan',
    title: 'Khaike Paan Banaras Wala',
    artist: 'Kishore Kumar (Don)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-khaike-paan.m4a',
    duration: '3:30',
    description: 'Fun, energetic vintage celebration: Khaike paan banaras wala!',
  },
  {
    id: 'retro-mere-sapnon-ki-rani',
    title: 'Mere Sapnon Ki Rani',
    artist: 'Kishore Kumar (Aradhana)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-mere-sapnon-ki-rani.m4a',
    duration: '3:30',
    description: 'Iconic vintage train romance anthem: Mere sapnon ki rani kab aayegi tu',
  },
  {
    id: 'retro-bachna-ae-haseeno',
    title: 'Bachna Ae Haseeno',
    artist: 'Kishore Kumar (Hum Kisise Kum Naheen)',
    category: 'retro',
    type: 'file',
    src: '/audio/retro-bachna-ae-haseeno.m4a',
    duration: '3:30',
    description: 'Vintage dance sensation: Bachna ae haseeno lo main aa gaya!',
  },
];

export interface PhotoReelTrack {
  trackId: string;
  songTitle: string;
  artist: string;
  chorusStartTime: number; // In seconds, starting right at the iconic hook/chorus
}

// Reel-style vocal soundtracks mapped uniquely to each memory photo!
export const PHOTO_REEL_SOUNDTRACKS: PhotoReelTrack[] = [
  { trackId: 'party-desi-boyz', songTitle: 'Make Some Noise For The Desi Boyz', artist: 'KK, Bob & Pritam (Desi Boyz)', chorusStartTime: 0 },
  { trackId: 'punjabi-daru-badnaam', songTitle: 'Daru Badnaam', artist: 'Param Singh & Kamal Kahlon', chorusStartTime: 0 },
  { trackId: 'retro-gulabi-aankhen', songTitle: 'Gulabi Aankhen', artist: 'Mohammed Rafi (The Train)', chorusStartTime: 0 },
  { trackId: 'retro-pal-pal-dil-ke-paas', songTitle: 'Pal Pal Dil Ke Paas', artist: 'Kishore Kumar (Blackmail)', chorusStartTime: 0 },
  { trackId: 'retro-chura-liya', songTitle: 'Chura Liya Hai Tumne Jo Dil Ko', artist: 'Asha Bhosle & Mohammed Rafi (Yaadon Ki Baaraat)', chorusStartTime: 0 },
  { trackId: 'retro-badan-pe-sitare', songTitle: 'Badan Pe Sitare Lapete Huye', artist: 'Mohammed Rafi (Prince)', chorusStartTime: 0 },
  { trackId: 'retro-yeh-shaam-mastani', songTitle: 'Yeh Sham Mastani', artist: 'Kishore Kumar (Kati Patang)', chorusStartTime: 0 },
  { trackId: 'retro-likhe-jo-khat-tujhe', songTitle: 'Likhe Jo Khat Tujhe', artist: 'Mohammed Rafi (Kanyadaan)', chorusStartTime: 0 },
  { trackId: 'retro-o-mere-dil-ke-chain', songTitle: 'O Mere Dil Ke Chain', artist: 'Kishore Kumar (Mere Jeevan Saathi)', chorusStartTime: 0 },
  { trackId: 'retro-khaike-paan', songTitle: 'Khaike Paan Banaras Wala', artist: 'Kishore Kumar (Don)', chorusStartTime: 0 },
  { trackId: 'retro-mere-sapnon-ki-rani', songTitle: 'Mere Sapnon Ki Rani', artist: 'Kishore Kumar (Aradhana)', chorusStartTime: 0 },
  { trackId: 'retro-bachna-ae-haseeno', songTitle: 'Bachna Ae Haseeno', artist: 'Kishore Kumar (Hum Kisise Kum Naheen)', chorusStartTime: 0 },
  { trackId: 'party-long-drive', songTitle: 'Long Drive', artist: 'Mika Singh (Khiladi 786)', chorusStartTime: 0 },
  { trackId: 'party-mujhko-yaad-sataye', songTitle: 'Mujhko Yaad Sataye Teri', artist: 'Himesh Reshammiya (Phir Hera Pheri)', chorusStartTime: 0 },
  { trackId: 'party-hookah-bar', songTitle: 'Hookah Bar', artist: 'Himesh Reshammiya (Khiladi 786)', chorusStartTime: 0 },
  { trackId: 'party-subha-hone-na-de', songTitle: 'Subha Hone Na De (Tu Mera Hero)', artist: 'Mika Singh & Shefali Alvares (Desi Boyz)', chorusStartTime: 0 },
  { trackId: 'punjabi-mauja-hi-mauja', songTitle: 'Mauja Hi Mauja', artist: 'Mika Singh (Jab We Met)', chorusStartTime: 0 },
  { trackId: 'hindi-aashiq-banaya', songTitle: 'Aashiq Banaya Aapne', artist: 'Himesh Reshammiya & Shreya Ghoshal', chorusStartTime: 0 },
  { trackId: 'hindi-zara-sa', songTitle: 'Zara Sa', artist: 'KK & Pritam (Jannat)', chorusStartTime: 0 },
  { trackId: 'hindi-kya-mujhe-pyaar-hai', songTitle: 'Kya Mujhe Pyaar Hai', artist: 'KK & Pritam (Woh Lamhe)', chorusStartTime: 0 },
  { trackId: 'party-dhinka-chika', songTitle: 'Dhinka Chika', artist: 'Mika Singh & Amrita Kak (Ready)', chorusStartTime: 0 },
  { trackId: 'party-desi-girl', songTitle: 'Desi Girl', artist: 'Shankar Mahadevan & Sunidhi Chauhan (Dostana)', chorusStartTime: 0 },
  { trackId: 'party-dilliwaali-girlfriend', songTitle: 'Dilliwaali Girlfriend', artist: 'Arijit Singh & Sunidhi Chauhan (YJHD)', chorusStartTime: 0 },
  { trackId: 'party-tune-maari-entriyaan', songTitle: 'Tune Maari Entriyaan', artist: 'KK, Bappi Lahiri & Neeti Mohan (Gunday)', chorusStartTime: 0 },
  { trackId: 'hindi-channa-mereya', songTitle: 'Channa Mereya', artist: 'Arijit Singh', chorusStartTime: 58 },
  { trackId: 'hindi-tum-hi-ho', songTitle: 'Tum Hi Ho', artist: 'Arijit Singh', chorusStartTime: 48 },
  { trackId: 'hindi-raataan-lambiyan', songTitle: 'Raataan Lambiyan', artist: 'Jubin Nautiyal & Asees Kaur', chorusStartTime: 56 },
  { trackId: 'hindi-chahun-main-ya-naa', songTitle: 'Chahun Main Ya Naa', artist: 'Arijit Singh & Palak Muchhal', chorusStartTime: 50 },
  { trackId: 'hindi-dil-diyan-gallan', songTitle: 'Dil Diyan Gallan', artist: 'Atif Aslam', chorusStartTime: 52 },
  { trackId: 'hindi-tujh-mein-rab', songTitle: 'Tujh Mein Rab Dikhta Hai', artist: 'Roop Kumar Rathod', chorusStartTime: 42 },
  { trackId: 'hindi-sunn-raha-hai', songTitle: 'Sunn Raha Hai Na Tu', artist: 'Ankit Tiwari', chorusStartTime: 64 },
  { trackId: 'punjabi-blue-eyes', songTitle: 'Blue Eyes', artist: 'Yo Yo Honey Singh', chorusStartTime: 44 },
  { trackId: 'party-brown-rang', songTitle: 'Brown Rang', artist: 'Yo Yo Honey Singh', chorusStartTime: 38 },
  { trackId: 'party-love-dose', songTitle: 'Love Dose', artist: 'Yo Yo Honey Singh', chorusStartTime: 50 },
  { trackId: 'party-angreji-beat', songTitle: 'Angreji Beat', artist: 'Gippy Grewal & Honey Singh', chorusStartTime: 34 },
  { trackId: 'party-dope-shope', songTitle: 'Dope Shope', artist: 'Deep Money & Honey Singh', chorusStartTime: 42 },
  { trackId: 'punjabi-bhangra', songTitle: 'Mundian To Bach Ke', artist: 'Panjabi MC & Labh Janjua', chorusStartTime: 32 },
  { trackId: 'punjabi-laung-gawacha', songTitle: 'Mera Laung Gawacha', artist: 'Bhangra Club Legends', chorusStartTime: 40 },
  { trackId: 'punjabi-gidda-bhangra', songTitle: 'Gidda Pao Haan Deo', artist: 'Bhangra Dhol Beats', chorusStartTime: 30 },
  { trackId: 'hindi-tera-ban-jaunga', songTitle: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva & Tulsi Kumar', chorusStartTime: 35 },
];

class SoundManager {
  private ctx: AudioContext | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private reelAudioElement: HTMLAudioElement | null = null;
  private isAudioPlaying = false;
  private currentTrackIndex = 0;
  private baseVolume = 0.55;
  private isDucked = false;
  private synthIntervalId: any = null;
  private listeners: Set<() => void> = new Set();
  private wasBackgroundPlayingBeforeReel = false;
  private isReelActive = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;
    if (!this.audioElement) {
      const track = PLAYLIST_TRACKS[this.currentTrackIndex];
      const audioPath = track.src ? getAssetUrl(track.src) : getAssetUrl('/audio/bollywood-birthday.mp3');
      this.audioElement = new Audio(audioPath);
      this.audioElement.loop = true;
      this.audioElement.volume = this.baseVolume;
      this.audioElement.preload = 'auto';

      this.audioElement.addEventListener('ended', () => {
        this.nextTrack();
      });

      this.audioElement.addEventListener('timeupdate', () => {
        this.notify();
      });

      this.audioElement.addEventListener('loadedmetadata', () => {
        this.notify();
      });

      this.audioElement.addEventListener('error', (e) => {
        console.warn('Audio element error encountered:', e);
      });
    }
  }

  public isPlaying(): boolean {
    if (this.isReelActive && this.reelAudioElement && !this.reelAudioElement.paused && !this.reelAudioElement.ended) {
      return true;
    }
    return !!(this.audioElement && !this.audioElement.paused && !this.audioElement.ended);
  }

  public getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  public getDuration(): number {
    return this.audioElement && !isNaN(this.audioElement.duration)
      ? this.audioElement.duration
      : 0;
  }

  public seekTo(seconds: number) {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration || 0));
      this.notify();
    }
  }

  public getCurrentTrack(): PlaylistTrack {
    return PLAYLIST_TRACKS[this.currentTrackIndex];
  }

  public getVolume(): number {
    return this.baseVolume;
  }

  public setVolume(vol: number) {
    this.baseVolume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.isDucked ? Math.min(0.08, this.baseVolume * 0.15) : this.baseVolume;
    }
    if (this.reelAudioElement) {
      this.reelAudioElement.volume = this.baseVolume;
    }
    this.notify();
  }

  // Audio ducking for speech and voice greetings
  public duckAudio(duckLevel: number = 0.08) {
    this.isDucked = true;
    if (this.audioElement) {
      this.audioElement.volume = Math.min(duckLevel, this.baseVolume * 0.15);
    }
    if (this.reelAudioElement) {
      this.reelAudioElement.volume = Math.min(duckLevel, this.baseVolume * 0.15);
    }
    this.notify();
  }

  public unduckAudio() {
    this.isDucked = false;
    if (this.audioElement) {
      this.audioElement.volume = this.baseVolume;
    }
    if (this.reelAudioElement) {
      this.reelAudioElement.volume = this.baseVolume;
    }
    this.notify();
  }

  public playTrack(trackId: string, startTime: number = 0) {
    const idx = PLAYLIST_TRACKS.findIndex((t) => t.id === trackId);
    if (idx === -1) return;

    // If the track is already active and playing, avoid reload / AbortError:
    if (this.currentTrackIndex === idx && this.audioElement && !this.audioElement.paused) {
      if (startTime > 0 && Math.abs(this.audioElement.currentTime - startTime) > 2) {
        try {
          this.audioElement.currentTime = startTime;
        } catch {
          // Seeking not ready
        }
      }
      return;
    }

    this.currentTrackIndex = idx;
    this.switchTrack(startTime);
  }

  // Dedicated independent reel audio element:
  // Completely pauses background music when viewing a photo, ensuring 100% focused solo vocal reel audio!
  public playReelAudio(src: string, streamUrl?: string) {
    this.initCtx();
    const assetUrl = getAssetUrl(src);

    this.isReelActive = true;

    // Completely pause background music so the photo reel vocal soundtrack plays solo without background noise
    if (this.audioElement && !this.audioElement.paused) {
      this.wasBackgroundPlayingBeforeReel = true;
      this.audioElement.pause();
    }

    if (!this.reelAudioElement && typeof window !== 'undefined') {
      this.reelAudioElement = new Audio();
      this.reelAudioElement.loop = true;
      this.reelAudioElement.preload = 'auto';
    }

    if (this.reelAudioElement) {
      this.reelAudioElement.pause();
      this.reelAudioElement.src = assetUrl;
      this.reelAudioElement.currentTime = 0;
      this.reelAudioElement.volume = this.baseVolume;
      const playPromise = this.reelAudioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          if (err && err.name === 'AbortError') return;
          console.warn('Reel local audio play failed, trying stream:', err);
          if (streamUrl && this.reelAudioElement) {
            this.reelAudioElement.src = streamUrl;
            this.reelAudioElement.play().catch(() => {});
          }
        });
      }
    }
    this.notify();
  }

  public stopReelAudio() {
    this.isReelActive = false;
    if (this.reelAudioElement) {
      try {
        this.reelAudioElement.pause();
        this.reelAudioElement.removeAttribute('src');
      } catch {
        // Ignored
      }
    }
    this.unduckAudio();
    this.notify();
  }

  public resumeBackgroundAfterReel() {
    this.stopReelAudio();
    if (this.wasBackgroundPlayingBeforeReel || this.isAudioPlaying) {
      if (this.audioElement && this.audioElement.paused && this.isAudioPlaying) {
        this.audioElement.volume = this.baseVolume;
        const p = this.audioElement.play();
        if (p !== undefined) {
          p.catch((err) => {
            if (err && err.name === 'AbortError') return;
            console.warn('Resume background audio after reel:', err);
          });
        }
      }
    }
    this.wasBackgroundPlayingBeforeReel = false;
    this.notify();
  }

  public restoreTrack(_trackId?: string, _startTime: number = 0) {
    this.resumeBackgroundAfterReel();
  }

  public nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % PLAYLIST_TRACKS.length;
    this.switchTrack();
  }

  public prevTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    this.switchTrack();
  }

  public playRandomTrack() {
    if (PLAYLIST_TRACKS.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * PLAYLIST_TRACKS.length);
    if (nextIdx === this.currentTrackIndex) {
      nextIdx = (nextIdx + 1) % PLAYLIST_TRACKS.length;
    }
    this.currentTrackIndex = nextIdx;
    this.switchTrack();
  }

  private switchTrack(startTime: number = 0) {
    if (this.isReelActive) {
      this.stopReelAudio();
      this.isReelActive = false;
    }
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];
    this.stopSynthPlayback();
    this.initAudioElement();

    if (track.type === 'file' && track.src && this.audioElement) {
      const targetSrc = getAssetUrl(track.src);
      const currentSrc = this.audioElement.src;
      const isSameSrc = currentSrc && (currentSrc === targetSrc || currentSrc.endsWith(track.src));

      if (!isSameSrc) {
        this.audioElement.src = targetSrc;
      }

      const applyStartTime = () => {
        if (startTime > 0 && this.audioElement) {
          try {
            this.audioElement.currentTime = startTime;
          } catch {
            // Ignored
          }
        }
      };

      if (this.audioElement.readyState >= 1) {
        applyStartTime();
      } else {
        this.audioElement.addEventListener('loadedmetadata', applyStartTime, { once: true });
      }

      if (this.isAudioPlaying) {
        const p = this.audioElement.play();
        if (p !== undefined) {
          p.catch((err) => {
            if (err && err.name === 'AbortError') return;
            console.warn('Vocal soundtrack play paused by browser:', err);
          });
        }
      }
    }
    this.notify();
  }

  public startAmbient() {
    this.isAudioPlaying = true;
    this.initCtx();
    const track = PLAYLIST_TRACKS[this.currentTrackIndex];

    if (track.type === 'file' && track.src) {
      this.initAudioElement();
      if (this.audioElement) {
        this.audioElement.volume = this.isDucked ? 0.08 : this.baseVolume;
        const p = this.audioElement.play();
        if (p !== undefined) {
          p.then(() => {
            this.isAudioPlaying = true;
            this.notify();
          }).catch((err) => {
            if (err && err.name === 'AbortError') return;
            console.warn('Ambient play failed:', err);
            this.isAudioPlaying = false;
            this.notify();
          });
        }
      }
    }
    this.notify();
  }

  public stopAmbient() {
    this.isAudioPlaying = false;
    this.wasBackgroundPlayingBeforeReel = false;
    this.isReelActive = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopReelAudio();
    this.stopSynthPlayback();
    this.notify();
  }

  public toggleAmbient(): boolean {
    if (this.isAudioPlaying) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient();
      return true;
    }
  }

  private stopSynthPlayback() {
    if (this.synthIntervalId) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainMult = 0.15,
    attack = 0.05
  ) {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'sawtooth' ? 1200 : 2500, now);

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      const effVolume = (this.isDucked ? 0.04 : this.baseVolume * 0.4) * gainMult;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.001, effVolume), now + attack);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Ignored
    }
  }

  // Acoustic Sound Effects - Crisp, realistic physical party popper sounds (Zero instrumental notes)
  public playPopperCannonSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Realistic compressed air pop / pressure thump
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Audio context ignored
    }
  }

  public playPopperBurstSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 1. Natural snappy transient "POP"
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.045);

      oscGain.gain.setValueAtTime(0.3, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);

      // 2. Micro paper-foil burst crackle (no musical notes, pure realistic confetti texture)
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1600, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.16, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
    } catch {
      // Ignored
    }
  }

  public playCakeSliceSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(3200, now);
      bandpass.frequency.exponentialRampToValueAtTime(1200, now + 0.12);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.15);

      const sliceChords = [523.25, 659.25, 783.99, 1046.5];
      sliceChords.forEach((freq, idx) => {
        setTimeout(() => {
          this.playTone(freq, 0.4, 'triangle', 0.22, 0.02);
        }, 120 + idx * 70);
      });
    } catch {
      // Ignored
    }
  }

  public playCakeSplatSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignored
    }
  }

  public playCakeDeliverySound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playTone(freq, 0.25, 'triangle', 0.2, 0.02);
        }, i * 90);
      });
    } catch {
      // Ignored
    }
  }

  public playTwinkle() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Soft organic sparkle click (gentle UI haptic click, not an instrumental melody)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // Ignored
    }
  }
}

export const soundManager = new SoundManager();
