import { forEach } from './lib/operators/for-each';
import { map as mapOperator } from './lib/operators/map';
import { filter as filterOperator } from './lib/operators/filter';
import { pipe } from './lib/operators/pipe';
import { takeWhile as takeWhileOperator } from './lib/operators/take-while';
import { distinctUntilChanged, enumerate, firstOrDefault as firstOrDefaultOperator, range, scan } from './iter';
import { PipableOperator, pipify } from './lib/pipify';

const takeWhile = pipify(takeWhileOperator);
const map = pipify(mapOperator);
const filter = pipify(filterOperator);

forEach(pipe(
  [1,2,3,4,5,6,6,6,6,7,7,7,7,8,9,10],
  takeWhile((v) => v < 9),
  filter((v) => v % 2 === 0),
  map(String),
  map(enumerate()),
  filter(distinctUntilChanged((pair, other) => pair[1] === other[1])),
), (value) => {
  console.log(value);
});

pipify(range); // <-- shouldn't compile.

const f: PipableOperator<number, [() => false], string> = firstOrDefaultOperator; // <-- shouldn't compile.
const firstOrDefault = pipify(firstOrDefaultOperator); // <-- shouldn't compile, but it compiles and breaks all pipelines where used, see below.
forEach(pipe(
  [1,2,3,4,5],
  takeWhile((v) => (v as number) < 4),
  firstOrDefault(() => true, () => 42),
), console.log);
