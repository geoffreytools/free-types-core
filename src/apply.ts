import { Type } from './Type';
import { ArrayKeys, Next } from './utils';

type NamedType = {
    type: unknown,
    constraints: { [k: number]: unknown, length: number },
    labels: Labels
};
type Labels = { [k: string]: number };

export { apply, applyNamed, $apply, Generic }

/** Apply a free type with its complete arguments list and evaluate the type */
type apply<$T extends Type, Args extends $T['constraints'] = []> =
    applyPositional<$T, Args>

/** Apply a free type with its complete arguments struct and evaluate the type */
type applyNamed<
    $T extends NamedType,
    Args extends CheckNamed<$Model>,
    $Model extends NamedType = $T
> = applyPositional<$T, ToPositional<$T, Args>>

type RecoverLabels<T extends Labels> = { [K in keyof T as T[K]]: K }

type ToPositional<
    $T extends NamedType,
    Args extends { [k: string]: unknown },
    Labels extends { [k: number]: string } = RecoverLabels<$T['labels']>,
    I extends number = 0,
    R extends unknown[] = []
> = I extends $T['constraints']['length'] ? R
    : ToPositional<$T, Args,  Labels, Next<I>, [...R, Args[Labels[I]]]>

type CheckNamed<$T extends NamedType> = {
    [K in keyof $T['labels']]: $T['constraints'][$T['labels'][K]]
};

interface $apply<Args extends unknown[] = []> extends Type<[Type]> {
    type: apply<this[0] extends Type ? this[0] : Type, Args>
}

/** Apply a free type `$T` with its type constraints. */
type Generic<$T extends Type> = _apply<$T, $T['constraints']>;

type applyPositional<
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