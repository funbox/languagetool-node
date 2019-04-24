const { EOL } = require('os');
const vfileLocation = require('vfile-location');

const colorize = require('./colorize');

function generateReport({ vfile, matches = [] } = {}) {
  const matchesTotal = matches.length;

  if (vfile === null || !matchesTotal) return;

  const location = vfileLocation(vfile);

  matches.forEach((match, index) => {
    const isLast = matchesTotal === index + 1;
    const { line = 1, column = 1 } = location.toPosition(match.offset);

    const replacements = match.replacements.map(r => r.value).join(', ');

    const ctx = match.context;
    const contextPrefix = ctx.text.slice(0, ctx.offset);
    const contextPostfix = ctx.text.slice(ctx.offset + ctx.length, ctx.text.length);
    const contextHighlighted = ctx.text.slice(ctx.offset, ctx.offset + ctx.length);

    vfile.message(
      `${match.message.replace(/(\s{2})/g, '')}
${colorize(`Context: «${contextPrefix}`).dim}\
${colorize(colorize(contextHighlighted).bgRed).reset}\
${colorize(`${contextPostfix}»`).dim}\
${replacements.length ? `${EOL}${colorize(`Possible replacements: «${replacements}»`).dim}` : ''}\
${isLast ? '' : EOL}`,
      { line, column },
      `spell:${match.rule.issueType}`,
    );
  });
}

module.exports = generateReport;
