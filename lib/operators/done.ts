import { toIterator } from 'iterare/lib/utils';
import { IterableOrIterator } from '../types';

export function* done<T>(collection: IterableOrIterator<T>, doneCallback: () => void): Generator<T, any, undefined> {
  const iterator = toIterator(collection);
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      doneCallback();
      break;
    }
    yield value;
  }
}