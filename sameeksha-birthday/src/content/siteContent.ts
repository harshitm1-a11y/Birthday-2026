export const content = {
  siteTitle: "A Universe Made Just For You",
  recipient: {
    name: "Sameeksha",
    nickname: "Sameeksha",
    birthday: "2026-11-23",
  },

  scenes: [
    { id: "welcome", title: "Welcome to Your Universe" },
    { id: "gift", title: "The Magical Gift" },
    { id: "memories", title: "Our Little Memories" },
    { id: "companion", title: "Your Little Companion" },
    { id: "cake", title: "Make a Wish" },
    { id: "letter", title: "A Letter From The Heart" },
    { id: "finale", title: "Forever My Favourite" },
  ],

  welcome: {
    heading: "Hey Sameeksha...",
    subtext: "Aaj tumhare liye ek chhoti si duniya banayi hai.\nReady to step inside?",
    button: "Enter Your Universe ✨",
  },

  gift: {
    heading: "The Magical Gift",
    subtext: "Because someone as special as you deserves a little extra magic.",
    button: "Open Your Gift 🎁",
  },

  memories: {
    heading: "Our Little Memories",
    subtext: "Some moments are small, but they become the ones we keep closest.",
    emptyState: "Yahan tumhari favourite memories aayengi — photos add karke is jagah ko apna bana do.",
  },

  companion: {
    dialogues: [
      "Psst... Sameeksha, ek secret bataun? 🤫",
      "Tumhari smile kaafi powerful hai. Mood instantly better kar deti hai. 😊",
      "Tum jis tarah chhoti-chhoti baaton mein khushi dhoond leti ho, that's lovely. 💕",
      "Never stop being your wonderfully unique self. ✨",
      "Okay, ab cake time! Ready? 🎂",
    ],
  },

  cake: {
    heading: "Make a Wish",
    subtext: "Make a wish, Sameeksha. Aaj ka din tumhara hai! 🎂",
    button: "Blow the Candles 🎉",
    fallback: "Tap to blow the candles",
  },

  letter: {
    heading: "A Letter From The Heart",
    content: `Dear Sameeksha,

Happy Birthday! ❤️

Kabhi-kabhi sochta hoon ki kuch log life mein aate hain aur ordinary moments ko bhi special bana dete hain. Tum unhi logon mein se ho.

Tumhari smile, tumhari little-little baatein, tumhara cute sa drama — honestly, sab apni jagah special hai. 😄

I hope tumhara aane wala year happiness, success, peace aur bahut saari beautiful memories se bhara ho. Jo dreams tum dekhti ho, woh ek-ek karke poore hon.

Thank you for being you. Aaj bas itna yaad rakhna: you are special, you are appreciated, and you deserve all the happiness in the world.

Once again, Happy Birthday, Sameeksha! ✨`,
  },

  finale: {
    heading: "Happy Birthday, Sameeksha! 🎉",
    subtext:
      "Sameeksha, may your world always be full of reasons to smile.\nKeep shining, keep laughing, and keep being wonderfully you.\nHappy Birthday!",
    buttons: {
      replay: "Replay Our Story 🔄",
      memories: "Visit Memories 📸",
      oneMoreLook: "One More Look ✨",
    },
  },

  compliments: [
    "Tumhari smile genuinely special hai. ✨",
    "Tum jis tarah chhoti-chhoti baaton mein khushi dhoond leti ho, that's lovely. 💕",
    "Never stop being your wonderfully unique self. 🌟",
    "Tumhara cute sa drama secretly everyone ko happy karta hai. 😄",
    "You make ordinary moments feel extraordinary. 💫",
    "Tumhari energy contagious hai — in the best way! 🌈",
  ],

  secretMessage:
    "Secret unlocked: If I could give you one thing today, it would be a chance to see how special you are through my eyes. 💖",

  loading: {
    text: "Thodi si magic prepare ho rahi hai... ✨",
    webglFallback:
      "Your surprise is still here. This device couldn't load the full 3D effects, so we're showing a lighter version.",
    retryText: "Something didn't load. Want to try again?",
    audioHint: "Music is optional — turn it on whenever you like. 🎵",
  },

  photos: [
    { src: "/images/IMG-20250423-WA0062.jpg", caption: "" },
    { src: "/images/IMG-20250423-WA0170.jpg", caption: "" },
    { src: "/images/IMG-20250423-WA0181.jpg", caption: "" },
    { src: "/images/IMG-20260416-WA0005.jpg", caption: "" },
    { src: "/images/IMG-20260416-WA0021.jpg", caption: "" },
    { src: "/images/IMG-20251122-WA0037.jpg", caption: "" },
    { src: "/images/IMG-20250423-WA0133.jpg", caption: "" },
    { src: "/images/IMG-20260415-WA0040.jpg", caption: "" },
    { src: "/images/Snapchat-634634094.jpg", caption: "" },
    { src: "/images/Snapchat-582205884.jpg", caption: "" },
    { src: "/images/Snapchat-1800356805.jpg", caption: "" },
    { src: "/images/Snapchat-1689401851.jpg", caption: "" },
    { src: "/images/Snapchat-2090217781.jpg", caption: "" },
    { src: "/images/Snapchat-818290771.jpg", caption: "" },
    { src: "/images/Snapchat-981711303.jpg", caption: "" },
  ],
} as const;
