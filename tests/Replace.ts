import { Replace } from '../src';
import { test } from 'ts-spec'


test('Replace', t => [
    t.equal<Replace<Map<'a', 1>, ['b', 2]>, Map<'b', 2>>(),
    t.equal<Replace<WeakMap<{a: 1}, 1>, [{b: 2}, 2]>, WeakMap<{b: 2}, 2>>()
])

{
    // @ts-expect-error: Replace args are type checked
    type wrongReplace = Replace<WeakMap<{a: 1}, 1>, ['b', 2]>;
}

{   // Replace as type constraint

    const foo = <T extends C, C = Replace<T, [number]>>(_: T) => {};
    const bar = <T extends C, C = Replace<T, [object, number]>>(_: T) => {};

    // OK arity 1
    foo(new Set([1]));

    // OK arity 2
    bar(new WeakMap([[{a: 1}, 1]]))

    // @ts-expect-error: Replace as type constraint arity 1
    const wrongInnerValueSet = foo(new Set('a'))
    
    // @ts-expect-error: Replace as type constraint arity 2
    const wrongInnerValueWeakMap = bar(new WeakMap([[{a: 1}, 'a']]))
    
}