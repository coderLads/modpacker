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
  msg.delete();

  try {
    if(msg.content[0] === "!" &&
       msg.member.roles.cache.has("847891487597527050")) {
      if(msg.content === "!tallyTheVotes")
        tallyTheVotes(msg);
      else if(msg.content === "!hajimete")
        return; // Start
      return;
    }

    handleLink(msg);
  } catch(e) {
    console.error(e);
  }
});

client.login(keys.token);

function tallyTheVotes(msg: any): null {
  msg.channel.messages.fetch({ limit: 100 }).then(messages => {
    messages.forEach(message => {
      if(message.content === "!tallyTheVotes")
        return;
      const reactions = message.reactions.cache
      const thumbsUp = reactions.find(reaction => reaction.emoji.name === "👍");
      const thumbsDown = reactions.find(reaction => reaction.emoji.name === "👎");
      console.log(message.content)
      console.log(thumbsUp.count - thumbsDown.count)
    })
  });
  return;
}

function handleLink(msg: any): null {
  let link: string = msg.content.toLowerCase();
  if(!link.startsWith("https://www.curseforge.com/minecraft/mc-mods/")) {
    msg.author.send("That is not a curseforge link.");
    return;
  }

  const mod: string = link.split("mc-mods/")[1]
  const author: string = msg.author.id;
  const channel = msg.channel;


  channel.send(`<@${author}> requested ${mod} (${link}). Vote below.`)
    .then(msg => {
      msg.react('👍');
      msg.react('👎');
  }).catch(console.error)
}
