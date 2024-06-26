const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "dalle",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "2.0",
    cooldowns: 20,
    role: 0,
    shortDescription: "Generate an image.",
    longDescription: "Generates an image based on a prompt.",
    category: "fun",
    guide: "{p}anigen <prompt>",
  },
  onStart: async function ({ message, args, api, event }) {
    api.setMessageReaction("🕐", event.messageID, (err) => {}, true);
    try {
      const prompt = args.join(" ");
      const dalleApiUrl = "https://markdevs-last-api.onrender.com/dalle";

      const dalleResponse = await axios.get(dalleApiUrl, {
        params: { prompt },
        responseType: "arraybuffer",
      });

      const cacheFolderPath = path.join(__dirname, "tmp");
      if (!fs.existsSync(cacheFolderPath)) {
        fs.mkdirSync(cacheFolderPath);
      }

      const imagePath = path.join(cacheFolderPath, `${Date.now()}_generated_image.png`);
      fs.writeFileSync(imagePath, Buffer.from(dalleResponse.data, "binary"));

      const stream = fs.createReadStream(imagePath);
      message.reply({
        body: "",
        attachment: stream,
      }, (err) => {
        if (err) {
          console.error("Error sending message:", err);
        } else {
          // Delete the image after it has been sent
          fs.unlinkSync(imagePath);
        }
      });
    } catch (error) {
      console.error("Error:", error);
      message.reply("❌ | An error occurred. Please try again later.");
    }
  }
};