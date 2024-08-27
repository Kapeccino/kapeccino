const { writeFileSync, existsSync, mkdirSync } = require("fs");
const { join } = require("path");
const axios = require("axios");
const tinyurl = require('tinyurl');
const fs = require('fs'); 

module.exports = {
  config: {
    name: "remini",
    aliases: [],
    version: "2.0",
    author: "Vex_Kshitiz",
    countDown: 20,
    role: 2,
    shortDescription: "remini",
    longDescription: "enhance the image quality",
    category: "tool",
    guide: {
      en: "{p}remini (reply to image)",
    }
  },

  onStart: async function ({ message, event, api }) {
    api.setMessageReaction("🕰️", event.messageID, (err) => {}, true);
    const { type: a, messageReply: b } = event;
    const { attachments: c, threadID: d, messageID: e } = b || {};

    if (a === "message_reply" && c) {
      const [f] = c;
      const { url: g, type: h } = f || {};

      if (!f || !["photo", "sticker"].includes(h)) {
        return message.reply("❌ | Reply must be an image.");
      }

      try {
        const i = await tinyurl.shorten(g);
        const { data: j } = await axios.get(`https://vex-kshitiz.vercel.app/upscale?url=${encodeURIComponent(i)}`, {
          responseType: "json"
        });

        const imageUrl = j.result_url;
        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

        const k = join(__dirname, "cache");
        if (!existsSync(k)) {
          mkdirSync(k, { recursive: true });
        }

        const imagePath = join(k, "remi_image.png");
        writeFileSync(imagePath, imageResponse.data);

        message.reply({ attachment: fs.createReadStream(imagePath) }, d);
      } catch (m) {
        console.error(m);
        message.reply("❌ | Error occurred while enhancing image.");
      }
    } else {
      message.reply("❌ | Please reply to an image.");
    }
  }
};