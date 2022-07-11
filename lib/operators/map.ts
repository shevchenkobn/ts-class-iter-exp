import { iterate } from 'iterare';

export function map<T, O>(collection: Iterable<T> | Iterator<T>, mapper: (value: T) => O): Iterator<O> {
  return iterate(collection).map(mapper);
}