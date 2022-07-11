/**
 * Iterates and invokes `iteratee` for every element emitted by the Iterator
 */
import { toIterator } from 'iterare/lib/utils';

export function forEach<T>(collection: Iterator<T> | Iterable<T>, iteratee: (value: T) => any): void {
  const iterator = toIterator(collection);
  let result: IteratorResult<T>
  while (true) {
    result = iterator.next()
    if (result.done) {
      break
    }
    iteratee(result.value)
  }
}