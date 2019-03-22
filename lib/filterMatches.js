function filterMatches({ matches = [], whitelist = [] } = {}) {
  return matches.filter(match => {
    const c = match.context;
    const badWord = c.text.slice(c.offset, c.offset + c.length);

    // eslint-disable-next-line no-restricted-syntax
    for (const goodWord of whitelist) {
      const regex = RegExp(`^${goodWord}$`, 'i');

      if (regex.test(badWord)) {
        return false;
      }
    }

    return true;
  });
}

module.exports = filterMatches;
