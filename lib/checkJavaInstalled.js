const { execSync } = require('child_process');

function checkJavaInstalled() {
  try {
    if (process.platform === 'darwin') {
      // https://stackoverflow.com/questions/14292698/how-do-i-check-if-the-java-jdk-is-installed-on-mac
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
