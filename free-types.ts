import { Type } from './Type'
import { Checked, A, B, At } from './helpers'
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
    type: A<this>
}

type Key = string | number | symbol;

interface $Record extends Type<[Key, unknown]> {
    type: Record<A<this>, B<this>>
}

interface $Array extends Type<1> {
    type: Array<A<this>>
}

interface $Tuple extends Type {
    type: ToTuple<this['arguments']>;
}

interface $ReadonlyTuple extends Type {
    type: Readonly<ToTuple<this['arguments']>>;
}

interface $ReadonlyArray extends Type<1> {
    type: ReadonlyArray<A<this>>
}

interface $Set extends Type<1> {
    type: Set<A<this>>
}

interface $ReadonlySet extends Type<1> {
    type: ReadonlySet<A<this>>
}

interface $WeakSet extends Type<[object]> {
    type: WeakSet<Checked<A, this>>
}

interface $Map extends Type<2> {
    type: Map<A<this>, B<this>>
}

interface $ReadonlyMap extends Type<2> {
    type: ReadonlyMap<A<this>, B<this>>
}

interface $WeakMap extends Type<[object, unknown]> {
    type: WeakMap<Checked<A, this>, B<this>>
}

interface $Function extends Type<[any[], unknown]> {
    type: (...args: Checked<A, this>) => B<this>
}

interface $UnaryFunction extends Type<2> {
    type: (a: At<A, this, any>) => B<this>
}

interface $Promise extends Type<1> {
    type: Promise<A<this>>
}