import { ArrayKeys, Eq } from './utils'
import { Type } from './Type';
import { inferArgs} from './inferArgs';
import { Generic, apply } from './apply';
import { TypesMap } from './TypesMap';
import { Tuple, ReadonlyTuple, Array, ReadonlyArray } from './free-types';

type Search = Type | SearchList;
type SearchList = Type[] | Record<string, Type> | Interface;
type Interface = {[k: string]: any} & { [Symbol.toStringTag]?: never }

export { unwrap, Unwrapped, Search }

/** Decompose a type into its constituents */

type unwrap<T, From extends Search = TypesMap> =
    unknown extends T ? never
    : T extends readonly unknown[] ? unwrapLists<T>
    : _unwrap<T, From extends Type ? [From] : From>

type unwrapLists<T> =
    T extends unknown[]
        ? T extends [unknown, ...unknown[]]
            ? Unwrapped<'Tuple', Tuple, T>
            : Unwrapped<'Array', Array, [T[0]]>
    : T extends readonly unknown[]
        ? T extends readonly [unknown, ...unknown[]]
            ? Unwrapped<'ReadonlyTuple', ReadonlyTuple, Mutable<T>>
            : Unwrapped<'ReadonlyArray', ReadonlyArray, [T[0]]>
    : never

type Mutable<T> = {
    -readonly[K in keyof T]: K extends ArrayKeys ? T[K] : T[K]
}; 

type _unwrap<T, From extends SearchList, R = {
    [K in keyof From as K extends ArrayKeys ? never : K extends string ? K : never]:
        From[K] extends Type ? Branch<T, From[K], K>[
            T extends Generic<From[K]> ? 'match' : 'miss'
        ] : never
}> = R[keyof R];

interface Branch<T, $T extends Type, K> {
    match: Disambiguate<T, $T, inferArgs<T, $T>, K & string>
    miss: never
}

type Disambiguate<T, $T extends Type, Args extends unknown[], K extends string> =
    Eq<T, apply<$T, Args>> extends true
    ? Unwrapped<K, $T, Args>
    : never

/** The result of unwrapping a type with `unwrap` */
type Unwrapped<
    URI extends string = string,
    T extends Type = Type,
    A = unknown[]
> = { URI: URI, type: T, args: A };