import { iterate } from 'iterare';
import { IteratorWithOperators } from '../../iterator-with-operators';
import { dropWhile as operator } from '../../operators/filter/drop-while';
declare module '../../iterator-with-operators' {
  export interface IteratorWithOperators<T> {
    dropWhile(predicate: (value: T) => boolean): IteratorWithOperators<T>;
  }
}

IteratorWithOperators.prototype.dropWhile = function dropWhile<T>(this: IteratorWithOperators<T>, predicate: (value: T) => boolean) {
  return new IteratorWithOperators<T>(iterate(this.source).filter(operator(predicate)));
}