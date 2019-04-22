const glob = require('glob');

function getFilesByPath(path) {
  return glob.sync(`${path}/**/*.+(txt|TXT|md|MD)`, {
    ignore: ['./node_modules/**', '**/node_modules/**'],
  });
}

module.exports = getFilesByPath;
