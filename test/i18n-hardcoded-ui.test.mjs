import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '..');

const files = [
  'src/views/webrtc/index.vue',
  'src/views/privatizationDeployment/index.vue',
  'src/views/h5/privatizationDeployment/index.vue',
  'src/hooks/use-websocket.ts',
  'src/utils/network/webSocket.ts',
  'src/utils/network/webRTC.ts',
];

const allowedSnippets = [
  '简体中文',
  '日本語',
];

function stripComments(source) {
  return source
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

function stripDebugLines(source) {
  return source
    .split(/\r?\n/)
    .filter((line) => !/\bconsole\.(log|warn|error|info|debug)\b/.test(line))
    .join('\n');
}

function isAllowed(line) {
  return allowedSnippets.some((snippet) => line.includes(snippet));
}

function isUserFacingTsLine(line) {
  return /window\.\$message|alert\(|\btitle:\s*['"`]|\bcontent:\s*['"`]|\bh\(|=>\s*['"`]/.test(line);
}

const failures = [];

files.forEach((file) => {
  const absoluteFile = path.join(rootDir, file);
  const source = stripDebugLines(stripComments(fs.readFileSync(absoluteFile, 'utf8')));
  source.split(/\r?\n/).forEach((line, index) => {
    const shouldScanLine = file.endsWith('.vue') || isUserFacingTsLine(line);
    if (shouldScanLine && /[\p{Script=Han}]/u.test(line) && !isAllowed(line)) {
      failures.push(`${file}:${index + 1}: ${line.trim()}`);
    }
  });
});

if (failures.length) {
  throw new Error(`Hardcoded UI Chinese found:\n${failures.join('\n')}`);
}

console.log('i18n hardcoded UI scan passed');
