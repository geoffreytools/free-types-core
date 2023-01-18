import { Type } from './Type'
import { ToTuple } from './utils'

export {
    $Id as Id,
    $Record as Record,
    $Array as Array,
    $Tuple as Tuple,
    $ReadonlyTuple as ReadonlyTuple,
    $ReadonlyArray as ReadonlyArray,
    $Set as Set,
    $ReadonlySet as ReadonlySet,
    $WeakSet as WeakSet,
    $Map as Map,
    $ReadonlyMap as ReadonlyMap,
    $WeakMap as WeakMap,
    $Function as Function,
    $UnaryFunction as UnaryFunction,
    $Promise as Promise
}

interface $Id extends Type<1> {
    type: this[0]
}

type Key = string | number | symbol;

interface $Record extends Type<[Key, unknown]> {
    type: Record<this[0] & Key, this[1]>
}

interface $Array extends Type<1> {
    type: Array<this[0]>
}

interface $Tuple extends Type {
    type: ToTuple<this['arguments']>;
}

interface $ReadonlyTuple extends Type {
    type: Readonly<ToTuple<this['arguments']>>;
}

interface $ReadonlyArray extends Type<1> {
    type: ReadonlyArray<this[0]>
}

interface $Set extends Type<1> {
    type: Set<this[0]>
}

interface $ReadonlySet extends Type<1> {
    type: ReadonlySet<this[0]>
}

interface $WeakSet extends Type<[object]> {
    type: WeakSet<this[0] extends object ? this[0] : object>
}

interface $Map extends Type<2> {
    type: Map<this[0], this[1]>
}

interface $ReadonlyMap extends Type<2> {
    type: ReadonlyMap<this[0], this[1]>
}

interface $WeakMap extends Type<[object, unknown]> {
    type: WeakMap<this[0] extends object ? this[0] : object, this[1]>
}

interface $Function extends Type<[any[], unknown]> {
    type: (...args: this[0] extends any[] ? this[0] : any[]) => this[1]
}

interface $UnaryFunction extends Type<2> {
    type: (a: unknown extends this[0] ? any : this[0]) => this[1]
}

interface $Promise extends Type<1> {
    type: Promise<this[0]>
}

declare global {
    interface Set<T> {}
    interface ReadonlySet<T> {}
    interface WeakSet<T> {}
    interface Map<K, V> {}
    interface ReadonlyMap<K, V> {}
    interface WeakMap<K, V> {}
}