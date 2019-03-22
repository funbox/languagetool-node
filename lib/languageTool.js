const { spawn } = require('child_process');

const { findFreePort } = require('./findFreePort');
const killChild = require('./killChild');

function languageTool(command) {
  return new Promise(async (resolve, reject) => {
    const port = await findFreePort(8081);
    const child = spawn(command, ['--port', port], { detached: process.platform !== 'win32' });

    let stderr = '';

    child.stderr
      .on('data', chunk => { stderr += chunk; })
      .on('end', () => reject(stderr));

    child.stdout
      .on('data', chunk => {
        if (/^Server started/g.test(String(chunk))) {
          resolve({ child, port });
        }
      });

    child.on('error', reject);

    if (child.pid) {
      process.on('exit', () => killChild(child.pid));
    }
  });
}

module.exports = languageTool;
