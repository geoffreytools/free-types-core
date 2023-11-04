import { Tuple, ToTuple, Int, Slice, ArrayLike, ArrayKeys, OptionalKeys, IsAny, NumericKeys } from './utils';

export { Type, Input, Arg, NamedConstraints, Contra };


/** Extend `Type<Input?, Output?>` with an interface to produce a free type, or use it as a type constraint.
*/
type Type<
    In extends Input = any,
    Out = unknown,
> = CreateType<{
    type: Out
},{
    constraints: Constraints<In>,
    names: In extends Detailed
        ? { [K in Exclude<keyof In, symbol>]: GetIndex<In[K]> }
        : None
}>

type None = {}

type Descriptor = { constraints: any, names: any };

type Input = 
    | number
    | readonly unknown[]
    | PseudoTuple
    | Detailed;

type PseudoTuple = { [k: number]: any, length?: number };

type Detailed = {
    [k: string]: [index: number, constraint?: unknown] | number
    [k: number]: never
};

interface CreateType<Out extends { type: any }, T extends Descriptor> {
    [k: number]: unknown
    type: Out['type'];
    constraints: T['constraints'];
    contra: Contra<T['constraints']>
    namedConstraints: NamedConstraints<T>; // necessary for type checking in higher order types
    arg: Arg<this>
    arguments: unknown[];
    names: T['names']
}

type Contra<T extends Variadic> =
    any[] extends T
        ? IsAny<T[number]> extends true
            ? (constraints: any) => void
            : (constraints: {[k: number]: T[number]}) => void
    : NumericKeys<T> extends infer Keys extends number ? Int<OptionalKeys<T>> extends infer O extends number ? (constraints: unknown & {
        [K in Keys as K extends O ? never : K]: T[K]
    } & {
        [K in Keys as K extends O ? K : never]?: T[K]
    }) => void : never : never;


type NamedConstraints<
    T extends { constraints: any, names: any },
    O = Int<OptionalKeys<T['constraints']>>
> = {
    [K in keyof T['names'] as T['names'][K] extends O ? never : K]:
        T['constraints'][T['names'][K]]
} & {
    [K in keyof T['names'] as T['names'][K] extends O ? K : never]?:
        T['constraints'][T['names'][K]]
}

type _Type = {
    [k: number]: unknown,
    constraints: ArrayLike,
    names: { [k: string]: number }
}

type Arg<
    This extends _Type,
    Args = This['names'] & This['constraints'],
    O extends PropertyKey = FindOptionalKeys<This['constraints'], This['names']>,
    R extends PropertyKey = Exclude<Norm<Exclude<keyof Args, ArrayKeys>>, O>
> = & { [K in Norm<R>]: ArgVal<This, K> }
    & { [K in Norm<O>]? : ArgVal<This, K> }

type FindOptionalKeys<
    Constraints,
    Names, 
    O = Int<OptionalKeys<Constraints>>
> = O | (
    keyof {[K in keyof Names as Names[K] extends O ? K : never]: never}
);

type ArgVal<This extends _Type, K> =
    K extends `${number}` | number
    ? Int<K> extends infer Key extends number
        ? GetValue<This, Key>
        : never
    : K extends string
    ? GetValue<This, This['names'][K]>
    : never

type GetValue<This extends _Type, I extends number> =
This['constraints'][I] extends infer Constraint ?
    This[I] extends Constraint ? This[I]
    : Constraint & This[I]
    //           ---------
    // necessary for staticland HKT
: never

type Norm<T> = T extends `${number}` ? Int<T> : T;

type Unconstrained = { [k: number]: any }
type Variadic = { [k: number]: unknown }

type Constraints<T> =
    IsAny<T> extends true ? Unconstrained
    : unknown[] extends T
        ? IsAny<Extract<T, unknown[]>[number]> extends true
            ? Unconstrained
            : Variadic
    : readonly unknown[] extends T ? Variadic
    : T extends readonly unknown[] ? T
    : T extends number ? number extends T ? Variadic : Tuple<T, any>
    : T extends Detailed ? DetailedToConstraints<T>
    : T extends PseudoTuple
        ? T extends ArrayLike ? Slice<T, 0, T['length']>
        : ToTuple<T>
    : Variadic;


type DetailedToConstraints<T extends Detailed> = ToTuple<{
    [K in keyof T as GetIndex<T[K]>]: GetConstraint<T[K]>
}>

type GetIndex<T> = Exclude<T extends [infer N extends number, any?] ? N : T, undefined>
type GetConstraint<T> = Exclude<T, undefined> extends [any, infer C] ? C : unknown