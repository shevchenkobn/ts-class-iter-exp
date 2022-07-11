export type PipeOperator<In, Out = In> = (iterator: Iterator<In>) => Iterator<Out>;

export type PipableOperator<In, Args extends  any[], Out> = (collection: Iterator<In>, ...args: Args) => Iterator<Out>;
export type PipifiedOperator<In, Args extends  any[], Out> = (...args: Args) => PipeOperator<In, Out>;
export type Pipify<Op extends PipableOperator<any, any, any>> = Op extends PipableOperator<infer In, infer Args, infer Out>
  ? PipifiedOperator<In, Args, Out>
  : never;

export function pipify<In, Args extends any[], Out>(operator: PipableOperator<In, Args, Out>): Pipify<PipableOperator<In, Args, Out>> {
// export function pipify<In, Args extends  any[], Out>(operator: PipableOperator<In, Args, Out>): PipifiedOperator<In, Args, Out> {
  const pipifiedOperator = function pipifiedOperator(...args: Args) {
    const pipeOperator = function pipedOperator(iterator: Iterator<In>) {
      return operator(iterator, ...args);
    };
    Object.defineProperty(pipeOperator, 'name', {
      value: operator.name + 'Piped',
    });
    return pipeOperator;
  };
  Object.defineProperty(pipifiedOperator, 'name', {
    value: operator.name + 'Pipified',
  });
  return pipifiedOperator;
}
// let takeWhilePipified = pipify(takeWhile);
// const takeWhileLess5 = takeWhilePipified((value: number) => value < 5);
// const firstOrDefaultPipified = pipify(firstOrDefault);
// // function firstOrDefaultPipified2<T>(predicate?: (value: T) => boolean): PipeOperator<T, T | undefined>;
// // function firstOrDefaultPipified2<T>(predicate: (value: T) => boolean, defaultValueGetter: () => T | never): PipeOperator<T>;
// // function firstOrDefaultPipified2<T>(predicate: (value: T) => boolean = () => true, defaultValueGetter: () => T | undefined = () => undefined): PipeOperator<T, T | undefined> {
// //   return function firstOrDefaultPiped(iterator) {
// //     return firstOrDefault(iterator, predicate, defaultValueGetter);
// //   }
// // }
// console.log(firstOrDefaultPipified(() => true, () => false)([1,3,4][Symbol.iterator]()))
// console.log(firstOrDefault([1,3,4]))
