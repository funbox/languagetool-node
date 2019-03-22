#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');

const appConfig = require('./.languagetoolrc');

const checkJavaInstalled = require('./lib/checkJavaInstalled');
const downloadLanguageTool = require('./lib/downloadLanguageTool');
const getDownloadUrlAndHash = require('./lib/getDownloadUrlAndHash');
const { error, info, success } = require('./lib/logSymbols');
const unzipFile = require('./lib/unzipFile');

install({ config: appConfig, installPath: __dirname });

async function install({ config, installPath } = {}) {
  try {
    const { url: zipUrl, md5: zipHash } = getDownloadUrlAndHash(config.downloadUrls);

    const urlParts = url.parse(zipUrl, true);
    const pathnameParsed = path.parse(decodeURIComponent(urlParts.pathname));

    const fileName = pathnameParsed.name;
    const fileExt = pathnameParsed.ext;

    const savePath = path.resolve(fs.realpathSync(os.tmpdir()), `${fileName}${fileExt}`);
    const finalPath = path.join(installPath, 'languagetool');

    console.log();
    await downloadLanguageTool({ zipUrl, zipHash, savePath });

    console.log();
    await unzipFile(savePath, installPath);

    console.log();
    info(`Rename "${fileName}" to "languagetool"`);
    fs.renameSync(path.resolve(installPath, fileName), finalPath);
    success('Done!');

    if (process.platform !== 'win32') {
      console.log();
      info('Set file permissions ...');
      fs.readdirSync(finalPath).forEach(file => {
        if (path.extname(file) === '.sh') {
          fs.chmodSync(path.resolve(finalPath, file), 0o755);
        }
      });

      if (!checkJavaInstalled()) {
        fs.chmodSync(path.resolve(finalPath, 'jre', 'bin', 'java'), 0o755);
      }

      success('Done!');
    }

    console.log();
    info('Remove temp files ...');
    fs.unlinkSync(savePath);
    success('Done!');
  } catch (err) {
    error(err);
    process.exitCode = 1;
  }

  process.exit();
}

module.exports = install;
