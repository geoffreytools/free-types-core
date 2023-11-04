import { Type } from './Type'

type ToTuple<T> = T extends infer I extends unknown[] & unknown[] ? I : never;

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

type $Unary = Type<1>;

type $Binary = Type<2>;

type $Variadic = Type;

interface $Id extends $Unary {
    type: this[0]
}

interface $Record extends Type<[PropertyKey, unknown]> {
    type: Record<this[0] & PropertyKey, this[1]>
}

interface $Array extends $Unary {
    type: Array<this[0]>
}

interface $Tuple extends $Variadic {
    type: ToTuple<this['arguments']>;
}

interface $ReadonlyTuple extends $Variadic {
    type: readonly [...ToTuple<this['arguments']>];
}

interface $ReadonlyArray extends $Unary {
    type: ReadonlyArray<this[0]>
}

interface $Set extends $Unary {
    type: Set<this[0]>
}

interface $ReadonlySet extends $Unary {
    type: ReadonlySet<this[0]>
}

interface $WeakSet extends Type<[object]> {
    type: WeakSet<this[0] extends object ? this[0] : object>
}

interface $Map extends $Binary {
    type: Map<this[0], this[1]>
}

interface $ReadonlyMap extends $Binary {
    type: ReadonlyMap<this[0], this[1]>
}

interface $WeakMap extends Type<[object, unknown]> {
    type: WeakMap<this[0] extends object ? this[0] : object, this[1]>
}

interface $Function extends Type<[any[], unknown]> {
    type: (...args: this[0] extends any[] ? this[0] : any[]) => this[1]
}

interface $UnaryFunction extends $Binary {
    type: (a: unknown extends this[0] ? any : this[0]) => this[1]
}

interface $Promise extends $Unary {
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