import { createI18n } from 'vue-i18n';

import { messages } from '@/locales';
import { getLanguage, setLanguage } from '@/utils/localStorage/app';

export const SUPPORT_LOCALES = ['zh', 'en', 'es', 'fr', 'ja'] as const;
export type SupportLocale = (typeof SUPPORT_LOCALES)[number];

export const SUPPORT_LOCALE_OPTIONS: { label: string; value: SupportLocale }[] =
  [
    { label: '简体中文', value: 'zh' },
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Français', value: 'fr' },
    { label: '日本語', value: 'ja' },
  ];

function isSupportLocale(locale: string): locale is SupportLocale {
  return SUPPORT_LOCALES.includes(locale as SupportLocale);
}

function normalizeLocale(locale = ''): SupportLocale | undefined {
  const lowerLocale = locale.toLowerCase();
  return SUPPORT_LOCALES.find(
    (item) => lowerLocale === item || lowerLocale.startsWith(`${item}-`)
  );
}

export function getInitialLocale(): SupportLocale {
  const cacheLocale = getLanguage();
  if (cacheLocale && isSupportLocale(cacheLocale)) {
    return cacheLocale;
  }

  const browserLocale = normalizeLocale(window.navigator.language);
  return browserLocale || 'zh';
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(), // set locale
  fallbackLocale: 'zh', // set fallback locale
  messages, // set locale messages
});

export function getCurrentLocale() {
  return i18n.global.locale.value as SupportLocale;
}

export function setI18nLocale(locale: SupportLocale) {
  i18n.global.locale.value = locale;
  setLanguage(locale);
  document.documentElement.lang = locale;
}

setI18nLocale(getInitialLocale());
