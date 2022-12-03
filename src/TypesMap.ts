import * as free from './free-types';

/** A mapping of everyday free types which you can extend with module augmentation. */
export interface TypesMap {
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