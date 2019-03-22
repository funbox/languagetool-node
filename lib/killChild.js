const { execSync } = require('child_process');
const { platform } = require('os');

function killChild(pid) {
  if (platform() === 'win32') {
    execSync(`taskkill /PID ${pid} /T /F`);
  } else {
    // https://azimi.me/2014/12/31/kill-child_process-node-js.html
    process.kill(-pid);
  }
}

module.exports = killChild;
