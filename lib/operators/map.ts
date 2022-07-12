import { iterate } from 'iterare';
import { IterableOrIterator } from '../types';

export function map<T, O>(collection: IterableOrIterator<T>, mapper: (value: T) => O): Iterator<O> {
  return iterate(collection).map(mapper);
}