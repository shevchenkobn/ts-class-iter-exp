export class IteratorWithOperators<T> implements IterableIterator<T> {
  /**
   * @param source Iterator to wrap
   */
  constructor(private source: Iterator<T>) {
  }

  /**
   * Returns a `{ value, done }` object that adheres to the Iterator protocol
   */
  next(): IteratorResult<T> {
    return this.source.next()
  }

  /**
   * The presence of this method makes the Iterator itself Iterable.
   * This makes it possible to pass it to `for of` and Iterable-accepting functions like `Array.from()`
   */
  [Symbol.iterator](): this {
    return this
  }
}
