import fs from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

const rootDir = path.resolve(import.meta.dirname, '..');
const localesDir = path.join(rootDir, 'src', 'locales');
const checkedLocales = ['es', 'fr', 'ja'];

const keysThatMustNotReuseEnglish = [
  'app.versionNumber',
  'deployment.adminWeb',
  'deployment.backendNode',
  'deployment.frontendWeb',
  'deployment.openSourceVersion',
  'remote.camera',
  'remote.resolution',
  'remote.video',
  'webrtc.controlMode',
  'webrtc.cursor',
];

const allowedSameAsEnglish = new Set([
  'deployment.yuan',
  'deployment.qqId',
  'deployment.wechatId',
  'app.wechat',
  'live.placeholderClient_id',
  'live.table.client_id',
  'remote.frameUnit',
]);

function readSource(file) {
  return ts.createSourceFile(
    file,
    fs.readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
}

function getPropertyName(name) {
  if (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNumericLiteral(name)
  ) {
    return name.text;
  }
  throw new Error(`Unsupported locale key syntax: ${name.getText()}`);
}

function getStringValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text;
  }
  return undefined;
}

function extractLocale(locale) {
  const localeDir = path.join(localesDir, locale);
  const messages = {};

  fs.readdirSync(localeDir)
    .filter((file) => file.endsWith('.ts'))
    .forEach((file) => {
      const source = readSource(path.join(localeDir, file));
      function visit(node) {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === 'nameSpaceWrap'
        ) {
          const [namespaceArg, messagesArg] = node.arguments;
          if (
            !ts.isStringLiteral(namespaceArg) ||
            !ts.isObjectLiteralExpression(messagesArg)
          ) {
            throw new Error(`Invalid nameSpaceWrap usage in ${file}`);
          }
          messagesArg.properties.forEach((property) => {
            if (!ts.isPropertyAssignment(property)) {
              return;
            }
            const value = getStringValue(property.initializer);
            if (value !== undefined) {
              messages[
                `${namespaceArg.text}.${getPropertyName(property.name)}`
              ] = value;
            }
          });
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    });

  return messages;
}

const englishMessages = extractLocale('en');
const failures = [];

checkedLocales.forEach((locale) => {
  const messages = extractLocale(locale);

  keysThatMustNotReuseEnglish.forEach((key) => {
    if (allowedSameAsEnglish.has(key)) {
      return;
    }
    if (messages[key] === englishMessages[key]) {
      failures.push(`${locale}.${key} still reuses English: ${messages[key]}`);
    }
  });
});

if (failures.length) {
  throw new Error(
    `Incomplete non-English translations found:\n${failures.join('\n')}`
  );
}

console.log(
  `non-English i18n translations verified: ${checkedLocales.join(', ')}`
);
