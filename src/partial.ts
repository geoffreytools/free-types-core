import { Arg, Type, NamedConstraints, Contra } from './Type';
import { _apply, _Type } from './apply';
import { ArrayKeys, ArrayLike, Int, Next, Slice, Subtract, Tuple } from './utils';

export { partial, partialRight, PartialRight, $partial }
export { PartialType } // should not be used but can't be private

/** Return a new type based upon `$T`, with `Args` already applied, expecting the constraints arguments */
type partial <
    $T extends _Type,
    Args extends Partial<$Model['constraints']>,
    $Model extends _Type = $T
> = $T extends $Model ? Args extends unknown[]
    ? _partial<$T, Args>
    : never : never

/** A free version of `partial` */
interface $partial<$T extends _Type> extends Type<1> {
    type: _partial<$T, [this['arguments'][0]]>
}

type _partial <
    $T extends _Type, Args extends ArrayLike,
    From extends number = Args['length'],
    To = Required<$T['constraints']>['length'],
> = PartialType<{
    type: $T['type']
    constraints: Slice<$T['constraints'], From, To>
    names: FilterNamesLeft<$T['names'], Args>
    applied: Args,
    direction: 'left',
}, $T>;

type FilterNamesLeft<T, Args extends ArrayLike> = unknown & {
    [K in keyof T as T[K] extends Int<Exclude<keyof Args, ArrayKeys>> ? never : K]:
        Subtract<T[K] & number, Args['length']>
}

/** Return a new type based upon `$T`, with `Args` already applied to the rightmost parameters of `$T`, and expecting the remaining arguments */
type partialRight<
    $T extends _Type,
    Args extends PartialRight<$Model['constraints']>,
    $Model extends _Type = $T,
> = $T extends $Model ? _partialRight<$T, Args, Subtract<Required<$T['constraints']>['length'], Args['length']>> : never

type _partialRight<
    $T extends _Type,
    Args extends ArrayLike,
    To
> = Slice<$T['constraints'], 0, To> extends infer Constraints
    ? PartialType<{
        type: $T['type']
        constraints: Constraints,
        names: FilterNamesRight<$T['names'], Constraints>
        applied: Args,
        direction: 'right'
    }, $T> 
    : never

type FilterNamesRight<T, Args> = unknown & {
    [K in keyof T as T[K] extends Int<Exclude<keyof Args, ArrayKeys>> ? K : never]:
        T[K]
}

type PartialRight<T extends unknown[], R = never> =
    T extends [unknown, ...(infer Rest)]
    ? PartialRight<Rest, T | R>
    : [] | R

type Descriptor = {
    applied: any,
    direction: any
    constraints: any,
    names: any
}

interface PartialType<
    D extends Descriptor,
    $T extends _Type
> {
    [k: number]: unknown
    type: _apply<$T, D['direction'] extends 'left'
        ? [...D['applied'], ...Complement<this['arguments'], D['constraints']>]
        : [...Complement<this['arguments'], D['constraints']>, ...D['applied']]>
    names: D['names']
    namedConstraints: NamedConstraints<{
        names: D['names'],
        constraints: D['constraints']
    }>;
    arg: Arg<this>
    constraints: D['constraints']
    contra: Contra<D['constraints']>
    arguments: unknown[]
}

type Complement<Args extends unknown[], Constraints extends unknown[]> =
    unknown[] extends Args ? Tuple<Constraints['length']>
    : _Complement<
        Constraints['length'],
        Args['length'],
        Args extends unknown[] & infer I extends unknown[] ? I : never
    >

type _Complement<L, I, R extends unknown[]> =
    I extends L ? R : _Complement<L, Next<I>, [...R, unknown]>