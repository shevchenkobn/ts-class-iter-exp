/**
 * What is this file?
 *
 * This file contains a set of helpers for iterating. It uses `Iterator` as mainFull interface i.e. all function calls are one-shot iterations.
 * Also, it uses `iterare` operators and suggests additional features for this library.
 * Please, make sure to read all comments to fully understand the ideas.
 *
 * The helper functions are marked with JSDoc. Each JSDoc states the type of the function.
 * The name of the function is apparent. Below each JSDoc-ed function there is a set of `console.log` and `tryCatch` which show how the function behaves in different contexts.
 * (These logs can be made into unit tests easily.)
 *
 * There are several type of functions:
 * - generators - create a generator according to given specification;
 * - accumulators - use `Iterator` to produce value. Some accumulators can be replaced by `reduce`, see more details for each accumulator;
 * - reduce operators - an attempt to replace certain accumulators with `reduce` operators. They look very strange;
 * - missing operators - operators, which are missing from `iterare` library. Some of them can be replaced with existing operators;
 * - map operators - high-order functions, which can be used to simplify certain common `map` operations;
 * - filter operators - high-order functions, which can be used to simplify certain common `filter` operations;
 *
 * For readability, implementation for all missing operators and accumulators can be refactored using `iterate(collection).forEach()`.
 */
import { iterate } from 'iterare';
import { IteratorWithOperators } from 'iterare/lib/iterate';
import { isIterable, isIterator, toIterator } from 'iterare/lib/utils';
import { DeepIterableOrIterator, IterableOrIterator } from './lib/types';

export function tryCatch(msg: string, func: () => any) {
  try {
    console.log(msg, func());
  } catch (err) {
    console.warn('[error] ' + msg, err.stack.slice(0, err.stack.indexOf('\n')));
  }
}

/**
 * IteratorWithOperators utility constructor.
 * @param {T} args
 * @returns {IteratorWithOperators<T>}
 */
export function of<T>(...args: T[]): IteratorWithOperators<T> {
  return iterate(args);
}

// console.log('of ok', of(1,2,3,4,5).toArray());
// console.log('of empty', of().toArray());

/**
 * Generator.
 * @returns {Generator<number, any, undefined>}
 */
export function range(): Generator<number, any, undefined>;
export function range(end: number): Generator<number, any, undefined>;
export function range(start: number, end: number, step?: number): Generator<number, any, undefined>;
export function* range(...args: number[]): Generator<number, any, undefined> {
  const start = args.length > 1 ? args[0] as number : 0;
  const step = args.length > 2 ? args[2] as number : 1;
  const end = (args.length === 0 ? Number.POSITIVE_INFINITY : args.length === 1 ? args[0] : args[1]) as number;

  if (step >= 0) {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  }
}

// console.log('range inf', iterate(range()).take(50).toArray());
// console.log('range end', iterate(range(5)).take(50).toArray());
// console.log('range start end', iterate(range(1, 10)).take(50).toArray());
// console.log('range start step end', iterate(range(1, 10, 2)).take(50).toArray());
// console.log('range start step end double', iterate(range(1, 10, .5)).take(50).toArray());
// console.log('range start step end negative', iterate(range(50, 43, -2)).take(50).toArray());
// console.log('range start step end negative double', iterate(range(50, 43, -.5)).take(50).toArray());
// console.log('range repeat 42', iterate(range(42, 128, 0)).take(50).toArray());

/**
 * Generator.
 * @param {T} object
 * @returns {Generator<Extract<keyof T, string>, void, unknown>}
 */
export function* objectKeys<T extends object>(object: T): Generator<Extract<keyof T, string>, void, unknown> {
  for (const key in object) {
    if (Object.hasOwn(object, key)) {
      yield key;
    }
  }
}

const triangle = {a: 1, b: 2, c: 3};
function ColoredTriangle() {
  this.color = 'red';
}
ColoredTriangle.prototype = triangle;

// console.log('objectKeys ok', Array.from(objectKeys(triangle)));
// console.log('objectKeys proto', Array.from(objectKeys(new (ColoredTriangle as any)())));
// console.log('objectKeys empty', Array.from(objectKeys({})));

/**
 * Generator.
 * @param {T} object
 * @returns {Generator<Extract<T[Extract<keyof T, string>], string>, void, unknown>}
 */
export function* objectValues<T extends object>(
  object: T
): Generator<Extract<T[Extract<keyof T, string>], string>, void, unknown> {
  for (const key in object) {
    if (Object.hasOwn(object, key)) {
      yield (object as any)[key];
    }
  }
}

// console.log('objectValues ok', Array.from(objectValues(triangle)));
// console.log('objectValues proto', Array.from(objectValues(new (ColoredTriangle as any)())));
// console.log('objectValues empty', Array.from(objectValues({})));

/**
 * Generator.
 * @param {T} object
 * @returns {Generator<[Extract<keyof T, string>, T[Extract<keyof T, string>]], void, unknown>}
 */
export function* objectEntries<T extends object>(
  object: T
): Generator<[Extract<keyof T, string>, T[Extract<keyof T, string>]], void, unknown> {
  for (const key in object) {
    if (Object.hasOwn(object, key)) {
      yield [key, (object as any)[key]];
    }
  }
}

// console.log('objectEntries ok', Array.from(objectEntries(triangle)));
// console.log('objectEntries proto', Array.from(objectEntries(new (ColoredTriangle as any)())));
// console.log('objectEntries empty', Array.from(objectEntries({})));

/**
 * Often used accumulator. Can be easily replaced by inline reduce operator. Would look weird if replaced with factory reducer operator function.
 * @param {Iterable<readonly [PropertyKey, T]> | Iterator<[PropertyKey, T]>} collection
 * @returns {{[p: string]: T}}
 */
export function fromEntries<T = any>(collection: Iterable<readonly [PropertyKey, T]> | Iterator<[PropertyKey, T]>): { [k: string]: T } {
  const iterator = toIterator(collection);
  const object: Record<PropertyKey, T> = {};
  let done: boolean;
  let entry: readonly [PropertyKey, T];
  do {
    const result = iterator.next();
    done = !!result.done;
    if (!done) {
      object[result.value[0]] = result.value[1];
    }
  } while(!done);
  return object;
}

// console.log('fromEntries ok', fromEntries(objectEntries(triangle)));
// console.log('fromEntries proto', fromEntries(objectEntries(new (ColoredTriangle as any)())));
// console.log('fromEntries empty', fromEntries(objectEntries({})));

/**
 * Often used accumulator, requires certain implementation. Partially can be replaced with `iterate(collection).takeWhile(predicate).take(1).next()`.
 * @param {IterableOrIterator<T>} collection
 * @param {(value: T) => boolean} predicate
 * @returns {T | undefined}
 */
export function firstOrDefault<T>(collection: IterableOrIterator<T>, predicate?: (value: T) => boolean): T | undefined;
export function firstOrDefault<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean, defaultValueGetter: () => T | never): T;
export function firstOrDefault<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean = () => true, defaultValueGetter: () => T | undefined = () => undefined): T | undefined {
  const iterator = toIterator(collection);
  let done: boolean;
  let value: T;
  do {
    const result = iterator.next();
    done = !!result.done;
    if (!done && predicate(result.value)) {
      return result.value;
    }
  } while (!done);
  return defaultValueGetter();
}

// console.log('firstOrDefault ok', firstOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer']));
// console.log('firstOrDefault predicate', firstOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer'].map((v) => ({ v })), (value) => !!value.v));
// console.log('firstOrDefault predicate default', firstOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer'].map((v) => ({ v })), (value) => !!value.v, () => ({ v: 'Not found' })).v);
// console.log('firstOrDefault predicate default throw', firstOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer'].map((v) => ({ v })), (value) => !!value.v, () => { throw new TypeError('Not Found.'); }).v);
// console.log('firstOrDefault not predicate', firstOrDefault(['', '', '', '', ''].map((v) => ({ v })), (value) => !!value.v));
// console.log('firstOrDefault not predicate default', firstOrDefault(['', '', '', ''].map((v) => ({ v })), (value) => !!value.v, () => ({ v: 'Not found' })).v);
// tryCatch('firstOrDefault not predicate default throw', () => firstOrDefault(['', '', '', ''].map((v) => (
//   { v }
// )), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);
// console.log('firstOrDefault empty', firstOrDefault([].map((v) => (
//   { v }
// )), (value) => !!value.v)?.v)
// console.log('firstOrDefault empty default', firstOrDefault([].map((v) => (
//   { v }
// )), (value) => !!value.v, () => ({ v: 'Not found' })).v)
// tryCatch('firstOrDefault empty default throw', () => firstOrDefault([].map((v) => (
//   { v }
// )), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);

/**
 * Often used accumulator, requires certain implementation. Can be replaced, but not in one line (due to throw command).
 * @param {IterableOrIterator<T>} collection
 * @param {(value: T) => boolean} predicate
 * @param {() => void} throwNotFound
 * @returns {T}
 */
export function first<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean = () => true, throwNotFound = () => { throw new TypeError('Value is not found in the collection!'); }): T {
  return firstOrDefault(collection, predicate, throwNotFound);
}

// console.log('first ok', first(['', '', 'asdf', '', '', 'sadf', 'qwer']));
// console.log('first predicate', first(['', '', 'asdf', '', '', 'sadf', 'qwer'].map((v) => ({ v })), (value) => !!value.v).v);
// console.log('first predicate throw', first(['', '', 'asdf', '', '', 'sadf', 'qwer'].map((v) => ({ v })), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);
// tryCatch('first not predicate', () => first(['', '', '', '', ''].map((v) => ({ v })), (value) => !!value.v).v);
// tryCatch('first not predicate throw', () => first(['', '', '', '', ''].map((v) => ({ v })), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);
// tryCatch('first empty', () => first([].map((v) => ({ v })), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);

/**
 * Often used accumulator, requires certain implementation. Cannot be replaced easily with existing operators.
 * @param {IterableOrIterator<T>} collection
 * @param {(value: T) => boolean} predicate
 * @returns {T | undefined}
 */
export function lastOrDefault<T>(collection: IterableOrIterator<T>, predicate?: (value: T) => boolean): T | undefined;
export function lastOrDefault<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean, defaultValueGetter: () => T | never): T;
export function lastOrDefault<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean = () => true, defaultValueGetter: () => T | undefined = () => undefined): T | undefined {
  const iterator = toIterator(collection);
  let done: boolean;
  let found = false;
  let value: T;
  do {
    const result = iterator.next();
    done = !!result.done;
    if (!done) {
      if (predicate(result.value)) {
        found = true;
        value = result.value;
      }
    }
  } while (!done);
  return found ? value! : defaultValueGetter();
}

// console.log('lastOrDefault ok', lastOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer', '']));
// console.log('lastOrDefault predicate', lastOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer', ''].map((v) => ({ v })), (value) => !!value.v));
// console.log('lastOrDefault predicate default', lastOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer', ''].map((v) => ({ v })), (value) => !!value.v, () => ({ v: 'Not found' })).v);
// console.log('lastOrDefault predicate default throw', lastOrDefault(['', '', 'asdf', '', '', 'sadf', 'qwer', ''].map((v) => ({ v })), (value) => !!value.v, () => { throw new TypeError('Not Found.'); }).v);
// console.log('lastOrDefault not predicate', lastOrDefault(['', '', '', '', ''].map((v) => ({ v })), (value) => !!value.v));
// console.log('lastOrDefault not predicate default', lastOrDefault(['', '', '', ''].map((v) => ({ v })), (value) => !!value.v, () => ({ v: 'Not found' })).v);
// tryCatch('lastOrDefault not predicate default throw', () => lastOrDefault(['', '', '', ''].map((v) => (
//   { v }
// )), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);
// console.log('lastOrDefault empty', lastOrDefault([].map((v) => (
//   { v }
// )), (value) => !!value.v)?.v)
// console.log('lastOrDefault empty default', lastOrDefault([].map((v) => (
//   { v }
// )), (value) => !!value.v, () => ({ v: 'Not found' })).v)
// tryCatch('lastOrDefault empty default throw', () => lastOrDefault([].map((v) => (
//   { v }
// )), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);

/**
 * Often used accumulator, requires certain implementation. Cannot be replaced easily with existing operators.
 * @param {IterableOrIterator<T>} collection
 * @param {(value: T) => boolean} predicate
 * @param {() => void} throwNotFound
 * @returns {T}
 */
export function last<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean = () => true, throwNotFound = () => { throw new TypeError('Value is not found in the collection!'); }): T {
  return lastOrDefault(collection, predicate, throwNotFound);
}

// console.log('last ok', last(['', '', 'asdf', '', '', 'sadf', 'qwer', '']));
// console.log('last predicate', last(['', '', 'asdf', '', '', 'sadf', 'qwer', ''].map((v) => ({ v })), (value) => !!value.v).v);
// console.log('last predicate throw', last(['', '', 'asdf', '', '', 'sadf', 'qwer', ''].map((v) => ({ v })), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);
// tryCatch('last not predicate', () => last(['', '', '', '', ''].map((v) => ({ v })), (value) => !!value.v).v);
// tryCatch('last not predicate throw', () => last(['', '', '', '', ''].map((v) => ({ v })), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);
// tryCatch('last empty', () => last([].map((v) => ({ v })), (value) => !!value.v, () => {
//   throw new TypeError('Not Found.');
// }).v);

// /**
//  * Often used accumulator. Can be easily replaced by inline reduce operator. Looks weird if replaced with factory reducer operator function (see below).
//  * @param {IterableOrIterator<T>} collection
//  * @param {(value: T) => number} selector
//  * @returns {number}
//  */
// export function sum<T>(collection: IterableOrIterator<T>, selector: (value: T) => number): number {
//   const iterator = toIterator(collection);
//   let done: boolean;
//   let sum = 0;
//   do {
//     const result = iterator.next();
//     done = !!result.done;
//     if (!done) {
//       sum += selector(result.value);
//     }
//   } while (!done);
//   return sum;
// }
//
// // console.log('sum ok', sum([1,2,3,4,5], (value) => value));
// // console.log('sum empty', sum([], value => value));
//
// /**
//  * Often used accumulator. Can be easily replaced by inline reduce operator. Looks weird if replaced with factory reducer operator function (see below).
//  * @param {IterableOrIterator<unknown>} collection
//  * @returns {number}
//  */
// export function count(collection: IterableOrIterator<unknown>): number {
//   return sum(collection, () => 1);
// }
//
// // console.log('count ok', count([1,2,3,4,5]));
// // console.log('count empty', count([]));

/**
 * Reduce operator. Looks weird and has bad type inference.
 * @param {(value: T) => number} selector
 * @returns {[((sum: number, value: T) => number), number]}
 */
export function sum<T>(selector: (value: T) => number): [(sum: number, value: T) => number, number] {
  return [function sumReducer(sum: number, value: T) {
    return sum + selector(value);
  }, 0]
}

// console.log('sum ok', iterate([1,2,3,4,5]).reduce(...sum<number>((value) => value)));
// console.log('sum empty', iterate([]).reduce(...sum<number>((value) => value)));

/**
 * Reduce operator. Looks weird and has bad type inference.
 * @returns {[((sum: number, value: T) => number), number]}
 */
export function count<T>(): [(sum: number, value: T) => number, number] {
  return sum(() => 1);
}

// console.log('count ok', iterate([1,2,3,4,5]).reduce(...count()));
// console.log('count empty', iterate([]).reduce(...count()));

/**
 * Missing operator. Cannot be replaced easily with existing operators.
 * @param {IterableOrIterator<T>} collection
 * @param {() => T} defaultValueGetter
 * @returns {Generator<T, any, undefined>}
 */
export function* defaultIfEmpty<T>(collection: IterableOrIterator<T>, defaultValueGetter: () => T | never): Generator<T, any, undefined> {
  const iterator = toIterator(collection);
  let done: boolean;
  let isEmpty = true;
  do {
    const result = iterator.next();
    done = !!result.done;
    if (!done) {
      isEmpty = false;
      yield result.value;
    }
  } while (!done);
  if (isEmpty) {
    return defaultValueGetter();
  }
}

// console.log('default ok', Array.from(defaultIfEmpty([], () => 'Empty.')));
// tryCatch('default throw', () => Array.from(defaultIfEmpty([], () => { throw new TypeError('Empty.'); })));
// console.log('default not ok', Array.from(defaultIfEmpty(['', 'asdf'], () => 'Empty.')));
// console.log('default not throw', Array.from(defaultIfEmpty(['', 'asdf'], () => { throw new TypeError('Empty.'); })));

/**
 * Missing operator.
 * @param {IterableOrIterator<T>} collection
 * @param {(value: T) => boolean} predicate
 * @returns {Generator<T, any, undefined>}
 */
export function* takeWhile<T>(collection: IterableOrIterator<T>, predicate: (value: T) => boolean): Generator<T, any, undefined> {
  const iterator = toIterator(collection);
  let done: boolean;
  do {
    const result = iterator.next();
    done = !predicate(result.value) || !!result.done;
    if (!done) {
      yield result.value;
    }
  } while (!done);
}

// console.log('take ok', Array.from(takeWhile([1, 2, 3, 3, 4, 4, 4, 5, 6, 7], (value) => value < 5)));
// console.log('take all', Array.from(takeWhile([1, 2, 3, 3, 4, 4, 4, 5, 6, 7], (value) => value < 100)));
// console.log('take none', Array.from(takeWhile([1, 2, 3, 3, 4, 4, 4, 5, 6, 7], (value) => value < 0)));
// console.log('take empty', Array.from(takeWhile([], (value) => value < 5)));

/**
 * Missing operator. Can be replaced with obscure map & drop operators (map all to pairs, drop first).
 * @param {IterableOrIterator<T>} collection
 * @returns {Generator<[T, T], any, undefined>}
 */
export function* pairwise<T>(collection: IterableOrIterator<T>): Generator<[T, T], any, undefined> {
  const iterator = toIterator(collection);
  let previous!: T;
  let previousSet = false;
  let done: boolean;
  do {
    const result = iterator.next();
    done = !!result.done;
    if (!previousSet) {
      previous = result.value;
      previousSet = true;
      continue;
    }
    if (!done) {
      const pair = [previous, result.value] as [T, T];
      previous = result.value;
      yield pair;
    }
  } while (!done);
}

// console.log('pairwise ok', Array.from(pairwise([1,2,3,4,5,6,7])));
// console.log('pairwise one', Array.from(pairwise([1])));
// console.log('pairwise empty', Array.from(pairwise([])));

/**
 * Missing operator.
 * @param {IterableOrIterator<T>} collection
 * @param {number} chunkSize
 * @returns {Generator<T[], any, undefined>}
 */
export function* chunkify<T>(collection: IterableOrIterator<T>, chunkSize: number): Generator<T[], any, undefined> {
  if (chunkSize <= 0) {
    throw new TypeError(`Expected positive finite chunk size, got ${chunkSize}.`)
  }
  const iterator = toIterator(collection);
  let done: boolean;
  let buffer = [];
  do {
    const result = iterator.next();
    done = !!result.done;
    if (!done) {
      if (buffer.length === chunkSize) {
        yield buffer;
        buffer = [];
      }
      buffer.push(result.value);
    }
  } while (!done);
  if (buffer.length > 0) {
    yield buffer;
  }
}

// console.log('chunk ok', Array.from(chunkify([1,2,3,4,5], 2)));
// console.log('chunk equal', Array.from(chunkify([1,2,3,4,5,1,2,3,4,5,1,2,3,4,5], 3)));
// console.log('chunk small', Array.from(chunkify([1,2], 3)));
// console.log('chunk empty', Array.from(chunkify([], 3)));
// tryCatch('chunk negative', () => Array.from(chunkify([1,2,3,4,5,1,2,3,4,5,1,2,3,4,5], -3)));
// tryCatch('chunk zero', () => Array.from(chunkify([1,2,3,4,5,1,2,3,4,5,1,2,3,4,5], 0)));

export function* flattenDeep<T>(collection: DeepIterableOrIterator<T>): Generator<T, void, undefined> {
  const iterator = toIterator(collection);
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    if (isIterable(value) || isIterator(value)) {
      for (const result of flattenDeep(value)) {
        yield result;
      }
    } else {
      yield value;
    }
  }
}

console.log('flattenDeep ok', Array.from(flattenDeep<string | number>([[2, 3, 5, 6], 2, [2, 3, 5, 3], 2, 3, ['asdf', 1, 3, [[2, 3, 4, 3], 3, 5, 5], 4, ['2', 2, 3, 5]]])));
console.log('flattenDeep empty', Array.from(flattenDeep<number>([])));

// /**
//  * Missing operator. Can be easily replaced with map operator + closure (see below).
//  * @param {IterableOrIterator<T>} collection
//  * @returns {Generator<[number, T], any, undefined>}
//  */
// export function* enumerate<T>(collection: IterableOrIterator<T>): Generator<[number, T], any, undefined> {
//   const iterator = toIterator(collection);
//   let done: boolean;
//   let i = 0;
//   do {
//     const result = iterator.next();
//     done = !!result.done;
//     if (!done) {
//       yield [i, result.value];
//       i += 1;
//     }
//   } while (!done);
// }
//
// // console.log('enum ok', Array.from(enumerate([1,2,3,4,5])));
// // console.log('enum empty', Array.from(enumerate([])));

/**
 * Map operator.
 * @returns {(value: T) => [number, T]}
 */
export function enumerate() {
  let i = 0;
  return function enumerateMap<T>(value: T): [number, T] {
    const pair: [number, T] = [i, value];
    i += 1;
    return pair;
  }
}

// console.log('enum ok', iterate([1,2,3,4,5]).map(enumerate()).toArray());
// console.log('enum empty', iterate([]).map(enumerate()).toArray());
// console.log('enum array ok', ([1,2,3,4,5]).map(enumerate()));
// console.log('enum array empty', ([]).map(enumerate()));

/**
 * Map operator.
 * @param {(accumulated: T, value: T) => T} accumulator
 * @returns {(value: T) => T}
 */
export function scan<T>(accumulator: (accumulated: T, value: T) => T): (value: T) => T;
export function scan<T, A = T>(accumulator: (accumulated: A, value: T) => A, seed: A): (value: T) => A;
export function scan<T, A = T>(accumulator: (accumulated: A, value: T) => A, seed?: A) {
  let accumulated: A = seed!;
  let accumulatedSet = arguments.length > 1;
  return function scanMap(value: T) {
    if (!accumulatedSet) {
      accumulated = value as unknown as A;
      accumulatedSet = true
    } else {
      accumulated = accumulator(accumulated, value);
    }
    return accumulated;
  }
}

// console.log('scan ok', iterate([1,2,3,4,5]).map(scan((a, v) => a + v * 2)).toArray());
// console.log('scan seed', iterate([1,2,3,4,5]).map(scan((a, v) => a + ':' + v * 2, '')).toArray());
// console.log('scan empty', iterate([]).map(scan((a, v) => a + ':' + v * 2, '')).toArray());
// console.log('scan array ok', ([1,2,3,4,5]).map(scan((a, v) => a + v * 2)));
// console.log('scan array seed', ([1,2,3,4,5]).map(scan((a, v) => a + ':' + v * 2, '')));
// console.log('scan array empty', ([]).map(scan((a, v) => a + ':' + v * 2, '')));

/**
 * Filter operator.
 * @param {(value: T) => boolean} predicate
 * @returns {(value: T) => (boolean | boolean)}
 */
export function dropWhile<T>(predicate: (value: T) => boolean) {
  let found = true;
  return function dropWhileFilter(value: T) {
    if (!found) {
      return true;
    }
    found &&= predicate(value);
    return !found;
  }
}

// console.log('drop iter ok', iterate([1, 2, 3, 3, 4, 4, 4, 5, 6, 7]).filter(dropWhile((value) => value < 5)).toArray());
// console.log('drop iter all', iterate([1, 2, 3, 3, 4, 4, 4, 5, 6, 7]).filter(dropWhile((value) => value < 0)).toArray());
// console.log('drop iter none', iterate([1, 2, 3, 3, 4, 4, 4, 5, 6, 7]).filter(dropWhile((value) => value < 100)).toArray());
// console.log('drop iter empty', iterate([]).filter(dropWhile((value) => value < 5)).toArray());
// console.log('drop array ok', ([1, 2, 3, 3, 4, 4, 4, 5, 6, 7]).filter(dropWhile((value) => value < 5)));
// console.log('drop array all', ([1, 2, 3, 3, 4, 4, 4, 5, 6, 7]).filter(dropWhile((value) => value < 0)));
// console.log('drop array none', ([1, 2, 3, 3, 4, 4, 4, 5, 6, 7]).filter(dropWhile((value) => value < 100)));
// console.log('drop array empty', ([]).filter(dropWhile((value) => value < 5)));

/**
 * Filter operator.
 * @param {(previous: T, current: T) => boolean} comparator
 * @returns {(value: T) => (boolean)}
 */
export function distinctUntilChanged<T>(comparator = (previous: T, current: T) => previous === current) {
  let previous: T;
  let initialized = false;
  return function distinctUntilChangedFilter(value: T) {
    if (!initialized) {
      previous = value;
      initialized = true;
      return true;
    }
    if (!comparator(previous, value)) {
      previous = value;
      return true;
    }
    return false;
  }
}

// console.log('distinct iter ok', iterate([1, 1, 2, 2, 3, 3]).filter(distinctUntilChanged()).toArray());
// console.log('distinct iter ok obj', iterate([1, 1, 2, 2, 3, 3].map((v) => ({ v }))).filter(distinctUntilChanged()).toArray());
// console.log('distinct iter ok obj', iterate([1, 1, 2, 2, 3, 3].map((v) => ({ v }))).filter(distinctUntilChanged((a, b) => a.v === b.v)).toArray());
// console.log('distinct iter empty', iterate([]).filter(distinctUntilChanged()).toArray());
// console.log('distinct iter one', iterate([1, 1, 1, 1,1,1,1,1]).filter(distinctUntilChanged()).toArray());
// console.log('distinct array ok', ([1, 1, 2, 2, 3, 3]).filter(distinctUntilChanged()));
// console.log('distinct array ok obj', ([1, 1, 2, 2, 3, 3].map((v) => ({ v }))).filter(distinctUntilChanged()));
// console.log('distinct array ok obj', ([1, 1, 2, 2, 3, 3].map((v) => ({ v }))).filter(distinctUntilChanged((a, b) => a.v === b.v)));
// console.log('distinct array empty', ([]).filter(distinctUntilChanged()));
// console.log('distinct array one', ([1, 1, 1, 1,1,1,1,1]).filter(distinctUntilChanged()));
