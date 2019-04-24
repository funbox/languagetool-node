const axios = require('axios');
const fs = require('fs');
const ProgressBar = require('progress');

const formatBytes = require('./formatBytes');
const getFileMD5Hash = require('./getFileMD5Hash');
const { info, success } = require('./log');

function downloadLanguageTool({ url, md5, savePath } = {}) {
  // eslint-disable-next-line consistent-return
  return new Promise(async (resolve, reject) => {
    info(`Getting LanguageTool from: ${url} ...`);

    if (fs.existsSync(savePath)) {
      if (await getFileMD5Hash(savePath) === md5) {
        success('Done! Already downloaded');

        return resolve();
      }
    }

    const writeStream = fs.createWriteStream(savePath);

    writeStream
      .on('error', reject)
      .on('close', async () => {
        if (await getFileMD5Hash(savePath) !== md5) {
          return reject(new Error('File checksum mismatch'));
        }

        success('Done!');

        return resolve();
      });

    try {
      const response = await axios({ url, responseType: 'stream' });
      const totalLength = parseInt(response.headers['content-length'], 10);
      const bar = new ProgressBar(`  downloading [:bar] :percent of ${formatBytes(totalLength)} | :etas ETA`, {
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
