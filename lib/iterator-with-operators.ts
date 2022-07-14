export class IteratorWithOperators<T> implements IterableIterator<T> {
  protected _done = false;
  /**
   * @param source Iterator to wrap
   */
  constructor(protected source: Iterator<T>) {
  }

  get isDone() {
    return this._done;
  }

  /**
   * Returns a `{ value, done }` object that adheres to the Iterator protocol
   */
  next(): IteratorResult<T> {
    try {
      const result = this.source.next()
      if (result.done) {
        this._done = result.done;
      }
      return result;
    } catch (err) {
      this._done = true;
      throw err;
    }
  }

  /**
   * The presence of this method makes the Iterator itself Iterable.
   * This makes it possible to pass it to `for of` and Iterable-accepting functions like `Array.from()`
   */
  [Symbol.iterator](): this {
    return this
  }
}
