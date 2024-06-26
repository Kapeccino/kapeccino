const commandInfoMap = {
  ai: {
    name: "ai",
    description: "Ai Based on GPT-4",
    guide: "-ai what is life?"
    },
  tempmail: {
    name: "tempmail",
    description: "Get Temporary Emails and it's Inbox messages",
    guide: "-tempmail create\n-tempmail inbox <email>"
  },
  alldl: {
    name: "alldl",
    description: "download video content using link from Facebook, Instagram, Tiktok, Youtube, Twitter, and Spotify audio",
    guide: "-alldl [link]"
  },
animagine: {
    name: "animagine",
    description: "makes an animated image based on your imagination",
    guide: "-animagine cat with wings"
    },
  translate: {
    name: "translate",
    description: "Translate to any languages",
    guide: "Reply to text you want to translate and type \n-translate <language>"
  },
  pinterest: {
    name: "pinterest",
    description: "Searches Images in Pinterest ",
    guide: "-pinterest cat -10"
  },
  dalle: {
    name: "dalle",
    description: "make images through texts",
    guide: "-dalle cat in a hoodie"
  },
  remini: {
    name: "remini",
    description: "enhances your image to lessen the blur",
    guide: "reply to image and type -remini"
  },
  lyrics: {
    name: "lyrics",
    description: "Fetches lyrics of a song",
    guide: "-lyrics perfect by ed sheeran"
  },
  help: {
    name: "help",
    description: "View all commands",
    guide: "-help\n-help <command name>"
  },
  prefix: {
    name: "prefix",
    description: "view some commands and shows bot's prefix",
    guide: "prefix"
  },
  uptime: {
    name: "uptime",
    description: "See how long the bot has been running.",
    guide: "-uptime"
  },
  unsend: {
    name: "unsend",
    description: "deletes bot messages",
    guide: "reply to bot message and type -unsend"
  },
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
    if (args[0]) {
      const command = args[0].toLowerCase();
      if (commandInfoMap[command]) {
        const { name, description, guide } = commandInfoMap[command];
        const response = `━━━━━━━━━━━━━━━━\n𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝙽𝚊𝚖𝚎: ${name}\n𝙳𝚎𝚜𝚌𝚛𝚒𝚙𝚝𝚒𝚘𝚗: ${description}\n𝙶𝚞𝚒𝚍𝚎: ${guide}\n━━━━━━━━━━━━━━━━`;
        return message.reply(response);
      } else {
        return message.reply("Command not found.");
      }
    } else {
      const commandsList = `━━━━━━━━━━━━━━━━
𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜:
╭─╼━━━━━━━━╾─╮
│ - AI
│ - Translate
│ - Animagine
│ - Dalle
│ - Pinterest
│ - Remini
│ - Lyrics
│ - Alldl
│ - Help
│ - Prefix
│ - Tempmail
│ - Unsend
│ - Uptime
╰─━━━━━━━━━╾─╯
-𝚑𝚎𝚕𝚙 <𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚗𝚊𝚖𝚎>
𝚃𝚘 𝚜𝚎𝚎 𝚑𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎
𝚝𝚑𝚎 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜.

Example: -help ai
━━━━━━━━━━━━━━━━`;

      return message.reply(commandsList);
    }
  }
};