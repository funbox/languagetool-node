const fs = require('fs');
const vfile = require('vfile');

function createVfile(path) {
  if (!path && !process.stdin.isTTY && process.platform !== 'win32') {
    // When Git BASH terminal is used we can't get data from STDIN.
    // That's why it's turned off here, and it's impossible to use STDIN in Windows.
    return vfile(fs.readFileSync(0)); // file descriptor 0 is stdin
  }

  if (path && fs.existsSync(path)) {
    return vfile({
      contents: fs.readFileSync(path),
      path,
    });
  }

  return null;
}

module.exports = createVfile;
