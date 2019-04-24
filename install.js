#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');
const url = require('url');

const appConfig = require('./.languagetoolrc');

const downloadLanguageTool = require('./lib/downloadLanguageTool');
const { error, info, success } = require('./lib/log');
const unzipFile = require('./lib/unzipFile');

install();

async function install() {
  try {
    const { url: zipUrl, md5 } = appConfig.downloadUrls.stable;

    const urlParts = url.parse(zipUrl, true);
    const { base, name } = path.parse(decodeURIComponent(urlParts.pathname));

    const savePath = path.resolve(fs.realpathSync(os.tmpdir()), base);
    const installPath = __dirname;
    const finalPath = path.join(installPath, 'languagetool');

    if (fs.existsSync(finalPath)) return;

    console.log();
    await downloadLanguageTool({ url: zipUrl, md5, savePath });

    console.log();
    await unzipFile(savePath, installPath);

    console.log();
    info(`Rename "${name}" to "languagetool" ...`);
    fs.renameSync(path.resolve(installPath, name), finalPath);
    success('Done!');

    console.log();
    info('Remove temp files ...');
    fs.unlinkSync(savePath);
    success('Done!');
  } catch (err) {
    error(err);
    process.exit(1);
  }
}
