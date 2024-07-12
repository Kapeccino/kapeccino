const axios = require('axios');
const NodeCache = require('node-cache');

// Initialize cache
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Add more Apis or Ai services here.
const services = [
    { url: 'http://markdevs-last-api.onrender.com/api/v2/gpt4', param: 'query' },
    { url: 'https://markdevs-last-api.onrender.com/api/v3/gpt4', param: 'ask' },
    { url: 'https://markdevs-last-api.onrender.com/gpt4', param: 'prompt', uid: 'uid' }
];

const designatedHeader = "🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒";

const getAIResponse = async (question, messageID) => {
    // Check if response is cached
    const cachedResponse = cache.get(question);
    if (cachedResponse) {
        return { response: cachedResponse, messageID };
    }

    const response = await getAnswerFromAI(question.trim() || "hi");
    // Cache the response
    cache.set(question, response);
    return { response, messageID };
};

const getAnswerFromAI = async (question) => {
    const promises = services.map(({ url, param, uid }) => {
        const params = uid ? { [param]: question, [uid]: '61561393752978' } : { [param]: question };
        return fetchFromAI(url, params);
    });

    const responses = await Promise.allSettled(promises);
    for (const { status, value } of responses) {
        if (status === 'fulfilled' && value) {
            return value;
        }
    }

    throw new Error("No valid response from any AI service");
};

const fetchFromAI = async (url, params) => {
    try {
        const { data } = await axios.get(url, { params });
        return data.gpt4 || data.reply || data.response || data.answer || data.message;
    } catch (error) {
        console.error("Network Error:", error.message);
        return null;
    }
};

const handleCommand = async (api, event, args, message) => {
    try {
        const question = args.join(" ").trim();
        if (!question) return message.reply("Please provide a question to get an answer.");
        const { response, messageID } = await getAIResponse(question, event.messageID);
        api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
    } catch (error) {
        console.error("Error in handleCommand:", error.message);
        message.reply("An error occurred while processing your request.");
    }
};

const onStart = async ({ api, event, args }) => {
    try {
        const input = args.join(' ').trim();
        const { response, messageID } = await getAIResponse(input, event.messageID);
        api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
    } catch (error) {
        console.error("Error in onStart:", error.message);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

const onChat = async ({ event, api }) => {
    const messageContent = event.body.trim().toLowerCase();
    const isReplyToBot = event.messageReply && event.messageReply.senderID === api.getCurrentUserID();
    const isDirectMessage = messageContent.startsWith("ai") && event.senderID !== api.getCurrentUserID();

    if (isReplyToBot) {
        const repliedMessage = event.messageReply.body || "";
        if (!repliedMessage.startsWith(designatedHeader)) {
            return;
        }
    }

    if (isReplyToBot || isDirectMessage) {
        const userMessage = isDirectMessage ? messageContent.replace(/^ai\s*/, "").trim() : messageContent;
        const botReplyMessage = isReplyToBot ? event.messageReply.body : "";
        const input = `${botReplyMessage}\n${userMessage}`.trim();

        try {
            const { response, messageID } = await getAIResponse(input, event.messageID);
            api.sendMessage(`🧋✨ | 𝙼𝚘𝚌𝚑𝚊 𝙰𝚒\n━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━`, event.threadID, messageID);
        } catch (error) {
            console.error("Error in onChat:", error.message);
            api.sendMessage("An error occurred while processing your request.", event.threadID);
        }
    }
};

module.exports = {
    config: {
        name: 'ai',
        author: 'coffee',
        role: 0,
        category: 'ai',
        shortDescription: 'AI to answer any question',
    },
    onStart,
    onChat,
    handleCommand
};