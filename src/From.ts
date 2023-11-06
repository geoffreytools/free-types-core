import { Contra, NamedConstraints } from './Type';
import { ArrayLike, Next, IsOptional, Mappable, Union2Tuple, Int } from './utils';

export { From };

type Named = ({ [k: PropertyKey]: string } | undefined)[]

type None = {};

/** Create a new `Type` based upon a Mappable `T`.
 * 
 * Optionally take a tuple `Args` to specify which fields to turn into a parameter and in what order they must be applied. Parameters can be set to be optional. Named parameters are created automatically for object types, they can be renamed.
 * 
 * */

type From<
    T extends Mappable<any>,
    Args extends readonly (keyof T | undefined)[] | Named = never,
> = (
    [Args] extends [never]
    ? (T extends unknown[] ? GetIndices<T> : Union2Tuple<keyof T>) extends infer K
        ? {
            constraints: PseudoTuple<T, K>
            names: None,
            keys: K,
         } : never
    : Args extends Named
    ? {
        constraints: ToConstraints<T, Args>
        names: GetNames<Args>,
        keys: GetKeys<Args>,
    } : {
        constraints: PseudoTuple<T, Args>
        names: Args extends (string | undefined)[] ? GenerateNames<Args> : {},
        keys: Required<Args>,
    }
) extends infer D extends Descriptor ? FromTemplate<{ type: T }, D> : never

type Descriptor = {
    constraints: any, names: any, keys: any
}

interface FromTemplate<T extends { type: any }, D extends Descriptor> {
    [k: number]: unknown
    type: T['type'] extends infer Type ?  unknown[] extends this['arguments'] ? Type : {
        [K in keyof Type]: Value<Type[K], this['arguments'], IndexOf<K, D['keys']>, D['constraints']>
    } : never
    namedConstraints: NamedConstraints<D>;
    names: D['names']
    constraints: D['constraints']
    contra: Contra<D['constraints']>
    arg: any
    arguments: unknown[]
}

type GetIndices<T extends unknown[]> = { [K in keyof T]-?: K }

export type Value<T, This extends ArrayLike, I, Constraints extends ArrayLike> =
    [I] extends [never] ? T
    : IsOptional<Constraints, I> extends true
    ? This[I & number] extends undefined ? T : This[I & number]
    : This[I & number]

export type IndexOf<T, Ts extends ArrayLike, L = Required<Ts>['length'], I = 0> =
    I extends L ? never
    : [T] extends [`${Ts[I & number]}`] ? I
    : IndexOf<T, Ts, L, Next<I>>;

type PseudoTuple<T, Keys> = {
    [K in keyof Keys]: Exclude<T[Keys[K] & keyof T], undefined>
}

type ToConstraints<T, Args extends Named> = {
    [K in keyof Args]: T[keyof (Args[K] & {}) & keyof T]
}

type GetKeys<Args extends Named, R = Required<Args>> = {
    [K in keyof R]: keyof R[K]
}

type GetNames<Args extends Named, T extends Required<Named> = Required<Args>> = unknown & {
    [K in keyof T as T[K & `${number}`][keyof T[K]]]: Int<K>
}

type GenerateNames<Args extends (string|undefined)[]> = unknown & {
    [K in Exclude<keyof Args, keyof []> as Args[K] & string]: Int<K>
}