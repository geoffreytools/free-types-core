import { Contra, Type, apply } from '../src'

type $Add = Type<[number, number], number>

type ContraNarrower<$T extends Contra<$T, Type<[1, 2]>>> = null

// A more general Type can be passed to a HKT
type OK = ContraNarrower<$Add>

type ContraWider<$T extends Contra<$T, Type<[unknown, unknown]>>> = null

// @ts-expect-error: A more specific Type can't be passed to a HKT
type TooNarrow = ContraWider<$Add>


//application

type ApplyTo42<$T extends Contra<$T, Type<[2001, 42]>>> = apply<$T, [2001, 42]>

type foo = ApplyTo42<$Add>