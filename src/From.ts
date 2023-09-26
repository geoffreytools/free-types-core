import { ArrayLike, Next, IsOptional, Mappable, Union2Tuple } from './utils';

export { From };

type Named = {[k: number]: { [k: PropertyKey]: string } }

/** Create a new `Type` based upon a Mappable `T`.
 * 
 * Optionally take a tuple `Args` to specify which fields to turn into a parameter and in what order they must be applied. Parameters cam be named or set to be optional
 * 
 * */

type From<
    T extends Mappable<any>,
    Args extends readonly (Keys | undefined)[] | Named = never,
    Keys extends PropertyKey = keyof T
> = [Args] extends [never]
    ? $From<T, {}, T extends unknown[] ? GetIndices<T> : Union2Tuple<Keys>>
    : Args extends Named
    ? $From<T, GetNames<Args>, ReverseMapTuple<Args>, ToConstraints<T, Args>>
    : $From<T, {}, NormalizeArgs<Args>>


interface $From<
    T,
    Names extends { [k: string]: any },
    Keys extends ArrayLike,
    C extends ArrayLike = PseudoTuple<T, Keys>
> {
    [k: number]: unknown
    type: { [K in keyof T]: SelectValue<
        T[K],
        this['arguments'],
        IndexOf<K, Keys>,
        Keys
    >}
    namedConstraints: { [K in keyof Names]: C[Names[K]] };
    names: Names
    constraints: C
    arguments: unknown[]
}

type GetIndices<T extends unknown[]> = { [K in keyof T]-?: K }

type SelectValue<T, This extends ArrayLike, I, Keys extends ArrayLike> =
    [I] extends [never] ? T
    : This[I & number] extends infer Arg ? ( 
        IsOptional<Keys, I> extends true
        ? Arg extends undefined ? T : Arg
        : Arg
    ) : never

type IndexOf<T, Ts extends ArrayLike, L = Required<Ts>['length'], I = 0> =
    I extends L ? never
    : [T] extends [`${Ts[I & number]}`] ? I
    : IndexOf<T, Ts, L, Next<I>>;

type NormalizeArgs<T> = Extract<{
    [K in keyof T]: T[K] extends number ? `${T[K]}` : T[K]
}, ArrayLike>

type PseudoTuple<T, Keys> = {
    [K in keyof Keys]: Exclude<T[Keys[K] & keyof T], undefined>
}

type ToConstraints<T extends Mappable<any>, Args extends Named> = Extract<{
    [K in keyof Args]: T[keyof Args[K] & keyof T]
}, ArrayLike>

type ReverseMapTuple<Args extends Named> = Extract<{
    [K in keyof Args]: keyof Args[K]
}, ArrayLike>

type GetNames<Args extends Named> = unknown & {
    [K in keyof Args as Args[K & `${number}`][keyof Args[K]]]: K
}
