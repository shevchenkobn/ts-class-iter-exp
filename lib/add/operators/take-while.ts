import { IteratorWithOperators } from '../../iterator-with-operators';
import { takeWhile as operator } from '../../operators/take-while';
declare module '../../iterator-with-operators' {
  export interface IteratorWithOperators<T> {
    takeWhile(predicate: (value: T) => boolean): IteratorWithOperators<T>;
  }
}

IteratorWithOperators.prototype.takeWhile = function takeWhile<T>(this: IteratorWithOperators<T>, predicate: (value: T) => boolean) {
  return new IteratorWithOperators<T>(operator(this.source, predicate));
}
