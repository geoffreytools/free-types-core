import { Type } from './Type';
import { ArrayKeys, Next } from './utils';

export { apply, $apply, Generic }

/** Apply a free type with all its arguments and evaluate the type */
type apply<$T extends Type, Args extends $T['constraints'] = []> =
    applyUnsafe<$T, Args>;

interface $apply<Args extends unknown[] = []> extends Type<[Type]> {
    type: apply<this[0] extends Type ? this[0] : Type, Args>
}

/** Apply a free type `$T` with its type constraints. */
type Generic<$T extends Type> = _apply<$T, $T['constraints']>;

type applyUnsafe<
    $T extends { type: unknown, constraints: {length: number }},
    Args extends unknown[],
> = number extends $T['constraints']['length']
    ? _apply<$T, Args>
    : _apply<$T, Take<Args, Required<$T['constraints']>['length']>>;

type _apply<T extends { type: unknown }, Args> = 
    (T & Omit<Args, ArrayKeys> & { arguments: Args })['type'];

type Take<
    T extends unknown[],
    To extends number,
    I extends number = 0,
    R extends unknown[] = [],
> = I extends To ? R : Take<T, To, Next<I>, [...R, T[I]]>