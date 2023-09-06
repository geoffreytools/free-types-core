import { Tuple, ToTuple, Int, Natural } from './utils';

export { TypeConstructor as Type, Arg };

/** Extend `Type<Input?, Output?>` with an interface to produce a free type, or use it as a type constraint.
*/
type TypeConstructor<I extends Input = readonly unknown[], Output = unknown> =
    Normalise<I, Output> extends infer D extends Descriptor 
    ? Type<{[K in keyof D]: D[K]}>
    : never;

type Normalise<I extends Input, Output> = I extends I ? {
    type: Output
    constraints: Constraints<I>
    names: I extends Detailed
        ? { [K in keyof I]: GetIndex<I[K]> }
        : readonly unknown[] extends I ? {} : { '__' : never },
} : never;

type GetIndex<T> = T extends [infer N extends number, any?] ? N : T

type Descriptor = { type: unknown } & Desc

type Desc = {
    constraints: readonly unknown[],
    names: { [k: string]: number }
}

type Input = number | readonly unknown[] | PseudoTuple | Detailed;
type PseudoTuple = { [K in Natural[number]]: unknown };
type Detailed = { [k: string]: [index: number, constraint?: unknown] | number };

interface Type<T extends Descriptor> {
    [k: number]: unknown
    type: T['type'];
    constraints: T['constraints'];
    namedConstraints: {
        [K in keyof T['names']]: this['constraints'][T['names'][K]]
    };
    arguments: unknown[];
    names: Omit<T['names'], '__'>
    arg: Arg<this, T>
}

type Arg<
    This extends {[k: number]: unknown },
    T extends Desc
> = T extends T ? {
    [K in RequiredProps<T>]: ArgVal<This, T['names'], T['constraints'], K>
} & {
    [K in OptionalProps<T>]? : ArgVal<This, T['names'], T['constraints'], K>
} : never

type ArgVal<
    This extends {[k: number]: unknown },
    Names extends { [k: string]: number },
    Constraints extends readonly unknown[],
    K
> = K extends `${number}` | number
    ? This[Int<K>] extends infer R
        extends Constraints[Int<K>]
            ? R : Constraints[Int<K>]
    : K extends string
    ? This[Names[K]] extends infer R
        extends Constraints[Names[K]]
            ? R : Constraints[Names[K]]
    : never

type RequiredProps<T extends Desc> =
    | Exclude<Required<T['names']>, '__'>
    | Required<T['constraints']>

type OptionalProps<T extends Desc> =
    | Exclude<Optional<T['names']>, '__'>
    | Optional<T['constraints']>

type Optional<T> = keyof { [K in keyof T as OptionalPredicate<T, K>]? : never }

type OptionalPredicate<T, K extends keyof T> =
    {} extends { [P in K]: T[P] } ? number extends K ? never : K extends number ? K : K extends keyof [] ? never : Norm<K> : never;

type Required<T> = keyof { [K in keyof T as RequiredPredicate<T, K>] : never }

type RequiredPredicate<T, K extends keyof T> =
    {} extends { [P in K]: T[P] } ? never : K extends number ? K : K extends keyof [] ? never : Norm<K>;

type Norm<T> = T extends `${number}` ? Int<T> : T;

type Slots<T> = T extends Precomputable
    ? PrecomputedSlots[T & Precomputable]
    : Tuple<T extends readonly unknown[] ? T['length'] : T extends number ? T : number>;

type Constraints<T> =
    number extends T ? unknown[]
    : unknown[] extends T ? unknown[]
    : readonly unknown[] extends T ? readonly unknown[]
    : T extends readonly unknown[] ? T
    : T extends number ? Slots<T>
    : T extends Detailed ? ToTuple<{
        [K in keyof T as GetIndex<T[K]>]: T[K] extends [any, infer A] ? A : unknown
    }>
    : T extends PseudoTuple ? ToTuple<T>
    : unknown[];

type PrecomputedSlots = { [I in Precomputable]: Tuple<Seq10[I]> };
type Precomputable = Seq10[number];
type Seq10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];