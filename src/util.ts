/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
const fetch = require('node-fetch');
const fs = require('fs');
const homedir = require('os').homedir();
const curseforge = require('mc-curseforge-api');
const twitchapi = require('better-twitch-app-api');

const path = `${homedir}/.config/gdlauncher_next/instances/Discord/`;

function fetchMod(modId: Number, mcVer: String) {
  twitchapi.getAddonInfo(modId).then((data) => {
    const newestMatching: any = Object.values(data.latestFiles).filter((version: any) => (<any>version).gameVersion.includes(mcVer))[0];
    if (newestMatching.dependencies.length > 0) {
      Object.values(newestMatching.dependencies).forEach((dependency: any) => {
        fetchMod(dependency.addonId, mcVer);
      });
    }
    const modUrl = newestMatching.downloadUrl;
    fetch(modUrl).then((res) => {
      const dest = fs.createWriteStream(`${path}mods/${modUrl.split('/').reverse()[0]}`);
      console.log(`> ${data.name} (${data.id})`);
      res.body.pipe(dest);
    });
  });
}

function download(name: String, mcVer: String) {
  curseforge.getMods({ searchFilter: name }).then((mods) => {
    const modId = mods[0].id;
    fetchMod(modId, mcVer);
  });
}

export { download };
