export { Natural, IsNatural, Prev, Next, Add, Subtract }

export { ArrayKeys, Head, Tail, Init, Last, Slice, ToTuple, Tuple }

export { Compute }

export { Eq, IsKnown, Fork, IsUnknown, IsAny, Not, Or, Extends, And, Assert, IsUnion, LastUnionMember, Union2Tuple }

// Numbers

type Natural = [...NaturalSequence<64>, 64];

type IsNatural<T> = T extends _IsNatural ? true : false;
type _IsNatural = Natural[number];

type NaturalSequence<Limit extends number, R extends number[] = []> =
    number extends Limit ? number[]
    : R['length'] extends Limit ? R
    : NaturalSequence<Limit, [...R, R['length']]>;

type Prev<I extends number> =
    number extends I ? number
    : number & _Prev[I];
    
type _Prev = [never, ...Natural];

type Next<I extends number> =
    number extends I ? number
    : number & _Next[I];

type _Next = Tail<Natural>

type Add<A extends number, B extends number> =
    number extends A ? number : number extends B ? number
    : _Add<A, B>

type _Add<A extends number, B extends number, _A = Next<A>, _B = Prev<B>> =
    B extends 0 ? A : [_A] extends [never] ? never : [_B] extends never ? never
    : _Add<_A & number, _B & number> 

type Subtract<A extends number, B extends number> =
    number extends A ? number : number extends B ? number
    : _Subtract<A, B>

type _Subtract<A extends number, B extends number, _A = Prev<A>, _B = Prev<B>> =
    B extends 0 ? A : [_A] extends [never] ? never : [_B] extends never ? never
    : _Subtract<_A & number, _B & number>;

// Tuples

type ArrayKeys = Exclude<keyof [], never>;

type Head<T extends [unknown, ...unknown[]]> = T[0];

type Tail<T extends [unknown, ...unknown[]]> =
    T extends [unknown, ...infer R] ? R : never;

type Last<T extends unknown[]> = T[Prev<T['length']>]

type Init<T extends [unknown, ...unknown[]]> =
    T extends [...infer R, unknown] ? R : never;

type Slice<
    T extends unknown[],
    From extends number,
    To extends number = T['length'],
    I extends number = From,
    R extends unknown[]=[],
> =
    I extends To ? R
    : Slice<T, From, To, Next<I>, [...R, T[I]]>;

type ToTuple<
    T extends unknown[],
    I extends number = 0,
    R extends unknown[] = []
> = any[] extends T ? T[0][]
    : I extends T['length'] ? R
    : ToTuple<T, Next<I>, [...R, T[I]]>;

type Tuple <L extends number, T = unknown, R extends unknown[] = []> =
    number extends L ? T[]
    : L extends R['length'] ? R
    : Tuple<L, T, [T, ...R]>;

// display

type Compute<T> = { [K in keyof T]: T[K] } & unknown

// Logic

type Assert<T, U> = T extends U ? T : never;

type IsKnown<T> = Not<IsUnknown<T>>;
type IsUnknown<T> = And<Extends<unknown, T>, Not<IsAny<T>>>;
type IsAny<T> = Extends<T | anything, T & anything>

type Extends<A, B> = [A] extends [B] ? true : false;
type Eq<A, B> = And<Extends<A, B>, Extends<B, A>>;
type Fork<P, T, F> = P extends false ? F : T;
type And<A, B> = Fork<A, Fork<B, B, false>, false>;
type Or<A, B> = Fork<A, A, Fork<B, B, false>>;
type Not<T> = [T] extends [false] ? true : false

declare const thing: unique symbol;
type anything = typeof thing;

type Union2Intersection<U> =
    (U extends any ? (k: U) => void : never) extends
        ((k: infer I) => void) ? I : never

type LastUnionMember<T> =
    Union2Intersection<T extends any ? () => T : never> extends
        () => (infer R) ? R : never
    
type Union2Tuple<U, Last = LastUnionMember<U>> =
    [U] extends [never] ? []
    : [...Union2Tuple<Exclude<U, Last>>, Last];

type IsUnion<T> = [T] extends [LastUnionMember<T>] ? false : true