import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import WebSocket from 'ws';

const baseUrl = process.env.I18N_CLIENT_BASE_URL || 'http://127.0.0.1:5173';
const edgePath =
  process.env.EDGE_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const remoteDebuggingPort = Number(process.env.I18N_CLIENT_DEBUG_PORT || 9237);

const localeMarkers = {
  zh: '语言',
  en: 'Language',
  es: 'Idioma',
  fr: 'Langue',
  ja: '言語',
};

const clients = [
  {
    name: 'web-remote',
    route: '/#/remote',
    markers: {
      zh: '远程控制',
      en: 'Remote Control',
      es: 'Control remoto',
      fr: 'Controle a distance',
      ja: 'リモート操作',
    },
  },
  {
    name: 'web-settings',
    route: '/#/setting',
    markers: localeMarkers,
  },
  {
    name: 'web-privatization-deployment',
    route: '/#/privatizationDeployment',
    markers: {
      zh: '私有化部署',
      en: 'Private deployment',
      es: 'Despliegue privado',
      fr: 'Deploiement prive',
      ja: 'プライベートデプロイ',
    },
  },
  {
    name: 'h5-privatization-deployment',
    route: '/#/h5/privatizationDeployment',
    markers: {
      zh: '私有化部署',
      en: 'Private deployment',
      es: 'Despliegue privado',
      fr: 'Deploiement prive',
      ja: 'プライベートデプロイ',
    },
  },
  {
    name: 'webrtc-client',
    route: '/#/webrtc',
    markers: {
      zh: '连接详情',
      en: 'Connection details',
      es: 'Detalles de conexion',
      fr: 'Details de connexion',
      ja: '接続詳細',
    },
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function assertServerReady() {
  try {
    const res = await fetch(baseUrl);
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
  } catch (error) {
    throw new Error(
      `i18n client switch test requires a running client at ${baseUrl}. ` +
        `Start it with: pnpm exec cross-env VITE_APP_RELEASE_PROJECT_ISWEB=true vite --host 0.0.0.0. ` +
        `Original error: ${error.message}`
    );
  }
}

async function waitJson(url, timeout = 15000) {
  const start = Date.now();
  let lastError = '';
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
      lastError = `${res.status} ${res.statusText}`;
    } catch (error) {
      lastError = error.message;
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0;
  const pending = new Map();
  const events = [];

  ws.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      events.push(msg);
    }
  });

  const opened = new Promise((resolve, reject) => {
    ws.once('open', resolve);
    ws.once('error', reject);
  });

  async function send(method, params = {}) {
    await opened;
    id += 1;
    const msgId = id;
    const result = new Promise((resolve) => pending.set(msgId, resolve));
    ws.send(JSON.stringify({ id: msgId, method, params }));
    const response = await result;
    if (response.error) {
      throw new Error(`${method}: ${JSON.stringify(response.error)}`);
    }
    return response.result;
  }

  return { ws, send, events };
}

function getIssues(events) {
  return events
    .filter((event) => {
      if (event.method === 'Runtime.exceptionThrown') {
        return true;
      }
      if (event.method === 'Runtime.consoleAPICalled') {
        return event.params.type === 'error';
      }
      if (event.method === 'Log.entryAdded') {
        return event.params.entry.level === 'error';
      }
      if (event.method === 'Network.loadingFailed') {
        return !event.params.canceled;
      }
      if (event.method === 'Network.responseReceived') {
        const { status, url } = event.params.response;
        return status >= 400 && !url.includes('/favicon.ico');
      }
      return false;
    })
    .map((event) => {
      if (event.method === 'Runtime.consoleAPICalled') {
        return {
          method: event.method,
          type: event.params.type,
          text: (event.params.args || [])
            .map((arg) => arg.value || arg.description || '')
            .join(' '),
        };
      }
      if (event.method === 'Runtime.exceptionThrown') {
        return {
          method: event.method,
          text: event.params.exceptionDetails?.text,
          description: event.params.exceptionDetails?.exception?.description,
        };
      }
      if (event.method === 'Log.entryAdded') {
        return {
          method: event.method,
          level: event.params.entry.level,
          text: event.params.entry.text,
          url: event.params.entry.url,
        };
      }
      if (event.method === 'Network.responseReceived') {
        return {
          method: event.method,
          status: event.params.response.status,
          url: event.params.response.url,
        };
      }
      return {
        method: event.method,
        errorText: event.params.errorText,
        type: event.params.type,
      };
    });
}

function localeStorageValue(locale) {
  return JSON.stringify({ value: locale, createTime: Date.now() });
}

async function waitForProcessExit(process, timeout = 5000) {
  if (process.exitCode !== null) {
    return;
  }

  process.kill();
  await Promise.race([
    new Promise((resolve) => process.once('exit', resolve)),
    sleep(timeout),
  ]);
}

async function removeDirectoryWithRetry(dir) {
  const attempts = 6;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      return;
    } catch (error) {
      if (!['EBUSY', 'ENOTEMPTY', 'EPERM'].includes(error.code)) {
        throw error;
      }
      if (attempt === attempts) {
        console.warn(
          `Unable to remove temporary browser profile ${dir}: ${error.message}`
        );
        return;
      }
      await sleep(attempt * 500);
    }
  }
}

await assertServerReady();

if (!fs.existsSync(edgePath)) {
  throw new Error(
    `Microsoft Edge was not found at ${edgePath}. Set EDGE_PATH to a Chromium executable.`
  );
}

const userDataDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'billd-desk-i18n-client-')
);
const browser = spawn(
  edgePath,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--disable-extensions',
    '--disable-background-networking',
    `--remote-debugging-port=${remoteDebuggingPort}`,
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'ignore'] }
);

try {
  const version = await waitJson(
    `http://127.0.0.1:${remoteDebuggingPort}/json/version`
  );
  const browserCdp = connect(version.webSocketDebuggerUrl);
  const target = await browserCdp.send('Target.createTarget', {
    url: 'about:blank',
  });
  const targets = await waitJson(
    `http://127.0.0.1:${remoteDebuggingPort}/json/list`
  );
  const page = targets.find((item) => item.id === target.targetId);

  if (!page) {
    throw new Error(
      'Unable to create browser page for i18n client switch test.'
    );
  }

  const cdp = connect(page.webSocketDebuggerUrl);
  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Page.enable');
  await cdp.send('Network.enable');

  const failures = [];

  for (let clientIndex = 0; clientIndex < clients.length; clientIndex += 1) {
    const client = clients[clientIndex];
    const markerEntries = Object.entries(client.markers);

    for (
      let markerIndex = 0;
      markerIndex < markerEntries.length;
      markerIndex += 1
    ) {
      const [locale, marker] = markerEntries[markerIndex];

      cdp.events.length = 0;
      await cdp.send('Page.navigate', { url: `${baseUrl}${client.route}` });
      await sleep(1000);
      await cdp.send('Runtime.evaluate', {
        expression: `localStorage.setItem('billd_desk___language', ${JSON.stringify(
          localeStorageValue(locale)
        )})`,
      });
      await cdp.send('Page.reload', { ignoreCache: true });
      await sleep(client.name.includes('remote') ? 5000 : 3500);

      const result = await cdp.send('Runtime.evaluate', {
        expression: `({
          lang: document.documentElement.lang,
          overlay: !!document.querySelector('vite-error-overlay, .vite-error-overlay'),
          text: document.querySelector('#app')?.innerText || document.body.innerText || '',
          location: location.href
        })`,
        returnByValue: true,
      });

      const dom = result.result.value;
      const issues = getIssues(cdp.events);
      const normalizedRoute = client.route.replace(
        '/#/h5/privatizationDeployment',
        '/#/privatizationDeployment'
      );
      const routeLoaded = dom.location.includes(
        normalizedRoute.replace('/#', '#')
      );

      if (dom.lang !== locale) {
        failures.push(
          `${client.name}/${locale}: expected html lang ${locale}, got ${dom.lang}`
        );
      }
      if (dom.overlay) {
        failures.push(
          `${client.name}/${locale}: Vite error overlay is visible`
        );
      }
      if (!dom.text.includes(marker)) {
        failures.push(`${client.name}/${locale}: missing marker "${marker}"`);
      }
      if (!routeLoaded) {
        failures.push(
          `${client.name}/${locale}: unexpected route ${dom.location}`
        );
      }
      if (issues.length) {
        failures.push(
          `${client.name}/${locale}: browser issues ${JSON.stringify(issues)}`
        );
      }
    }
  }

  cdp.ws.close();
  browserCdp.ws.close();

  if (failures.length) {
    throw new Error(
      `i18n client switch verification failed:\n${failures.join('\n')}`
    );
  }

  console.log(
    `i18n client switch verified: ${clients.map((client) => client.name).join(', ')}; locales ${Object.keys(
      localeMarkers
    ).join(', ')}`
  );
} finally {
  await waitForProcessExit(browser);
  await removeDirectoryWithRetry(userDataDir);
}
