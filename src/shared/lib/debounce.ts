export function debounce<TArgs extends readonly unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: TArgs) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => callback(...args), delayMs);
  };
}
