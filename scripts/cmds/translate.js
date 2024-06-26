const axios = require('axios');
const defaultEmojiTranslate = "🌐";

module.exports = {
    config: {
        name: "translate",
        aliases: ["trans"],
        version: "1.5",
        author: "NTKhang",
        countDown: 5,
        role: 0,
        description: {
            en: "Translate text to the desired language"
        },
        category: "utility"
    },

    langs: {
        en: {
            translateTo: "🌐 Translate from %1 to %2",
            invalidArgument: "❌ Invalid argument, please choose on or off",
            turnOnTransWhenReaction: `✅ Turn on translate message when reaction, try to react \"${defaultEmojiTranslate}\" to any message to translate it (not support bot message)\n Only translate message after turn on this feature`,
            turnOffTransWhenReaction: "✅ Turn off translate message when reaction",
            inputEmoji: "🌀 Please react to this message to set that emoji as emoji to translate message",
            emojiSet: "✅ Emoji to translate message is set to %1"
        }
    },

    onStart: async function ({ message, event, args, threadsData, getLang, commandName }) {
        if (["-r", "-react", "-reaction"].includes(args[0])) {
            if (args[1] == "set") {
                return message.reply(getLang("inputEmoji"), (err, info) =>
                    global.GoatBot.onReaction.set(info.messageID, {
                        type: "setEmoji",
                        commandName,
                        messageID: info.messageID,
                        authorID: event.senderID
                    })
                );
            }
            const isEnable = args[1] == "on" ? true : args[1] == "off" ? false : null;
            if (isEnable == null)
                return message.reply(getLang("invalidArgument"));
            await threadsData.set(event.threadID, isEnable, "data.translate.autoTranslateWhenReaction");
            return message.reply(isEnable ? getLang("turnOnTransWhenReaction") : getLang("turnOffTransWhenReaction"));
        }
        const { body = "" } = event;
        let content;
        let langCodeTrans;
        const langOfThread = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;

        if (event.messageReply) {
            content = event.messageReply.body;
            let lastIndexSeparator = body.lastIndexOf("->");
            if (lastIndexSeparator == -1)
                lastIndexSeparator = body.lastIndexOf("=>");

            if (lastIndexSeparator != -1 && (body.length - lastIndexSeparator == 4 || body.length - lastIndexSeparator == 5))
                langCodeTrans = body.slice(lastIndexSeparator + 2);
            else if ((args[0] || "").match(/\w{2,3}/))
                langCodeTrans = args[0].match(/\w{2,3}/)[0];
            else
                langCodeTrans = langOfThread;
        }
        else {
            content = event.body;
            let lastIndexSeparator = content.lastIndexOf("->");
            if (lastIndexSeparator == -1)
                lastIndexSeparator = content.lastIndexOf("=>");

            if (lastIndexSeparator != -1 && (content.length - lastIndexSeparator == 4 || content.length - lastIndexSeparator == 5)) {
                langCodeTrans = content.slice(lastIndexSeparator + 2);
                content = content.slice(content.indexOf(args[0]), lastIndexSeparator);
            }
            else
                langCodeTrans = langOfThread;
        }

        if (!content)
            return message.SyntaxError();
        translateAndSendMessage(content, langCodeTrans, message, getLang);
    },

    onChat: async ({ event, threadsData }) => {
        if (!await threadsData.get(event.threadID, "data.translate.autoTranslateWhenReaction"))
            return;
        global.GoatBot.onReaction.set(event.messageID, {
            commandName: 'translate',
            messageID: event.messageID,
            body: event.body,
            type: "translate"
        });
    },

    onReaction: async ({ message, Reaction, event, threadsData, getLang }) => {
        switch (Reaction.type) {
            case "setEmoji": {
                if (event.userID != Reaction.authorID)
                    return;
                const emoji = event.reaction;
                if (!emoji)
                    return;
                await threadsData.set(event.threadID, emoji, "data.translate.emojiTranslate");
                return message.reply(getLang("emojiSet", emoji), () => message.unsend(Reaction.messageID));
            }
            case "translate": {
                const emojiTrans = await threadsData.get(event.threadID, "data.translate.emojiTranslate") || "🌐";
                if (event.reaction == emojiTrans) {
                    const langCodeTrans = await threadsData.get(event.threadID, "data.lang") || global.GoatBot.config.language;
                    const content = Reaction.body;
                    Reaction.delete();
                    translateAndSendMessage(content, langCodeTrans, message, getLang);
                }
            }
        }
    }
};

async function translate(text, langCode) {
    const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`);
    return {
        text: res.data[0].map(item => item[0]).join(''),
        lang: res.data[2]
    };
}

async function translateAndSendMessage(content, langCodeTrans, message, getLang) {
    try {
        const { text, lang } = await translate(content.trim(), langCodeTrans.trim());

        const header = `━━━━━━━━━━━━━━━━\n▫️${text}\n\n🪧 Translated from ${lang} to ${langCodeTrans}\n━━━━━━━━━━━━━━━━`;

        await message.reply(header);
    } catch (error) {
        console.error('Error translating and sending message:', error);
        // Handle error if needed
    }
}