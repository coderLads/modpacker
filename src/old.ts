/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
const fetch = require('node-fetch');
const fs = require('fs');
const homedir = require('os').homedir();
const curseforge = require('mc-curseforge-api');

const path = `${homedir}/.config/gdlauncher_next/instances/Discord/`;

function download(name: String, mcVer: String) {
  curseforge.getMods({ searchFilter: name }).then((mods) => {
    curseforge.getModFiles(mods[0].id).then((files) => {
      // eslint-disable-next-line max-len
      const newestMatching = Object.values(files).filter((version) => (<any>version).minecraft_versions.includes(mcVer));
      const modUrl = (<any>newestMatching)[0].download_url;
      fetch(modUrl)
        .then((res) => {
          const dest = fs.createWriteStream(`${path}mods/${modUrl.split('/').reverse()[0]}`);
          console.log(`Downloading: ${name}`);
          res.body.pipe(dest);
        });
    });
  });
}

export { download };
