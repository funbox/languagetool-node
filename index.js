#!/usr/bin/env node

const axios = require('axios');
const deepmerge = require('deepmerge');
const fs = require('fs');
const os = require('os');
const ora = require('ora');
const path = require('path');
const reporter = require('vfile-reporter');

const checkJavaInstalled = require('./lib/checkJavaInstalled');
const createVfile = require('./lib/createVfile');
const generateReport = require('./lib/generateReport');
const { error, info } = require('./lib/log');
const startLanguageToolServer = require('./lib/startLanguageToolServer');

if (!checkJavaInstalled()) {
  error('To use this command-line tool you need to install a JDK.');
  info('Please visit the Java Developer Kit download website: https://www.java.com');
  process.exit(1);
}

/* eslint-disable import/no-dynamic-require */
const configName = '.languagetoolrc.js';
const defaultConfig = require(`./${configName}`);
const externalConfigPath = path.join(os.homedir(), configName);
const appConfig = fs.existsSync(externalConfigPath)
  ? deepmerge(defaultConfig, require(externalConfigPath))
  : defaultConfig;
/* eslint-enable import/no-dynamic-require */

const processArgs = process.argv.slice(2);

let files = [];

if (!process.stdin.isTTY && process.platform !== 'win32') {
  // When Git BASH terminal is used we can't get data from STDIN.
  // That's why it's turned off here, and it's impossible to use STDIN in Windows.
  files.push(createVfile());
} else {
  files = processArgs
    .filter(file => fs.existsSync(file))
    .map(createVfile);
}

if (files.length) {
  check(files);
}

async function check(vfiles) {
  const spinner = ora('Processing...').start();

  try {
    const { port } = await startLanguageToolServer();

    // eslint-disable-next-line no-restricted-syntax
    for (const vfile of vfiles) {
      // eslint-disable-next-line no-await-in-loop
      const matches = await axios({
        url: `http://127.0.0.1:${port}/v2/check`,
        method: 'post',
        params: {
          language: 'auto',
          text: String(vfile.contents),
        },
      }).then(response => response.data.matches);

      const filteredMatches = matches.filter(match => {
        const ctx = match.context;
        const badWord = ctx.text.slice(ctx.offset, ctx.offset + ctx.length);

        return appConfig.ignore.some(goodWord => !RegExp(`^${goodWord}$`, 'i').test(badWord));
      });

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
