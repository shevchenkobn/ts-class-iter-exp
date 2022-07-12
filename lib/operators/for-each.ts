/**
 * Iterates and invokes `iteratee` for every element emitted by the Iterator
 */
import { toIterator } from 'iterare/lib/utils';
import { IterableOrIterator } from '../types';

export function forEach<T>(collection: IterableOrIterator<T>, iteratee: (value: T) => void, doneCallback?: () => void): void {
  const iterator = toIterator(collection);
  let result: IteratorResult<T>
  while (true) {
    result = iterator.next()
    if (result.done) {
      doneCallback?.();
      break
    }
    iteratee(result.value)
  }
}