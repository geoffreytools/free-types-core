import { ArrayKeys, Eq, IsKnown } from './utils'
import { Type } from './Type';
import { Generic, apply } from './apply';
import { A, B, Checked } from './helpers';
import { TypesMap } from './';

type Search = Type | SearchList;
type SearchList = Type[] | Record<string, Type> | Interface;
type Interface = {[k: string]: any} & { [Symbol.toStringTag]?: never }

export { unwrap, $unwrap, Unwrapped, Replace }

/** Decompose a type into its constituents */

interface $unwrap extends Type<[unknown, Search]> {
    type: unwrap<A<this>, Checked<B, this>>
}

/** Decompose a type into its constituents */

type unwrap<T, From extends Search = TypesMap> =
    IsTuple<T> extends true
    ? T extends unknown[] ? Unwrapped<'Tuple', TypesMap['Tuple'], T> : never
    : IsKnown<T> extends true
    ? _unwrap<T, From extends Type ? [From] : From>
    : never;

type IsTuple<A> =
    A extends unknown[]
    ? number extends A['length'] ? false : true
    : false;

type _unwrap<T, From extends SearchList, R = {
    [K in keyof From as K extends ArrayKeys ? never : K extends string ? K : never]: From[K] extends Type ?
        K extends string ? Branch<T, From[K], K>[T extends Generic<From[K]> ? 'disambiguate' : 'stop']
        : never : never
}> = R[keyof R];

interface Branch<T, $T extends Type, K extends string> {
    disambiguate: Disambiguate<T, $T, InferArgs<T, $T>, K>
    stop: never
}

type InferArgs<T, F extends Type> =
    T extends apply<F, [infer A]>
    ? [A]
    : T extends apply<F, [infer A, infer B]>
    ? [A, B]
    : T extends apply<F, [infer A, infer B, infer C]>
    ? [A, B, C]
    : T extends apply<F, [infer A, infer B, infer C, infer D]>
    ? [A, B, C, D]
    : T extends apply<F, [infer A, infer B, infer C, infer D, infer E]>
    ? [A, B, C, D, E]
    : never;

type Disambiguate<T, $T extends Type, Args extends unknown[], K extends string> =
    Eq<T, apply<$T, Args>> extends true
    ? Unwrapped<K, $T, Args>
    : never

/** The result of unwrapping a type with `unwrap` */
type Unwrapped<
    URI extends string = string,
    T extends Type = Type,
    A = T['constraints']
> = { URI: URI, type: T, args: A };

/** Replace the inner value of a type with compatible arguments.
 * 
 *  Can be used to constrain the inner value of a type
 */
type Replace<
    T,
    Args extends U['type']['constraints'],
    From extends Search = TypesMap,
    U extends Unwrapped = unwrap<T, From>
> = apply<U['type'], Args>