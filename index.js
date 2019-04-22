#!/usr/bin/env node

const deepmerge = require('deepmerge');
const fs = require('fs');
const ora = require('ora');
const path = require('path');
const reporter = require('vfile-reporter');

const createVfile = require('./lib/createVfile');
const filterMatches = require('./lib/filterMatches');
const generateReport = require('./lib/generateReport');
const getMatches = require('./lib/getMatches');
const languageTool = require('./lib/languageTool');
const { error } = require('./lib/logSymbols');

/* eslint-disable import/no-dynamic-require */
const configName = '.languagetoolrc.js';
const defaultConfig = require(`./${configName}`);
const externalConfigPath = path.join(process.cwd(), '.languagetoolrc.js');
const appConfig = fs.existsSync(externalConfigPath)
  ? deepmerge(defaultConfig, require(externalConfigPath))
  : defaultConfig;
/* eslint-enable import/no-dynamic-require */

const processArgs = process.argv.slice(2);

let files = [];

if (!process.stdin.isTTY && process.platform !== 'win32') {
  // STDIN
  files.push(createVfile());
} else {
  files = processArgs
    .filter(file => fs.existsSync(file) && fs.statSync(file).isFile())
    .map(createVfile);
}

if (files.length) {
  check(files);
}

async function check(vfiles) {
  const spinner = ora('Processing...').start();

  try {
    const { port } = await languageTool(
      path.resolve(__dirname, 'languagetool', process.platform === 'win32' ? 'run-server.bat' : 'run-server.sh'),
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const vfile of vfiles) {
      // eslint-disable-next-line no-await-in-loop
      const matches = await getMatches({
        url: `http://127.0.0.1:${port}/v2/check`,
        text: String(vfile.contents),
      });
      const filteredMatches = filterMatches({ matches, whitelist: appConfig.ignore });

      if (filteredMatches.length) {
        generateReport({ matches: filteredMatches, vfile });
        process.exitCode = 1;
      }
    }

    spinner.stop();
    console.log(reporter(vfiles, { quiet: true }));
  } catch (err) {
    spinner.stop();
    error(err);
    process.exitCode = 1;
  }

  process.exit();
}

process.on('unhandledRejection', error);
