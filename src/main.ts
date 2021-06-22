/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
import { download } from './util';

const fs = require('fs');
const Discord = require('discord.js');

const keys = JSON.parse(fs.readFileSync('./keys.json'));

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  // Reasons to exit
  if (msg.channel.id !== keys.channel || msg.author.bot) return;
  msg.delete();

  try {
    if (msg.content[0] === '!'
       && msg.member.roles.cache.has('847891487597527050')) {
      if (msg.content === '!tallyTheVotes') tallyTheVotes(msg);
      else if (msg.content.split(' ')[0] === '!hajimete') hajimete(msg); // Start
      else handleLink(msg);
      return;
    }

    handleLink(msg);
  } catch (e) {
    console.error(e);
  }
});

client.login(keys.token);

function hajimete(msg: any): void {
  const version = msg.content.split(' ')[1];
  msg.channel.messages.fetch({ limit: 100 }).then((messages) => {
    let deletionPromises = [];
    messages.forEach((message) => {
      deletionPromises.push(message.delete());
    })
    Promise.all(deletionPromises).then(() => {
      msg.channel.send(`Voting opening for a ${version} server.
        Please suggest mods for this version below by sending the curseforge
        link. E.x: "https://www.curseforge.com/minecraft/mc-mods/jei"`);
    });
  });
}

function tallyTheVotes(msg: any): void {
  msg.channel.messages.fetch({ limit: 100 }).then((messages) => {
    messages.forEach((message) => {
      if (message.content.startsWith("Voting")) return;
      if (message.content === '!tallyTheVotes') return;
      const reactions = message.reactions.cache;
      const thumbsUp = reactions.find((reaction) => reaction.emoji.name === '👍');
      const thumbsDown = reactions.find((reaction) => reaction.emoji.name === '👎');
      if (thumbsUp.count > thumbsDown.count) {
        const name: string = message.content.split(' ')[2];
        download(name, '1.16.5');
      }
    });
  });
}

function handleLink(msg: any): void {
  const link: string = msg.content.toLowerCase();
  if (!link.startsWith('https://www.curseforge.com/minecraft/mc-mods/')) {
    msg.author.send('That is not a curseforge link.');
    return;
  }

  const mod: string = link.split('mc-mods/')[1];
  const author: string = msg.author.id;
  const { channel } = msg;

  channel.send(`<@${author}> requested ${mod} (${link}). Vote below.`)
    .then((message) => {
      message.react('👍');
      message.react('👎');
    }).catch(console.error);
}
