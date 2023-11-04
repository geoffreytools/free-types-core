import { Type } from './Type';
import { ArrayLike, ArrayKeys, Indexable, Next } from './utils';

export { apply, _apply, _applyPositional as applyPositional, $apply, Generic, _Type }

/** A type definition to be used as a type constraint in internal library code to improve performance */
type _Type<I = any, O = unknown> =  {
    type: O,
    constraints: I,
    names: any,
    namedConstraints: any
};

type PositionalType = { type: unknown, constraints: Indexable }

type Names = { [k: string]: number };

/** Apply a free type with all its arguments and evaluate the type */
type apply<
    $T extends _Type,
    Args extends Check = never,
    Check = Args extends ArrayLike ? $T['constraints']: $T['namedConstraints']
> = applyPositional<$T, (
    [Args] extends [never] ? []
    : Args extends ArrayLike
    ? Args
    : Args extends { [k: string]: unknown }
    ? ToPositional<GetLength<$T['constraints']>, Args,  RecoverNames<$T['names']>>
    : []
)>

type GetLength<T> = Extract<T extends ArrayLike ? T['length'] : number, number>

type _applyPositional<
    $T extends PositionalType,
    Args extends $T['constraints'] = []
> = applyPositional<$T, Args>

type ToPositional<
    L extends number,
    Args extends { [k: string]: unknown },
    Names extends { [k: number]: string },
    I extends number = 0,
    R extends any[] = []
> = I extends L ? R
    : ToPositional<L, Args,  Names, Next<I>, [...R, Args[Names[I]]]>;

type RecoverNames<T extends Names> = { [K in keyof T as T[K]]: K };

interface $apply<Args extends ArrayLike = []> extends Type<[_Type]> {
    type: this[0] extends _Type ? _apply<this[0], Args> : unknown
}

/** Apply a free type `$T` with its type constraints. */
type Generic<$T extends _Type> = _apply<$T, $T['constraints']>;

type applyPositional<
    $T extends PositionalType,
    Args extends Indexable,
> = number extends GetLength<$T['constraints']>
    ? _apply<$T, Args>
    : _apply<$T, Take<Args, 0, GetLength<Required<$T['constraints']>>>>;

/** A looser version of `apply` which can be used in internal library code to improve performance */
type _apply<$T extends { type: unknown }, Args extends _Constraints> = 
    ($T & Omit<Args, ArrayKeys> & { arguments: Args })['type'];

type _Constraints = { [k: number]: unknown }

type Take<T extends Indexable, From extends number, To, R extends any[] = []> =
    From extends To ? R : Take<T, Next<From>, To, [...R, T[From]]>;
