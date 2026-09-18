/** @param {string} locale */
export function localeDirection(locale) {
  return ["ar", "fa", "ur"].includes(
    locale.toLowerCase().replaceAll("_", "-").split("-")[0],
  )
    ? "rtl"
    : "ltr";
}

/** @param {string} locale */
export function applyLocaleDirection(locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = localeDirection(locale);
}
