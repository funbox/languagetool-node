const colorize = require('./colorize');

const isSupported = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';

function info(string) {
  console.log(colorize(isSupported ? 'ℹ' : 'i').blue, string);
}

function success(string) {
  console.log(colorize(isSupported ? '✔' : '√').green, string);
}

function warning(string) {
  console.log(colorize(isSupported ? '⚠' : '‼').yellow, string);
}

function error(string) {
  console.error(colorize(isSupported ? '✖' : '×').red, string);
}

module.exports = { info, success, warning, error };
