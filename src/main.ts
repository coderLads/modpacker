export const fs = require('fs');
const Discord = require('discord.js');

const keys = JSON.parse(fs.readFileSync(`./keys.json`));

const client = new Discord.Client();

client.on('ready', ()=> {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  //Reasons to exit
  if(msg.channel.id !== keys.channel || msg.author.bot)
    return;

  handleLink(msg);
});

client.login(keys.token);

function handleLink(msg: any): null {
  let link: string = msg.content.toLowerCase();
  if(!link.startsWith("https://www.curseforge.com/minecraft")) {
    msg.delete();
    msg.author.send("That is not a curseforge link.");
    return;
  }

  const mod: string = "MODNAME"
  const author: string = msg.author.id;
  const channel = msg.channel;

  msg.delete();

  channel.send(`<@${author}> requested ${mod}. Vote below.`)
    .then(msg => {
      msg.react('👍');
      msg.react('👎');
  }).catch(console.error)
}
