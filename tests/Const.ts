import { test } from 'ts-spec'
import { apply, Type, Const, $Const } from '../src';

test('Const turns a concrete type into a free type', t =>
    t.equal<apply<Const<42>>, 42>()
)

test('Lifted values ignore their arguments', t => [
    t.equal<apply<Const<42>, [0]>, 42>(),
    t.equal<apply<Const<42>, [0, 1]>, 42>(),
    t.equal<apply<Const<42>, [0, 1, 2]>, 42>(),
    t.equal<apply<Const<42>, { foo: 1 }>, 42>(),
])

test('Const<never>', t => [
    t.not.never<Const<never>>(),
    t.never<apply<Const<never>, [42]>>()
])

test('Const<any>', t => [
    t.not.any<Const<any>>(),
    t.any<apply<Const<any>, [42]>>()
])

// a generic can be lifted with no problem
type Generic<B> = apply<Const<B>, [42]>

// a constrained generic can be lifted with no problem
type Constrained<B extends string> = apply<Const<B>, [42]>

// Const types ignore type constraints on inputs
type Generic3<$T extends Type<[number]>> = apply<$T, [1]>
type H = Generic3<Const<42>>

// @ts-expect-error: constraint on the return type still enforced
type W = MustReturnString<Const<42>>;
type MustReturnString<$T extends Type<1, string>> = $T;

test('$Const', t =>
    t.equal<apply<apply<$Const, [42]>, ['hello']>, 42>()
)