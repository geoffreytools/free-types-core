import { test } from 'ts-spec'

// // Tout Type est contravariant et apply / Pipe testent que l'entrée correspond à Type<Args>

import { Type, Expect, apply, Get } from '../src'

import { Tuple } from '../src/utils'

interface $Tuple extends Type<[number]> {
    type: Tuple<Get<0, this>>
}
interface $Exclaim extends Type<[string]> {
    type: `${Get<0, this>}!`
}

type Apply2<$T extends Expect<Type<[2]>>> = apply<$T, [2]>
// accept coorect input                                -

// @ts-expect-error: Type<[2]> not assignable to Type<[string]>
type WrongType = Apply2<$Exclaim>

test('application is transparent', t => [
    t.equal<apply<$Tuple, [2]>, Apply2<$Tuple>>()
])

// TODO @ts-expect-error: reject wrong input
type ApplyA<$T extends Expect<Type<[2]>>> = apply<$T, ['a']>
//                                                     ~~~


interface $Hello extends Type<{ name: [0, string] }> {
    type: `Hello ${Get<'name', this>}`
}
type Foo<$T extends Expect<Type<['Dolly']>>> = apply<$T, ['Dolly']>;

type Bar = Foo<$Hello>

type HOT_NoReturn<$T extends Expect<Type<[0]>>> = apply<$T, [0]>;

type Accept = HOT_NoReturn<Type<[0], 1>>