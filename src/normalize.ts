const SEPARATOR_REGEXP = /[-.]+/g;
const CAMEL_REGEXP = /(?<!^|[A-Z])([A-Z]+)/g;
const UNDERSCORE_DUPS_REGEXP = /__+/g;

export default function normalize(text: string): string {
  return text
    .replace(CAMEL_REGEXP, '_$1')
    .replace(SEPARATOR_REGEXP, '_')
    .replace(UNDERSCORE_DUPS_REGEXP, '_')
    .toUpperCase();
}
