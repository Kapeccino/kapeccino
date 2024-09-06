const commandInfoMap = {
  ai: {
    name: "ai",
    description: "AI Based on GPT-4",
    guide: "%1ai what is life?"
  },
  alldl: {
    name: "alldl",
    description: "Download video content using link from Facebook, Instagram, Tiktok, Youtube, Twitter, and Spotify audio",
    guide: "%1alldl [link]"
  },
  dalle: {
    name: "dalle",
    description: "Create images through text",
    guide: "%1dalle cat in a hoodie"
  },
  help: {
    name: "help",
    description: "View all commands",
    guide: "%1help\n%1help <command name>"
  },
  lyrics: {
    name: "lyrics",
    description: "Fetches lyrics of a song",
    guide: "%1lyrics perfect by ed sheeran"
  },
  pinterest: {
    name: "pinterest",
    description: "Searches images on Pinterest",
    guide: "%1pinterest cat -10"
  },
  prefix: {
    name: "prefix",
    description: "View some commands and show bot's prefix",
    guide: "%1prefix"
  },
  remini: {
    name: "remini",
    description: "Enhances your image to lessen the blur",
    guide: "Reply to an image and type %1remini"
  },
  removebg: {
    name: "removebg",
    description: "Remove background of an image",
    guide: "Reply to an image and type %1removebg or %1rbg"
  },
  spotify: {
    name: "spotify",
    description: "Play song from Spotify",
    guide: "%1spotify <song title> <artist>\nExample:\n%1spotify perfect by ed sheeran"
  },
  tempmail: {
    name: "tempmail",
    description: "Get temporary emails and their inbox messages",
    guide: "%1tempmail create\n%1tempmail inbox <email>"
  },
  translate: {
    name: "translate",
    description: "Translate to any language",
    guide: "Reply to the text you want to translate and type\n%1translate <language>"
  },
  unsend: {
    name: "unsend",
    description: "Deletes bot messages",
    guide: "Reply to a bot message and type %1unsend"
  },
  uptime: {
    name: "uptime",
    description: "See how long the bot has been running",
    guide: "%1uptime"
  }
};

module.exports = {
  config: {
    name: "help",
    aliases: ["help"],
    version: 1.0,
    author: "LiANE&Coffee",
    shortDescription: { en: "View all commands" },
    category: "members",
  },
  onStart: async function({ message, args }) {
    const prefix = global.GoatBot.config.prefix; // Access the global prefix

    if (args[0]) {
      const command = args[0].toLowerCase();
      if (commandInfoMap[command]) {
        const { name, description, guide } = commandInfoMap[command];
        const response = `━━━━━━━━━━━━━━━━\n𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${name}\n𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${description}\n𝙶𝚞𝚒𝚍𝚎: ${guide.replace(/%1/g, prefix)}\n━━━━━━━━━━━━━━━━`;
        return message.reply(response);
      } else {
        return message.reply("Command not found.");
      }
    } else {
      const commandsList = `━━━━━━━━━━━━━━━━
𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
╭─╼━━━━━━━━╾─╮
│ %1 Ai
│ %1 Alldl
│ %1 Dalle
│ %1 Help
│ %1 Lyrics
│ %1 Pinterest
│ %1 Prefix
│ %1 Remini
│ %1 Removebg
│ %1 Tempmail
│ %1 Translate
│ %1 Unsend
│ %1 Uptime
╰─━━━━━━━━━╾─╯
%1help <command name>
𝚃𝚘 𝚜𝚎𝚎 𝚑𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.

Example: %1help ai
━━━━━━━━━━━━━━━━`;

      return message.reply(commandsList.replace(/%1/g, prefix));
    }
  }
};