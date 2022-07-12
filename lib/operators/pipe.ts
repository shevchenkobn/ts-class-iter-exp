import { toIterator } from 'iterare/lib/utils';
import { PipeOperator } from '../pipify';
import { IterableOrIterator } from '../types';

// export function pipe<T>(collection: IterableOrIterator<T>, ...operators: PipeOperator<T>[]): Iterator<T>;
// export function pipe<A, B>(collection: IterableOrIterator<A>, op1: PipeOperator<A, B>): Iterator<B>;
// export function pipe<A, B, C>(collection: IterableOrIterator<A>, op1: PipeOperator<A, B>, op2: PipeOperator<B, C>): Iterator<C>;
// export function pipe<A, B, C, D>(collection: IterableOrIterator<A>, op1: PipeOperator<A, B>, op2: PipeOperator<B, C>, op3: PipeOperator<C, D>): Iterator<D>;
// export function pipe<A, B, C, D, E>(collection: IterableOrIterator<A>, op1: PipeOperator<A, B>, op2: PipeOperator<B, C>, op3: PipeOperator<C, D>, op4: PipeOperator<D, E>): Iterator<E>;
// export function pipe<A, B, C, D, E, F>(collection: IterableOrIterator<A>, op1: PipeOperator<A, B>, op2: PipeOperator<B, C>, op3: PipeOperator<C, D>, op4: PipeOperator<D, E>, op5: PipeOperator<E, F>): Iterator<F>;
// export function pipe<A, B, C, D, E, F, G>(collection: IterableOrIterator<A>, op1: PipeOperator<A, B>, op2: PipeOperator<B, C>, op3: PipeOperator<C, D>, op4: PipeOperator<D, E>, op5: PipeOperator<E, F>, op6: PipeOperator<F, G>): Iterator<G>;
// export function pipe(collection: IterableOrIterator<any>, ...operators: PipeOperator<any>[]): Iterator<any>;
export function pipe<A, B>(collection: IterableOrIterator<A>, ...operators: [PipeOperator<A, B>]): Iterator<B>;
export function pipe<A, B, C>(collection: IterableOrIterator<A>, ...operators: [PipeOperator<A, B>, PipeOperator<B, C>]): Iterator<C>;
export function pipe<A, B, C, D>(collection: IterableOrIterator<A>, ...operators: [PipeOperator<A, B>, PipeOperator<B, C>, PipeOperator<C, D>]): Iterator<D>;
export function pipe<A, B, C, D, E>(collection: IterableOrIterator<A>, ...operators: [PipeOperator<A, B>, PipeOperator<B, C>, PipeOperator<C, D>, PipeOperator<D, E>]): Iterator<E>;
export function pipe<A, B, C, D, E, F>(collection: IterableOrIterator<A>, ...operators: [PipeOperator<A, B>, PipeOperator<B, C>, PipeOperator<C, D>, PipeOperator<D, E>, PipeOperator<E, F>]): Iterator<F>;
export function pipe<A, B, C, D, E, F, G>(collection: IterableOrIterator<A>, ...operators: [PipeOperator<A, B>, PipeOperator<B, C>, PipeOperator<C, D>, PipeOperator<D, E>, PipeOperator<E, F>, PipeOperator<F, G>]): Iterator<G>;
export function pipe<T>(collection: IterableOrIterator<T>, ...operators: PipeOperator<T>[]): Iterator<T>;
export function pipe(collection: IterableOrIterator<any>, ...operators: PipeOperator<any>[]): Iterator<any>;
export function pipe(collection: IterableOrIterator<any>, ...operators: PipeOperator<any>[]): Iterator<any> {
  let iterator = toIterator(collection);
  for (const operator of operators) {
    iterator = operator(iterator);
  }
  return iterator;
}