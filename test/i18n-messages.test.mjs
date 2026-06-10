import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const rootDir = path.resolve(import.meta.dirname, '..');
const localesDir = path.join(rootDir, 'src', 'locales');
const expectedLocales = ['zh', 'en', 'es', 'fr', 'ja'];

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
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
    return name.text;
  }
  throw new Error(`Unsupported locale key syntax: ${name.getText()}`);
}

function extractNamespaceKeys(file) {
  const source = readSource(file);
  let namespace = '';
  const keys = [];

  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'nameSpaceWrap'
    ) {
      const [namespaceArg, messagesArg] = node.arguments;
      if (!ts.isStringLiteral(namespaceArg) || !ts.isObjectLiteralExpression(messagesArg)) {
        throw new Error(`Invalid nameSpaceWrap usage in ${file}`);
      }
      namespace = namespaceArg.text;
      messagesArg.properties.forEach((property) => {
        if (!ts.isPropertyAssignment(property)) {
          throw new Error(`Unsupported locale property in ${file}`);
        }
        keys.push(getPropertyName(property.name));
      });
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  if (!namespace) {
    throw new Error(`No nameSpaceWrap call found in ${file}`);
  }
  return { namespace, keys };
}

function getLocaleMessages(locale) {
  const dir = path.join(localesDir, locale);
  if (!fs.existsSync(dir)) {
    throw new Error(`Missing locale directory: ${locale}`);
  }
  return Object.fromEntries(
    fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.ts'))
      .sort()
      .map((file) => {
        const { namespace, keys } = extractNamespaceKeys(path.join(dir, file));
        return [namespace, keys];
      })
  );
}

const localesIndex = fs.readFileSync(path.join(localesDir, 'index.ts'), 'utf8');
const registeredLocales = [...localesIndex.matchAll(/^\s{2}([a-z]+):/gm)].map((match) => match[1]);

if (JSON.stringify(registeredLocales) !== JSON.stringify(expectedLocales)) {
  throw new Error(
    `Expected registered locales ${expectedLocales.join(', ')}, got ${registeredLocales.join(', ')}`
  );
}

const baselineLocale = expectedLocales[0];
const baseline = getLocaleMessages(baselineLocale);

expectedLocales.slice(1).forEach((locale) => {
  const messages = getLocaleMessages(locale);
  const baselineNamespaces = Object.keys(baseline).sort();
  const namespaces = Object.keys(messages).sort();
  if (JSON.stringify(namespaces) !== JSON.stringify(baselineNamespaces)) {
    throw new Error(
      `${locale} namespaces differ from ${baselineLocale}: ${namespaces.join(', ')}`
    );
  }

  baselineNamespaces.forEach((namespace) => {
    const expectedKeys = baseline[namespace].sort();
    const actualKeys = messages[namespace].sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
      throw new Error(`${locale}.${namespace} keys differ from ${baselineLocale}.${namespace}`);
    }
  });
});

console.log(`i18n locales verified: ${expectedLocales.join(', ')}`);
