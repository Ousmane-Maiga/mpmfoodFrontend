// src/i18n.ts
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// Import your translation files
import en from '../app/locales/en.json';
import fr from '../app/locales/fr.json';
// Add more languages as needed, e.g., import es from '../locales/es.json';

const i18n = new I18n({
  en,
  fr,
  // es, // Uncomment and add if you have Spanish translations
});

// Set the locale based on the device's preferred language, if available.
// Fallback to 'en' (English) if no preferred language or if it's not supported by your translations.
i18n.locale = Localization.getLocales()[0]?.languageCode || 'en';

// Enable fallback to the defaultLocale if a translation is missing in the current locale.
i18n.enableFallback = true;
// Set the default locale, used when `enableFallback` is true and a translation is missing.
i18n.defaultLocale = 'en';

/**
 * A simple wrapper function for translations to make it easier to use in components.
 * @param key The translation key (e.g., "common.hello", "sales.overviewTitle").
 * @param options Optional parameters for interpolation or pluralization.
 * @returns The translated string.
 */
export function t(key: string, options?: { [key: string]: any }): string {
  return i18n.t(key, options);
}

export default i18n; // Export the i18n instance itself for more advanced use cases if needed
