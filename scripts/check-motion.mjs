import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const compositions = path.join(root, 'public', 'compositions');
const cli = path.join(root, 'node_modules', 'hyperframes', 'dist', 'cli.js');
const reports = path.join(root, 'motion', 'reports');
const previews = path.join(root, 'motion', 'previews');
const manifests = JSON.parse(fs.readFileSync(path.join(compositions, 'manifest.json'), 'utf8'));
const requested = new Set(process.argv.slice(2));
fs.mkdirSync(reports, { recursive: true });
let failed = false;
const summaries = [];

for (const entry of manifests) {
  for (const variant of ['desktop', 'mobile']) {
    const name = `${entry.id}-${variant}`;
    if (requested.size && !requested.has(name)) continue;
    const target = path.dirname(path.join(root, 'public', entry[variant].src));
    const times = entry.id === 'process' ? '0,2.3,4.7,7.5,8.9' : entry.id === 'chapter' ? '0,1.5,3,4.5,6.9' : entry.id === 'passage' ? '0,1.2,3.2,5.4,6.9' : '0,2,4,6,7.9';
    console.log(`Checking ${name} with the official HyperFrames CLI...`);
    const result = spawnSync(process.execPath, [cli, 'check', target, '--samples', '5', '--at', times, '--snapshots', '--json'], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
    fs.writeFileSync(path.join(reports, `${name}.json`), result.stdout || '{}');
    fs.writeFileSync(path.join(reports, `${name}.log`), result.stderr || '');
    let report;
    try { report = JSON.parse(result.stdout); } catch { report = {}; }
    const checks = ['lint', 'runtime', 'layout', 'motion', 'contrast', 'craft'];
    const findings = checks.flatMap(key => (report[key]?.findings || []).map(finding => ({ check: key, ...finding })));
    const passed = result.status === 0 && report.ok === true && findings.every(finding => finding.severity !== 'error' && finding.severity !== 'warning');
    const preview = path.join(previews, name);
    fs.mkdirSync(preview, { recursive: true });
    for (const relative of report.snapshots?.files || []) {
      const file = path.resolve(target, relative);
      if (!file.startsWith(`${path.resolve(target)}${path.sep}`)) throw new Error('Snapshot outside its composition.');
      fs.copyFileSync(file, path.join(preview, path.basename(file)));
    }
    // Check resolves into the explicitly owned compositions directory before cleaning generated CLI artifacts.
    const artifacts = path.resolve(target, '.hyperframes');
    if (!artifacts.startsWith(`${compositions}${path.sep}`) || path.basename(artifacts) !== '.hyperframes') throw new Error('Unsafe artifact cleanup path.');
    fs.rmSync(artifacts, { recursive: true, force: true });
    summaries.push({ name, passed, findings, frames: report.snapshots?.times || [], contrast: report.contrast?.checked, motionSamples: report.motion?.samples });
    failed ||= !passed;
    console.log(`${name}: ${passed ? 'PASS' : 'FAIL'} (${findings.length} findings)`);
  }
}

if (!summaries.length) throw new Error('No matching composition names. Use blueprint-desktop, blueprint-mobile, process-desktop, process-mobile, chapter-desktop, chapter-mobile, threshold-desktop, threshold-mobile, passage-desktop, passage-mobile.');
const summaryPath = path.join(reports, 'latest-summary.json');
const previous = requested.size && fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')) : [];
const summaryByName = new Map(previous.map(summary => [summary.name, summary]));
for (const summary of summaries) summaryByName.set(summary.name, summary);
fs.writeFileSync(summaryPath, JSON.stringify([...summaryByName.values()], null, 2));
process.exitCode = failed ? 1 : 0;
