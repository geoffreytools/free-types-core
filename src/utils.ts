export { Natural, Prev, Next, Subtract }

export { ArrayKeys, Slice, ToTuple, Tuple, Head, Tail, Last, Init }

export { Extends, Eq, And, Not, IsUnknown, IsAny, IsOptional }

// Numbers

type Natural = [0, ..._Next];

type Prev<I extends number> =
    number extends I ? number
    : number & _Prev[I];
    
type _Prev = [never, ...Natural];

type Next<I extends number> =
    number extends I ? number
    : number & _Next[I];

type _Next = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64]

type Subtract<A extends number, B extends number> =
    number extends A ? number : number extends B ? number
    : _Subtract<A, B>

type _Subtract<A extends number, B extends number, _A = Prev<A>, _B = Prev<B>> =
    B extends 0 ? A : [_A] extends [never] ? never : [_B] extends never ? never
    : _Subtract<_A & number, _B & number>;

// Tuples

type ArrayKeys = Exclude<keyof [], never>;

type Slice<
    T extends unknown[],
    From extends number,
    To extends number = Required<T>['length'],
    I extends number = From,
    R extends unknown[] = []
> = number extends To
    ? SliceOpenEndedTuple<T, From>
    : SliceTuple<T, From, To, I, R>;

type SliceOpenEndedTuple<
    T extends unknown[],
    From extends number,
> = From extends 0 ? T
    : T extends [unknown, ...infer R] ? SliceOpenEndedTuple<R, Prev<From>> : never

type SliceTuple<
    T extends unknown[],
    From extends number,
    To extends number = Required<T>['length'],
    I extends number = From,
    R extends unknown[] = []
> = 
    I extends To ? R
    : Slice<T, From, To, Next<I>,
        IsOptional<T, I> extends true
        ? [...R, T[I]?]
        : [...R, T[I]]
    >

type IsOptional<T extends unknown[], I extends number> = [{
    [K in T['length'] as K]: K extends I ? never : unknown
}[I]] extends [never] ? true : false;

type ToTuple<
    T extends readonly unknown[],
    I extends number = 0,
    R extends unknown[] = []
> = any[] extends T ? T[0][]
    : I extends T['length'] ? R
    : ToTuple<T, Next<I>, [...R, T[I]]>;

type Tuple <L extends number, T = unknown, R extends unknown[] = []> =
    number extends L ? T[]
    : L extends R['length'] ? R
    : Tuple<L, T, [T, ...R]>;

type Head<T extends [unknown, ...unknown[]]> = T[0];

type Tail<T extends [unknown, ...unknown[]]> =
    T extends [unknown, ...infer R] ? R : never;

type Last<T extends unknown[]> = T[Prev<T['length']>]

type Init<T extends [unknown, ...unknown[]]> =
    T extends [...infer R, unknown] ? R : never;


// Logic

type IsUnknown<T> = unknown extends T ? IsAny<T> extends false ? true : false : false;

type IsAny<T> = Extends<T | anything, T & anything>

type Extends<A, B> = [A] extends [B] ? true : false;
type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false;

type And<A, B> = Fork<A, Fork<B, B, false>, false>;
type Fork<P, T, F> = P extends false ? F : T;
type Not<T> = Extends<T, false>;

declare const thing: unique symbol;
type anything = typeof thing;
