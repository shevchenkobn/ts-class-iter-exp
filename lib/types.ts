export type IterableOrIterator<T> = Iterable<T> | Iterator<T>;

interface _DeepIterable<T> extends Iterable<_DeepIterableOrIterator<T>> {
}
interface _DeepIterator<T> extends Iterator<_DeepIterableOrIterator<T>> {
}
type _DeepIterableOrIterator<T> = T | _DeepIterable<T> | _DeepIterator<T>;
export type DeepIterableOrIterator<T> = _DeepIterable<T> | _DeepIterator<T>;
