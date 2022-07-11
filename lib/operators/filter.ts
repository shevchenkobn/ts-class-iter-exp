import { iterate } from 'iterare';

export function filter<T>(collection: Iterable<T> | Iterator<T>, predicate: (value: T) => boolean): Iterator<T> {
  return iterate(collection).filter(predicate);
}