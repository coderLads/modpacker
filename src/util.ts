const fetch = require('node-fetch');
const fs = require('fs');

const curseforge = require('mc-curseforge-api');

function download(name: String, mcVer: String) {
  curseforge.getMods({ searchFilter: name }).then((mods) => {
    curseforge.getModFiles(mods[0].id).then((files) => {
      // eslint-disable-next-line max-len
      const newestMatching = Object.values(files).filter((version) => (<any>version).minecraft_versions.includes(mcVer));
      const modUrl = (<any>newestMatching)[0].download_url;
      fetch(modUrl)
        .then((res) => {
          const dest = fs.createWriteStream(`./mods/${modUrl.split('/').reverse()[0]}`);
          res.body.pipe(dest);
        });
    });
  });
}

export default download;
