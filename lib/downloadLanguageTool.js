const axios = require('axios');
const fs = require('fs');
const ProgressBar = require('progress');

const getFileHash = require('./getFileHash');
const { info, success } = require('./logSymbols');

function downloadLanguageTool({ zipUrl, zipHash, savePath } = {}) {
  // eslint-disable-next-line consistent-return
  return new Promise(async (resolve, reject) => {
    info(`Get LanguageTool from: ${zipUrl} ...`);

    if (fs.existsSync(savePath)) {
      const fileHash = await getFileHash('md5', savePath);

      if (fileHash === zipHash) {
        success('Done! Already downloaded');

        return resolve();
      }
    }

    const writeStream = fs.createWriteStream(savePath);

    writeStream
      .on('error', reject)
      .on('close', async () => {
        const fileHash = await getFileHash('md5', savePath);

        if (fileHash !== zipHash) {
          return reject(new Error('File checksum mismatch'));
        }

        success('Done!');

        return resolve();
      });

    try {
      const response = await axios({ url: zipUrl, responseType: 'stream' });
      const totalLength = parseInt(response.headers['content-length'], 10);
      const bar = new ProgressBar('  downloading [:bar] :rate/bps :percent :etas', {
        complete: '=',
        incomplete: ' ',
        width: 20,
        total: totalLength,
      });

      response.data.on('data', chunk => bar.tick(chunk.length));
      response.data.pipe(writeStream);
    } catch (error) {
      writeStream.destroy();
      fs.unlinkSync(savePath);
      reject(error);
    }
  });
}

module.exports = downloadLanguageTool;
