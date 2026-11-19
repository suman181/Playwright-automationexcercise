// Turns reports/results.json (Playwright JSON reporter) into a human-readable Markdown execution summary.
const fs = require('fs');
const path = require('path');

const input = process.argv[2] || 'reports/results.json';
const output = process.argv[3] || 'reports/execution-summary.md';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));

const perProject = {};
const failed = [];
const flaky = [];

function walk(suite, trail) {
  const here = suite.title ? [...trail, suite.title] : trail;
  for (const spec of suite.specs || []) {
    for (const t of spec.tests) {
      const p = (perProject[t.projectName] ||= { passed: 0, failed: 0, flaky: 0, skipped: 0, ms: 0 });
      p.ms += t.results.reduce((s, r) => s + r.duration, 0);
      const label = `[${t.projectName}] ${[...here.slice(1), spec.title].join(' › ')}`;
      if (t.status === 'expected') p.passed++;
      else if (t.status === 'unexpected') { p.failed++; failed.push(label); }
      else if (t.status === 'flaky') { p.flaky++; flaky.push(label); }
      else p.skipped++;
    }
  }
  for (const child of suite.suites || []) walk(child, here);
}
(data.suites || []).forEach((s) => walk(s, []));

const sum = (k) => Object.values(perProject).reduce((a, p) => a + p[k], 0);
const total = sum('passed') + sum('failed') + sum('flaky') + sum('skipped');
const secs = (ms) => `${(ms / 1000).toFixed(1)}s`;

let md = `# Test Execution Summary\n\n`;
md += `- **Executed:** ${data.stats?.startTime ?? new Date().toISOString()}\n`;
md += `- **Wall-clock duration:** ${secs(data.stats?.duration ?? 0)}\n`;
md += `- **Total tests (per browser):** ${total}\n`;
md += `- **Passed:** ${sum('passed')}  |  **Failed:** ${sum('failed')}  |  **Flaky (passed on retry):** ${sum('flaky')}  |  **Skipped:** ${sum('skipped')}\n`;
md += `- **Pass rate:** ${total ? (((sum('passed') + sum('flaky')) / total) * 100).toFixed(1) : 0}%\n\n`;
md += `| Project | Passed | Failed | Flaky | Skipped | Test time |\n|---|---:|---:|---:|---:|---:|\n`;
for (const [name, p] of Object.entries(perProject)) {
  md += `| ${name} | ${p.passed} | ${p.failed} | ${p.flaky} | ${p.skipped} | ${secs(p.ms)} |\n`;
}
if (failed.length) md += `\n## Failed tests\n${failed.map((f) => `- ${f}`).join('\n')}\n`;
if (flaky.length) md += `\n## Flaky tests (passed after retry)\n${flaky.map((f) => `- ${f}`).join('\n')}\n`;
md += `\n## Evidence\n- Interactive HTML report: \`reports/html/index.html\` (open with \`npm run report\`)\n- JUnit XML: \`reports/junit.xml\`\n- Screenshots, videos and traces of failed tests: \`test-results/\` (open a trace with \`npx playwright show-trace <trace.zip>\`)\n`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, md);
console.log(`Summary written to ${output}\n`);
console.log(md);
