import { test } from 'ts-spec'

import { Type, Expect, apply, Get } from '../src'

import { Tuple } from '../src/utils'

interface $Tuple extends Type<[number]> {
    type: Tuple<Get<0, this>>
}
interface $Exclaim extends Type<[string]> {
    type: `${Get<0, this>}!`
}

// accept coorect input
type Apply2<$T extends Expect<Type<[2]>>> = apply<$T, [2]>

// TODO @ts-expect-error: reject incorrect input
type ApplyA<$T extends Expect<Type<[2]>>> = apply<$T, ['a']>
//                                                     ~~~

// @ts-expect-error: Type<[2]> not assignable to Type<[string]>
type WrongType = Apply2<$Exclaim>

test('application is transparent', t => [
    t.equal<apply<$Tuple, [2]>, Apply2<$Tuple>>()
])

interface $Hello extends Type<{ name: [0, string] }> {
    type: `Hello ${Get<'name', this>}`
}
type Foo<$T extends Expect<Type<['Dolly']>>> = apply<$T, ['Dolly']>;

type Bar = Foo<$Hello>

type HOT_NoReturn<$T extends Expect<Type<[0]>>> = apply<$T, [0]>;

type Accept = HOT_NoReturn<Type<[0], 1>>


// contracts

{
    type $Transform = Type<[unknown, number]>;
    type Indirect<$T extends Expect<$Transform>> = apply<$T, ['a', 2]>;

    // indirectly applies 2 arguments
    type IndirectApply2<$T extends Expect<$Transform, false>> = apply<$T, ['a', 2]>;

    // @ts-expect-error: rejects too few arguments
    type TooFewArguments<$T extends Expect<$Transform, false>> = apply<$T, ['a']>;

    // @ts-expect-error: rejects too many arguments
    type TooManyArguments<$T extends Expect<$Transform, false>> = apply<$T, ['a', 2, 3]>;

    // accepts unary Type
    type Unary = Indirect<Type<[unknown]>>

    // @ts-expect-error: rejects unrelated unary Type
    type UnrelatedUnary = Indirect<Type<[string]>>

    // accepts binary Type
    type Binary = Indirect<Type<[unknown, number]>>

    // accepts wider binary Type
    type BinaryWider = Indirect<Type<[unknown, unknown]>>

    // @ts-expect-error: reject too narrow binary Type
    type TooNarrowBinary = Indirect<Type<[number, number]>>

    // accepts variadic Type
    type Variadic = Indirect<Type<unknown[]>>

    // @ts-expect-error: regect too narrow variadic Type
    type TooNarrowVariadic = Indirect<Type<number[]>>
    //                                     ~~~~~~

    // @ts-expect-error: regect too narrow Type
    type TooNarrow = Indirect<Type<[unknown, 1]>>
    //                                      ~~~

}