import { Type } from './Type';
import { ArrayKeys, Next } from './utils';

export { apply, $apply, Generic }

/** Apply a free type with all its arguments and evaluate the type */
type apply<
    $T extends Type,
    Args extends Check = never,
    Check = Args extends readonly unknown[] ? $T['constraints' ]: $T['namedConstraints']
> = (
        [Args] extends [never] ? []
        : Args extends readonly unknown[]
        ? Args
        : Args extends { [k: string]: unknown }
        ? ToPositional<$T, Args>
        : []
    ) extends infer A extends readonly unknown[]
    ? applyPositional<$T, A>
    : never;

type ToPositional<
    $T extends NamedType,
    Args extends { [k: string]: unknown },
    Names extends { [k: number]: string } = RecoverNames<$T['names']>,
    I extends number = 0,
    R extends unknown[] = []
> = I extends $T['constraints']['length'] ? R
    : ToPositional<$T, Args,  Names, Next<I>, [...R, Args[Names[I]]]>;

type RecoverNames<T extends Names> = { [K in keyof T as T[K]]: K };

type NamedType = {
    type: unknown,
    constraints: { [k: number]: unknown, length: number },
    names: Names
};

type Names = { [k: string]: number };

interface $apply<Args extends unknown[] = []> extends Type<[Type]> {
    type: apply<this[0] extends Type ? this[0] : Type, Args>
}

/** Apply a free type `$T` with its type constraints. */
type Generic<$T extends Type> = _apply<$T, $T['constraints']>;

type applyPositional<
    $T extends { type: unknown, constraints: {length: number }},
    Args extends readonly unknown[],
> = number extends $T['constraints']['length']
    ? _apply<$T, Args>
    : _apply<$T, Take<Args, Required<$T['constraints']>['length']>>;

type _apply<T extends { type: unknown }, Args> = 
    (T & Omit<Args, ArrayKeys> & { arguments: Args })['type'];

type Take<
    T extends readonly unknown[],
    To extends number,
    I extends number = 0,
    R extends unknown[] = [],
> = I extends To ? R : Take<T, To, Next<I>, [...R, T[I]]>;