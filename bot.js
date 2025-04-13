


// const { Client, GatewayIntentBits } = require('discord.js');

// // 1. Define the client
// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ],
// });

// // 2. Message store to keep recent messages
// const messageStore = [];

// // 3. When bot is ready
// client.on('ready', () => {
//   console.log(`✅ Logged in as ${client.user.tag}`);
// });

// // 4. On new messages
// client.on('messageCreate', async (message) => {
//   if (!message.guild || message.author.bot) return;

//   // Store all messages
//   messageStore.push({
//     id: message.id,
//     content: message.content,
//     channelId: message.channel.id,
//     guildId: message.guild.id,
//   });

//   if (messageStore.length > 10000) messageStore.shift();

//   // Search logic: react if someone types just "pikachu" or any word
//   const searchWord = message.content.trim().toLowerCase();
//   const minLength = 80;


//   console.log(`🔍 Searching for: "${searchWord}", total messages: ${messageStore.length}`); // ✅ Add this line



//   const matches = messageStore
//     .filter(msg =>
//       msg.content.toLowerCase().includes(searchWord) &&
//       msg.content.length >= minLength
//     )
//     .slice(0, 5)
//     .map(msg => `• [${msg.id}] ${msg.content}`);

//   if (matches.length > 0) {
//     message.reply(`Found ${matches.length} message(s) containing **"${searchWord}"**:\n` + matches.join('\n'));
//   } else {
//     message.reply(`No messages found with "${searchWord}" longer than ${minLength} characters.`);
//   }
// });

// // 5. Export the client and messageStore
// module.exports = {
//   client,
//   messageStore,
// };






// bot.js
// require('dotenv').config();
// const { Client, GatewayIntentBits } = require('discord.js');
// const fs = require('fs');
// const path = require('path');

// const client = new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//   ]
// });

// const MESSAGE_FILE = path.join(__dirname, 'messages.json');
// let messageStore = [];

// // Load stored messages from file
// try {
//   const rawData = fs.readFileSync(MESSAGE_FILE);
//   messageStore = JSON.parse(rawData);
//   console.log(`🗃️ Loaded ${messageStore.length} messages from JSON.`);
// } catch (err) {
//   console.log("📄 No existing messages.json found. Creating new one.");
//   fs.writeFileSync(MESSAGE_FILE, '[]');
//   messageStore = [];
// }

// client.on('messageCreate', async (message) => {
//   if (message.author.bot) return;

//   const searchWord = message.content.trim().toLowerCase();
//   const minLength = 80;

//   console.log(`🔍 Searching for: "${searchWord}", total messages: ${messageStore.length}`);

//   const matches = messageStore
//     .filter(msg => {
//       const content = msg.content?.toLowerCase() || '';
//       const hasWord = content.includes(searchWord);
//       const isLongEnough = content.length >= minLength;

//       if (!hasWord || !isLongEnough) {
//         console.log(`❌ Skipping message: "${msg.content}"
//   ↳ hasWord: ${hasWord}, isLongEnough: ${isLongEnough}`);
//       }

//       return hasWord && isLongEnough;
//     })
//     .slice(0, 5);

//   if (matches.length === 0) {
//     return message.reply(`No messages found with "${searchWord}" longer than ${minLength} characters.`);
//   }

//   const response = matches.map(msg => `• [${msg.id}] ${msg.content}`).join("\n\n");
//   message.reply(response);
// });

// module.exports = { client, messageStore };







require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const MESSAGE_FILE = path.join(__dirname, 'messages.json');
let messageStore = [];

// Load stored messages from file
try {
  const rawData = fs.readFileSync(MESSAGE_FILE);
  messageStore = JSON.parse(rawData);
  console.log(`🗃️ Loaded ${messageStore.length} messages from JSON.`);
} catch (err) {
  console.log("📄 No existing messages.json found. Creating new one.");
  fs.writeFileSync(MESSAGE_FILE, '[]');
  messageStore = [];
}

// Handle incoming messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const searchWord = message.content.trim().toLowerCase();
  const minLength = 80;

  console.log(`🔍 Searching for: "${searchWord}", total messages: ${messageStore.length}`);

  // Check if the new message contains the keyword "pikachu" and is long enough
  if (searchWord.includes("pikachu") && message.content.length >= minLength) {
    // Filter out any old "pikachu" messages
    messageStore = messageStore.filter(msg => !msg.content.toLowerCase().includes("pikachu"));

    // Add the new message to the message store
    const newMessage = {
      id: message.id,
      content: message.content,
      channelId: message.channelId,
      guildId: message.guildId,
    };
    messageStore.push(newMessage);

    // Save the updated message store
    fs.writeFileSync(MESSAGE_FILE, JSON.stringify(messageStore, null, 2));
    console.log(`✅ New message about "pikachu" saved.`);
  }

  // Find all messages that match the search word and are long enough
  const matches = messageStore
    .filter(msg => {
      const content = msg.content?.toLowerCase() || '';
      const hasWord = content.includes(searchWord);
      const isLongEnough = content.length >= minLength;

      return hasWord && isLongEnough;
    })
    .slice(0, 5);  // Limit to the first 5 matches

  if (matches.length === 0) {
    return message.reply(`No messages found with "${searchWord}" longer than ${minLength} characters.`);
  }

  // Reply with the latest relevant messages
  const response = matches.map(msg => `•  ${msg.content}`).join("\n\n");
  message.reply(response);
});

module.exports = { client, messageStore };


