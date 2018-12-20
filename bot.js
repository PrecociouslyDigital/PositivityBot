const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

module.exports.message = (listener) => client.on('message', msg => {
    if(!msg.author.bot) {
        msg.reply(listener(msg));
    }
})
