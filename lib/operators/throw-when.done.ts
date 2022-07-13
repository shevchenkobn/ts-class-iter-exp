import { toIterator } from 'iterare/lib/utils';
import { IterableOrIterator } from '../types';

export function throwWhenDone<T>(collection: IterableOrIterator<T>, throwFunction: () => never = () => { throw new TypeError('Iterator is done!') }): Iterator<T> {
  const iterator = toIterator(collection);
  let done = false;
  return {
    next() {
      if (done) {
        throwFunction();
      }
      const result = iterator.next();
      done = !!result.done;
      return result;
    }
  }
}