const crypto = require('crypto');
const fs = require('fs');

function getFileMD5Hash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('md5');
    const readStream = fs.createReadStream(filePath);

    readStream
      .on('error', reject)
      .on('data', chunk => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')));
  });
}

module.exports = getFileMD5Hash;
