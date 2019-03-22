const crypto = require('crypto');
const fs = require('fs');

function getFileHash(hashName, filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(hashName);
    const readStream = fs.createReadStream(filePath);

    readStream
      .on('error', reject)
      .on('data', chunk => hash.update(chunk))
      .on('end', () => resolve(hash.digest('hex')));
  });
}

module.exports = getFileHash;
