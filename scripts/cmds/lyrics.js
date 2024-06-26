const axios = require("axios");

module.exports = {
  config: {
    name: "lyrics",
  },

  onStart: async function ({ api, event, args }) {
    const songName = args.join(" ").trim();
    if (!songName) {
      api.sendMessage("Please provide a song name!", event.threadID, event.messageID);
      return;
    }

    const firstApiUrl = `https://lyrist.vercel.app/api/${encodeURIComponent(songName)}`;
    try {
      const response = await axios.get(firstApiUrl);
      const { lyrics, title, artist } = response.data;

      if (!lyrics) {
        // Fallback to the second API if lyrics are not found in the first API
        return fetchFromBackupAPI(api, event, songName);
      } else {
        const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n\n${lyrics}`;
        api.sendMessage(formattedLyrics, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(`Error fetching lyrics from the first API for "${songName}":`, error);
      // Fallback to the second API on error
      fetchFromBackupAPI(api, event, songName);
    }
  },
};

async function fetchFromBackupAPI(api, event, songName) {
  const backupApiUrl = `https://samirxpikachu.onrender.com/lyrics?query=${encodeURIComponent(songName)}`;
  try {
    const response = await axios.get(backupApiUrl);
    const { lyrics, title, artist } = response.data;

    if (!lyrics) {
      api.sendMessage(`Sorry, lyrics for "${songName}" not found in both APIs!`, event.threadID, event.messageID);
    } else {
      const formattedLyrics = `🎧 | Title: ${title}\n🎤 | Artist: ${artist}\n\n${lyrics}`;
      api.sendMessage(formattedLyrics, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(`Error fetching lyrics from the backup API for "${songName}":`, error);
    api.sendMessage(`Sorry, there was an error getting the lyrics for "${songName}"!`, event.threadID, event.messageID);
  }
}