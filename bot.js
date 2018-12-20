const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if(!msg.author.bot) {
        lowMessage = msg.content.toLowerCase();
        searchImBad(msg, lowMessage);
        searchNotGood(msg, lowMessage);
        searchIsHard(msg, lowMessage);
        runSlashFunctions(msg, lowMessage);
        //searchImBadFunc(msg, lowMessage);
    }
});

module.exports.message = (listener) => client.on('message', msg => {
    if(!msg.author.bot) {
        msg.reply(listener(msg));
    }
})
