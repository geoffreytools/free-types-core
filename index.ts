export * from './apply';
export * from './partial';
export * from './Type';
export * from './helpers';
export * from './decompose';
export * from './hkt';
import * as free from './free-types';

export { ToTuple, Slice, Head, Tail, Last, Init, IsUnknown, IsAny, IsUnion } from './utils';
export { free, TypesMap };

/** A mapping of everyday free types which you can extend with module augmentation. */
interface TypesMap {
    Record: free.Record,
    Array: free.Array,
    Tuple: free.Tuple,
    ReadonlyTuple: free.ReadonlyTuple,
    ReadonlyArray: free.ReadonlyArray,
    Set: free.Set,
    ReadonlySet: free.ReadonlySet,
    WeakSet: free.WeakSet,
    Map: free.Map,
    ReadonlyMap: free.ReadonlyMap,
    WeakMap: free.WeakMap,
    Function: free.Function,
    // UnaryFunction is missing on purpose
    Promise: free.Promise
}