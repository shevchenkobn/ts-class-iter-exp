import { IteratorWithOperators } from '../../iterator-with-operators';
import { throwWhenDone as operator } from '../../operators/throw-when.done';
declare module '../../iterator-with-operators' {
  export interface IteratorWithOperators<T> {
    throwWhenDone(throwFunction?: () => never): IteratorWithOperators<T>;
  }
}

IteratorWithOperators.prototype.throwWhenDone = function takeWhile<T>(this: IteratorWithOperators<T>, throwFunction?: () => never) {
  return new IteratorWithOperators<T>(operator(this.source, throwFunction));
}