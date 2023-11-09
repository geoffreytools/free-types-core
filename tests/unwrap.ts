import { Type, free, A, unwrap, Unwrapped, TypesMap } from '../src';
import { test } from 'ts-spec'

test('unwrap known type', t =>
    t.equal<unwrap<Map<'a', 1>>, Unwrapped<'Map', free.Map, ['a', 1]>>()
)

test('unwrap tuple of any length', t =>[
    t.equal<
        unwrap<[]>,
        Unwrapped<'Tuple', free.Tuple, []>
    >(),
    t.equal<
        unwrap<readonly []>,
        Unwrapped<'ReadonlyTuple', free.ReadonlyTuple, []>
    >(),
    t.equal<
        unwrap<[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]>,
        Unwrapped<'Tuple', free.Tuple, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]>
    >()
])

test('disambiguate readonly types', t => [
    t.equal<unwrap<Array<'a'>>, Unwrapped<'Array', free.Array, ['a']>>(),
    t.equal<unwrap<readonly 'a'[]>, Unwrapped<'ReadonlyArray', free.ReadonlyArray, ['a']>>(),
    t.equal<unwrap<readonly [1,2,3]>, Unwrapped<'ReadonlyTuple', free.ReadonlyTuple, [1, 2, 3]>>(),
])

// extends known types with module augmentation

class Foo<T> {
    constructor (private value: T) {}
}

interface $Foo extends Type<1> {
    type:  Foo<A<this>>
}

declare module '../src/TypesMap' {
    interface TypesMap {
      Foo: $Foo
    }
}

test('unwrap type added with module augmentation', t => 
    t.equal<unwrap<Foo<'a'>>, Unwrapped<'Foo', $Foo, ['a']>>()
)

// feed Unwrap with a list of types

class Bar<T> {
    constructor (private value: T) {}
}

interface $Bar extends Type<1> {
    type:  Bar<A<this>>
}

interface CustomMap {
    Bar: $Bar
}

test('unwrap type supplied as a custom map', t => [
    t.equal<unwrap<Bar<'a'>, [$Bar]>, Unwrapped<'0', $Bar, ['a']>>(),
    t.equal<unwrap<Bar<'a'>, { a: $Bar }>, Unwrapped<'a', $Bar, ['a']>>(),
    t.equal<unwrap<Bar<'a'>, CustomMap>, Unwrapped<'Bar', $Bar, ['a']>>()
])

// @ts-expect-error: reject built-ins
type BuiltinsObjRejected = unwrap<Bar<'a'>, Set<1>>

// Higher order types compile
{type HOT<T, U extends Unwrapped = unwrap<T>> = null;}
{type HOT<T, U extends Unwrapped = unwrap<T, TypesMap>> = null;}