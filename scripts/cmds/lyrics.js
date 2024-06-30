const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
    version: "1.0",
    author: "coffee",
    countDown: 5,
    role: 0,
    category: "music",
  },

  onStart: async function ({ api, event, args }) {
    const songName = args.join(" ").trim();
    if (!songName) {
      api.sendMessage("Please provide a song name!", event.threadID, event.messageID);
      return;
    }

    try {
      await fetchLyrics(api, event, songName, 0);
    } catch (error) {
      console.error(`Error fetching lyrics for "${songName}":`, error);
      api.sendMessage(`Sorry, there was an error getting the lyrics for "${songName}"!`, event.threadID, event.messageID);
    }
  },
};

const apiConfigs = [
  {
    name: "Primary API",
    url: (songName) => `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 1",
    url: (songName) => `https://samirxpikachu.onrender.com/lyrics?query=${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 2",
    url: (songName) => `https://markdevs-last-api.onrender.com/search/lyrics?q=${encodeURIComponent(songName)}`,
  },
  {
    name: "Backup API 3",
    url: (artist, song) => `https://openapi-idk8.onrender.com/lyrical/find?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}`,
    requiresArtistAndSong: true,
  },
];

async function fetchLyrics(api, event, songName, attempt) {
  if (attempt >= apiConfigs.length) {
    api.sendMessage(`Sorry, lyrics for "${songName}" not found in all APIs!`, event.threadID, event.messageID);
    return;
  }

  const { name, url, requiresArtistAndSong } = apiConfigs[attempt];
  let apiUrl;

  try {
    if (requiresArtistAndSong) {
      const [artist, title] = songName.split('-').map(s => s.trim());
      if (!artist || !title) {
        throw new Error("Invalid format for artist and song title");
      }
      apiUrl = url(artist, title);
    } else {
      apiUrl = url(songName);
    }

    const response = await axios.get(apiUrl);
    const { lyrics, title, artist } = response.data;

    if (!lyrics) {
      throw new Error("Lyrics not found");
    }

    sendFormattedLyrics(api, event, title, artist, lyrics);
  } catch (error) {
    console.error(`Error fetching lyrics from ${name} for "${songName}":`, error.message || error);
    await fetchLyrics(api, event, songName, attempt + 1);
  }
}

function sendFormattedLyrics(api, event, title, artist, lyrics) {
  const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n\n${lyrics}`;
  api.sendMessage(formattedLyrics, event.threadID, event.messageID);
}