const checkJavaInstalled = require('./checkJavaInstalled');
const { info, success } = require('./logSymbols');

function getDownloadUrlAndHash(downloadUrls) {
  const platform = checkJavaInstalled() ? 'all' : process.platform;

  info('Check system info and generate download links ...');

  if (!downloadUrls[platform]) {
    throw new Error(`Can't find download info for "${platform}" platform`);
  }

  if (platform !== 'all' && process.arch !== 'x64') {
    throw new Error(`CPU architecture "${process.arch}" is not supported`);
  }

  success('Done!');

  return {
    url: downloadUrls[platform].url,
    md5: downloadUrls[platform].md5,
  };
}

module.exports = getDownloadUrlAndHash;
