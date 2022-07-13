import { toIterator } from 'iterare/lib/utils';
import { IteratorWithOperators } from './iterator-with-operators';
import { throwWhenDone } from './operators/throw-when.done';
import { IterableOrIterator } from './types';

/**
 * Creates an Iterator with advanced chainable operator methods for any Iterable or Iterator
 */
export function iterate<T>(collection: IterableOrIterator<T>, throwWhenDoneFunction?: (() => never) | true): IteratorWithOperators<T> {
  const iterator = throwWhenDoneFunction ? throwWhenDone(
    collection,
    throwWhenDoneFunction === true ? undefined : throwWhenDoneFunction
  ) : toIterator(collection);
  return new IteratorWithOperators(iterator);
}
