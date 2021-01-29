const { findFreePort } = require('@funboxteam/free-port-finder');
const { execSync, spawn } = require('child_process');
const path = require('path');

function startLanguageToolServer() {
  return new Promise(async (resolve, reject) => {
    const port = await findFreePort(8081);
    const child = spawn(
      'java',
      ['-cp', 'languagetool-server.jar', 'org.languagetool.server.HTTPServer', '--port', port],
      {
        cwd: path.resolve(__dirname, '../languagetool'),
        detached: process.platform !== 'win32',
        // 'detached' here for killing the process under *nix; for Windows taskkill is used
      },
    );

    let stderr = '';

    child.stderr
      .on('data', chunk => { stderr += chunk; })
      .on('end', () => reject(stderr));

    child.stdout
      .on('data', chunk => {
        if (/Server started/g.test(String(chunk))) {
          resolve({ child, port });
        }
      });

    child.on('error', reject);

    if (child.pid) {
      process.on('exit', () => {
        if (process.platform === 'win32') {
          execSync(`taskkill /PID ${child.pid} /T /F`);
        } else {
          // https://azimi.me/2014/12/31/kill-child_process-node-js.html
          process.kill(-child.pid);
        }
      });
    }
  });
}

module.exports = startLanguageToolServer;
