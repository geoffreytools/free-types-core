import { ArrayKeys, Eq, IsAny } from './utils'
import { Type } from './Type';
import { inferArgs} from './inferArgs';
import { Generic, _apply, _Type } from './apply';
import { TypesMap } from './TypesMap';
import { Tuple, ReadonlyTuple, Array, ReadonlyArray } from './free-types';

type Search = _Type | SearchList;
type SearchList = _Type[] | Record<string, _Type> | Interface;
type Interface = {[k: string]: any} & { [Symbol.toStringTag]?: never }

declare global {
    interface SymbolConstructor {
        readonly toStringTag: unique symbol;
    }
    interface Symbol {
        readonly [Symbol.toStringTag]: string;
    }
    
    var Symbol: SymbolConstructor
}

export { unwrap, Unwrapped, Search }

/** Decompose a type into its constituents */

type unwrap<T, From extends Search = TypesMap> =
    IsAny<T> extends true ? Any
    : (T extends readonly unknown[] ?
        From extends _Type | _Type[] ? null : unwrapLists<T> : null
    ) extends infer R extends Unwrapped ? R
    : _unwrap<T, From extends _Type ? [From] : From>

type unwrapLists<T extends readonly unknown[]> =
    T extends unknown[]
        ? any[] extends T
            ? Unwrapped<'Array', Array, [T[0]]>
            : Unwrapped<'Tuple', Tuple, T>
    : readonly any[] extends T
    ? Unwrapped<'ReadonlyArray', ReadonlyArray, [T[0]]>
    : Unwrapped<'ReadonlyTuple', ReadonlyTuple, Mutable<T>>

type Mutable<T> = { -readonly[K in keyof T]: T[K] }; 

type _unwrap<T, From> = {
    [K in keyof From as K extends ArrayKeys ? never : K extends string ? K : never]:
        From[K] extends _Type
        ? T extends Generic<From[K]>
            ? Disambiguate<T, From[K], inferArgs<T, From[K]>, K & string>
            : never
        : never
} extends infer R ? R[keyof R] : never;


type Disambiguate<T, $T extends _Type, Args extends unknown[], K extends string> =
    Eq<T, _apply<$T, Args>> extends true
    ? Unwrapped<K, $T, Args>
    : never

/** The result of unwrapping a type with `unwrap` */
type Unwrapped<
    URI extends string = string,
    T extends _Type = Type,
    A = unknown[]
> = { URI: URI, type: T, args: A };

interface $Any extends Type { type: any }
type Any = Unwrapped<'any', $Any, any>;