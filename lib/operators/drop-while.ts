/**
 * Filter operator.
 * @param {(value: T) => boolean} predicate
 * @returns {(value: T) => (boolean | boolean)}
 */
export function dropWhile<T>(predicate: (value: T) => boolean) {
  let found = true;
  return function dropWhileFilter(value: T) {
    if (!found) {
      return true;
    }
    found &&= predicate(value);
    return !found;
  }
}
