const axios = require('axios');
const fs = require('fs-extra');
const tinyurl = require('tinyurl');
const path = require('path');

module.exports = {
  config: {
    name: "remini",
    aliases: ["remini"],
    author: "Hazeyy/kira/JARiF",
    version: "69",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "enhance image"
    },
    longDescription: {
      en: "remini filter"
    },
    category: "image",
    guide: {
      en: "{p}{n} [reply to an img or provide an image URL]"
    }
  },

  onStart: async function ({ api, event }) {
    const args = event.body.split(/\s+/).slice(1); // Use slice to skip the first element
    const { threadID, messageID, messageReply } = event;
    const tempImagePath = path.join(__dirname, 'tmp', 'enhanced_image.jpg');

    // Check if there's a message reply and if it has attachments
    if (!messageReply || !messageReply.attachments || !(messageReply.attachments[0] || args[0])) {
      api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image or provide an image URL.", threadID, messageID);
      return;
    }

    // Determine the photo URL from the reply or command arguments
    const photoUrl = messageReply.attachments[0] ? messageReply.attachments[0].url : args.join(" ");

    // Check if a valid photo URL is present
    if (!photoUrl) {
      api.sendMessage("┐⁠(⁠￣⁠ヘ⁠￣⁠)⁠┌ | Must reply to an image or provide an image URL.", threadID, messageID);
      return;
    }

    api.sendMessage("⊂⁠(⁠・⁠﹏⁠・⁠⊂⁠) | Please wait...", threadID, async () => {
      try {
        // Shorten the photo URL using TinyURL
        const shortenedUrl = await tinyurl.shorten(photoUrl);

        // Fetch the upscaled image using the upscale API
        const response = await axios.get(`https://www.api.vyturex.com/upscale?imageUrl=${shortenedUrl}`);
        const processedImageUrl = response.data.resultUrl;

        // Fetch the processed image
        const enhancedImageResponse = await axios.get(processedImageUrl, { responseType: "arraybuffer" });

        // Save the processed image to a temporary file
        fs.writeFileSync(tempImagePath, enhancedImageResponse.data);

        // Send the enhanced image as a reply
        api.sendMessage({
          body: "<⁠(⁠￣⁠︶⁠￣⁠)⁠> | Image Enhanced.",
          attachment: fs.createReadStream(tempImagePath)
        }, threadID, () => {
          // Delete the temporary image file after sending
          fs.unlinkSync(tempImagePath);
        }, messageID);
      } catch (error) {
        // Handle errors gracefully
        api.sendMessage(`(⁠┌⁠・⁠。⁠・⁠)⁠┌ | Api Dead...: ${error.message}`, threadID, messageID);
      }
    });
  }
};