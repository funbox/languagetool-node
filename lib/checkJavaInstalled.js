const { execSync } = require('child_process');

function checkJavaInstalled() {
  try {
    if (process.platform === 'darwin') {
      execSync('/usr/libexec/java_home', { stdio: 'ignore' });
    } else {
      execSync('java -version', { stdio: 'ignore' });
    }

    return true;
  } catch (error) {
    return false;
  }
}

module.exports = checkJavaInstalled;
