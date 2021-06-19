const fetch = require('node-fetch');
const fs = require('fs');

const curseforge = require("mc-curseforge-api");

export function download(name: String, mcVer: String) {
  curseforge.getMods({ searchFilter: name }).then((mods) => {
    curseforge.getModFiles(mods[0].id).then((files) => {
      let newestMatching = Object.values(files).filter(version => {
        return (<any>version).minecraft_versions.includes(mcVer);
      });
      let modUrl = (<any>newestMatching)[0].download_url;
      fetch(modUrl)
        .then(res => {
          const dest = fs.createWriteStream('./mods/' + modUrl.split('/').reverse()[0]);
          res.body.pipe(dest);
        });
    });
  });
}