const { EOL } = require('os');
const vfileLocation = require('vfile-location');

const colorize = require('./colorize');

function generateReport({ vfile, matches = [] } = {}) {
  const matchesTotal = matches.length;

  if (vfile === null || !matchesTotal) return;

  const location = vfileLocation(vfile);

  matches.forEach((match, index) => {
    const isLast = matchesTotal === ++index;
    const { line = 1, column = 1 } = location.toPosition(match.offset);

    const hasReplacements = !!match.replacements.length;
    const replacements = hasReplacements ? match.replacements.map(r => r.value).join(', ') : '';

    const c = match.context;
    const contextPrefix = c.text.slice(0, c.offset);
    const contextPostfix = c.text.slice(c.offset + c.length, c.text.length);
    const contextHighlighted = c.text.slice(c.offset, c.offset + c.length);

    vfile.message(
      `${match.message.replace(/(\s{2})/g, '')}
${colorize(`Context: «${contextPrefix}`).dim}\
${colorize(colorize(contextHighlighted).bgRed).reset}\
${colorize(`${contextPostfix}»`).dim}\
${hasReplacements ? `${EOL}${colorize(`Possible replacements: «${replacements}»`).dim}` : ''}\
${isLast ? '' : EOL}`,
      { line, column },
      `spell:${match.rule.issueType}`,
    );
  });
}

module.exports = generateReport;
