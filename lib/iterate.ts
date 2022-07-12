import { toIterator } from 'iterare/lib/utils';
import { IteratorWithOperators } from './iterator-with-operators';
import { IterableOrIterator } from './types';

/**
 * Creates an Iterator with advanced chainable operator methods for any Iterable or Iterator
 */
export function iterate<T>(collection: IterableOrIterator<T>): IteratorWithOperators<T> {
  return new IteratorWithOperators(toIterator(collection))
}