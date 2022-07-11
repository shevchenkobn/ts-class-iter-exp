import { toIterator } from 'iterare/lib/utils';

/**
 * Missing operator.
 * @param {Iterator<T> | Iterable<T>} collection
 * @param {(value: T) => boolean} predicate
 * @returns {Generator<T, any, undefined>}
 */
export function* takeWhile<T>(collection: Iterator<T> | Iterable<T>, predicate: (value: T) => boolean): Generator<T, any, undefined> {
  const iterator = toIterator(collection);
  let done: boolean;
  do {
    const result = iterator.next();
    done = !predicate(result.value) || !!result.done;
    if (!done) {
      yield result.value;
    }
  } while (!done);
}
