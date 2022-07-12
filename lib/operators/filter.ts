import { iterate } from 'iterare';
import { IterableOrIterator } from '../types';

export function filter<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean): Iterator<T> {
  return iterate(collection).filter(predicate);
}