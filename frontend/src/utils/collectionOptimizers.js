export function createCollator(locale = 'pl') {
  return new Intl.Collator(locale, { sensitivity: 'base' });
}

export function normalizeSearchTerm(value) {
  return value.trim().toLocaleLowerCase('pl');
}

export function includesNormalizedValue(values, normalizedNeedle) {
  if (!normalizedNeedle) {
    return true;
  }

  for (const value of values) {
    if (value && value.toLocaleLowerCase('pl').includes(normalizedNeedle)) {
      return true;
    }
  }

  return false;
}

export function updateItemById(items, nextItem) {
  return items.map((item) => (item.id === nextItem.id ? nextItem : item));
}

export function removeItemById(items, itemId) {
  return items.filter((item) => item.id !== itemId);
}

export function prependItem(items, nextItem) {
  return [nextItem, ...items];
}
