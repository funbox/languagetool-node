const StreamZip = require('node-stream-zip');

const { info, success } = require('./logSymbols');

function unzipFile(filePath, extractPath) {
  return new Promise((resolve, reject) => {
    const zip = new StreamZip({ file: filePath });

    info('Extracting ...');

    zip
      .on('error', reject)
      .on('ready', () => {
        zip.extract(null, extractPath, (error, count) => {
          if (error) {
            return reject(error);
          }

          success(`Done! Extracted ${count} entries to "${extractPath}"`);
          zip.close();

          return resolve();
        });
      });
  });
}

module.exports = unzipFile;
