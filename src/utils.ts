// Numbers

export { Int, Cardinal as Natural, Prev, Next, Subtract }

type Int<T> = T extends `${infer I extends number}` ? I : T & number

type Next<I> = number & _Next[I & number];
interface _Next extends Numeric, __Next {}
type __Next = Omit<Natural, ArrayKeys>

type Prev<I> = number & _Prev[I & number];
interface _Prev extends Numeric, __Prev {}
type __Prev = Omit<[never, ...Cardinal], ArrayKeys>

type Natural = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64];

type Cardinal = [0, ...Natural];

interface Numeric { [k: number]: number }

type Subtract<A extends number, B extends number> =
    number extends A ? number : number extends B ? number
    : _Subtract<A, B>

type _Subtract<A extends number, B extends number, _A = Prev<A>, _B = Prev<B>> =
    B extends 0 ? A : [_A] extends [never] ? never : [_B] extends never ? never
    : _Subtract<_A & number, _B & number>;

// Mappables

export { Mappable, OptionalKeys, ReverseMap }

type Mappable<T = unknown> =
    | { [k: PropertyKey]: T | undefined }
    | readonly (T | undefined)[];

type OptionalKeys<T> = {
    [K in keyof T as
        K extends ArrayKeys
            ? number extends K ? never
            : K extends number ? K
            : never
        : K]-?:
        {} extends { [P in K]: T[P] } ? K : never;
} extends infer U ? U[keyof U] : never;

type ReverseMap<T extends {[k: string]: any}> = { [K in keyof T as T[K]]: K }

// Tuples

export { ArrayLike, Indexable, ArrayKeys, Slice, ToTuple, Tuple, NumericKeys, Head, Tail, Last, Init, IsOptional, GetRest }

type ArrayKeys = Exclude<keyof [], never>;

type ArrayLike = { [k: number]: any, length: any };
type Indexable = { [k: number]: any };

type Slice<
    T extends Indexable,
    From extends number,
    To = T extends ArrayLike ? Required<T>['length'] : number,
    R extends any[] = [],
    Optional = Int<OptionalKeys<T>>
> = number extends To
    ? SliceOpenEnded<T, From>
    : SliceOptional<T, From, To, R, Optional>

type SliceOpenEnded<T extends Indexable, I> =
    I extends 0 ? T
    : T extends [unknown, ...infer R] ?
    SliceOpenEnded<R, Prev<I>>
    : never

type SliceOptional<T extends Indexable, I, To, R extends any[], Optional> =
    I extends To ? R
    : SliceOptional<T, Next<I>, To,
        I extends Optional
        ? [...R, T[I & number]?]
        : [...R, T[I & number]],
        Optional
    >

type IsOptional<T extends { length: any }, I> = (
    T['length'] extends infer L ?
        L extends I ? true : false : never
) extends false ? false : true

type NumericKeys<T> = Int<ExcludeNumber<keyof T>>

type ExcludeNumber<T> = T extends any ? number extends T ? never : T : never;

type ToTuple<
    T extends { [k: number]: unknown, length?: number },
    Keys extends number = NumericKeys<T>,
    Optionals = Int<OptionalKeys<T>>,
    I extends number = 0,
    R extends unknown[] = []
> = [Keys] extends [never] ? R
    : ToTuple<T, Exclude<Keys, I>, Optionals, Next<I>,
    I extends Optionals
        ? [...R, T[I]?]
        : [...R, T[I]]
    >;

type GetRest<T, U extends unknown[]> =
    T extends [...U, ...infer Rest]
    ? Rest : [];

type Tuple <
    L extends number,
    T = unknown,
    R extends any[] = number extends L ? T[] : []
> =  R['length'] extends L ? R : Tuple<L, T, [T, ...R]>;

type Head<T extends readonly unknown[]> = T[0];

type Tail<T extends readonly unknown[]> =
    T extends [unknown, ...infer R] ? R : never;

type Last<T extends readonly unknown[]> = T[Prev<T['length']>]

type Init<T extends readonly unknown[]> =
    T extends [...infer R, unknown] ? R : never;


// Logic

export { Eq, IsUnknown, IsAny, UnknownToAny, PickUnionMember, Union2Tuple }

type IsUnknown<T> = unknown extends T ? IsAny<T> extends false ? true : false : false;

type IsAny<T> = [T | anything] extends [T & anything] ? true : false

type UnknownToAny<T> = unknown extends T ? any : T;

type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;

declare const thing: unique symbol;
type anything = typeof thing;

type PickUnionMember<
    T,
    HOFs = T extends any ? (a: () => T) => void : never,
    Overloads = [HOFs] extends [(a: infer I) => any] ? I : never,
> = Overloads extends () => (infer R) ? R : never;

type Union2Tuple<U, T = PickUnionMember<U>> =
    [U] extends [never] ? []
    : [...Union2Tuple<Exclude<U, T>>, T];