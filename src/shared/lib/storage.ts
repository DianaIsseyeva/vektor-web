export function readStorage<TValue>(key: string, fallback: TValue): TValue {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as TValue) : fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage<TValue>(key: string, value: TValue) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
