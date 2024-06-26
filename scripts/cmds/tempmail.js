const axios = require("axios");

module.exports = {
  config: {
    name: "tempmail",
    version: "1.0",
    author: "ARN",
    countDown: 5,
    role: 0,
    category: "tool",
  },

  onStart: async function ({ api, args, event }) {
    try {
      if (args.length === 0) {
        return api.sendMessage("Use '-tempmail create' to generate a temporary email or '-tempmail inbox (email)' to retrieve inbox messages.", event.threadID, event.messageID);
      }

      const command = args[0].toLowerCase();

      if (command === "create") {
        let email;
        try {
          const response = await axios.get("https://for-devs.onrender.com/api/mail/gen?apikey=api1");
          email = response.data.email;
        } catch (error) {
          console.error("❌ | Primary API failed for email generation", error);
          try {
            const response = await axios.get("https://markdevs-last-api.onrender.com/api/gen");
            email = response.data.email;
          } catch (error) {
            console.error("❌ | Secondary API failed for email generation", error);
            return api.sendMessage("❌ | Failed to generate email. Please try again later.", event.threadID, event.messageID);
          }
        }
        return api.sendMessage(`📩 Generated email: ${email}`, event.threadID, event.messageID);
      } else if (command === "inbox" && args.length === 2) {
        const email = args[1];
        if (!email) {
          return api.sendMessage("❌ | Provide an email address for the inbox.", event.threadID, event.messageID);
        }

        let inboxMessages;
        try {
          const inboxResponse = await axios.get(`https://for-devs.onrender.com/api/mail/inbox?email=${email}&apikey=api1`);
          inboxMessages = inboxResponse.data;
        } catch (error) {
          console.error("❌ | Primary API failed for fetching inbox messages", error);
          try {
            const inboxResponse = await axios.get(`http://markdevs-last-api.onrender.com/api/getmessage/${email}`);
            inboxMessages = inboxResponse.data;
          } catch (error) {
            console.error("❌ | Secondary API failed for fetching inbox messages", error);
            return api.sendMessage("❌ | Failed to retrieve inbox messages. Please try again later.", event.threadID, event.messageID);
          }
        }

        if (inboxMessages.length === 0) {
          return api.sendMessage("❌ | No messages found in the inbox.", event.threadID, event.messageID);
        }

        const formattedMessages = inboxMessages.map(({ date, sender, message }) => `📅 Date: ${date}\n📧 From: ${sender}\n📩 Message: ${message}`).join('\n\n');
        return api.sendMessage(`📬 Inbox messages for ${email}:\n\n${formattedMessages}\n\nOld messages will be deleted after some time.`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`❌ | Invalid command. Use '-tempmail create' to generate a temporary email or '-tempmail inbox (email)' to retrieve inbox messages.`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("❌ | An error occurred. Please try again later.", event.threadID, event.messageID);
    }
  }
};