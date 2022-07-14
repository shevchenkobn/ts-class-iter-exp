import { tryCatch } from './iter';
import { iterate, IteratorWithOperators } from './lib';
import { throwWhenDone } from './lib/operators/throw-when.done';

const iterators = [
  iterate(throwWhenDone([1, 2, 3])),
  iterate(throwWhenDone([1, 2, 3], () => { throw new Error('My error.') })),
  iterate([1, 2, 3]),
  iterate([1, 2, 3], () => { throw new Error('My error.') }),
];
for (let i = 0; i < iterators.length; i += 1) {
  const iterator = iterators[i]!;
  console.log(i + ' done', iterator.isDone);
  console.log(i + ' iterated', Array.from(iterator));
  console.log(i + ' done after', iterator.isDone);
  tryCatch(i + ' iterated done', () => Array.from(iterator));
  console.log(i + ' done after 2', iterator.isDone);
  tryCatch(i + ' iterated done twice', () => Array.from(iterator));
  console.log(i + ' done after 3', iterator.isDone);
}
