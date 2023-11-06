import { group, test } from 'ts-spec'
import { apply, From, Type, Expect } from '../src'

{   // higher order type

    type Indirect<$T extends Type<1>> = $T;
    type IndirectExpect<$T extends Expect<Type<1>>> = $T;
    
    type $F = From<{ value: unknown }>;
    
    type I = Indirect<$F>
    type J = IndirectExpect<$F>
}

test('The template is the implicit return type', t => [
    t.equal<From<[number, string]>['type'], [number, string]>(),
    t.equal<From<{ a: number, b: string }>['type'], { a: number, b: string }>(),
])

group('Parameters', t => {
    test(t('implicit'), t => [
        test(t('N-ary for tuples'), t => {
            type $T = From<[number, string]>;
            type $U = From<[number, string], [0, 1]>;

            return t.force([
                t.equal<apply<$T, [1, 'foo']>, [1, 'foo']>(),
                t.equal<$T['constraints'], [number, string]>(),

                test('implicit and explit parameters are equivalent', t =>
                    t.equal<$T, $U>()
                ),
            ])
        }),

        test(t('Unary for objects'), t =>  {
            // the ordering of parameters would not be guaranteed
            // if there were more than one

            type $T = From<{ a: number }>;
            type $U = From<{ a: number }, ['a']>;
            
            return t.force([
                t.equal<apply<$T, [1]>, { a: 1 }>(),
                t.equal<$T['constraints'], [number]>(),

                test('implicit and explit parameters are equivalent', t => [
                    t.equal<$T['constraints'], $U['constraints']>(),
                    t.equal<$T['type'], $U['type']>(),
                    t.equal<apply<$T, [1]>, apply<$U, [1]>>(),

                    // except for names
                    t.equal<$T['names'],{}>(),
                    t.equal<$U['names'], { a: 0 }>(),
                ])

            ])
        })
    ])

    test(t('selective'), t =>  {
        type $T = From<{ a: number, b: string, c: 2 }, ['b']>;
    
        return t.force([
            t.equal<apply<$T, ['foo']>, { a: number, b: 'foo', c: 2 }>(),
            t.equal<$T['constraints'], [string]>()
        ])
    })

    test(t('reordering'), t =>  {
        type $T = From<{ a: number, b: string }, ['b', 'a']>;
        type $U = From<[number, string], [1, 0]>;
    
        return t.force([
            t.equal<apply<$T, ['foo', 1]>, { a: 1, b: 'foo' }>(),
            t.equal<$T['constraints'],  [string, number]>(),
    
            t.equal<apply<$U, ['foo', 1]>, [1, 'foo']>(),
            t.equal<$U['constraints'],  [string, number]>()
        ])
    })

    group(t('optional'), t => {
        test(t('tuple'), t => {
            type $T = From<[number, string], [0, 1?]>;

            return t.force([
                t.equal<apply<$T, [1, 'foo']>, [1, 'foo']>(),
                t.equal<$T['constraints'],  [number, string?]>()
            ])
        })

        test(t('auto named'), t => {
            type FooBar = { foo: number, bar: string };
            type $FooBar = From<FooBar, ['foo', 'bar'?]>
        
            return t.force([
                t.equal<$FooBar['constraints'], [number, string?]>(),
                t.equal<$FooBar['namedConstraints'], { foo: number, bar?: string }>(),
        
                test(t('omitting optional'), t => [
                    t.equal<apply<$FooBar, [1]>, { foo: 1, bar: string }>(),
                    t.equal<apply<$FooBar, {foo: 1}>, { foo: 1, bar: string }>(),
                ]),

                test(t('all args'), t => [
                    t.equal<apply<$FooBar, [1, 'a']>, { foo: 1, bar: 'a' }>(),
                    t.equal<apply<$FooBar, {foo: 1, bar: 'a'}>, { foo: 1, bar: string }>(),
                ])
            ])
        })
        
        test(t('renamed'), t => {
            type FooBar = { foo: number, bar: string };
            type $FooBar = From<FooBar, [{ foo: 'bibi' }, { bar: 'bubu' }?]>
        
            return t.force([
                t.equal<$FooBar['constraints'], [number, string?]>(),
                t.equal<$FooBar['namedConstraints'], { bibi: number, bubu?: string }>(),
        
                t.equal<apply<$FooBar, [1]>, { foo: 1, bar: string }>(),
                t.equal<apply<$FooBar, [1, 'a']>, { foo: 1, bar: 'a' }>(),
            ])
        })
    })

    group(t('named'), t => {
        test(t('tuples'), t => {
            type $T = From<[string, number], [{ 0: 'foo' }, { 1: 'bar' }]>
    
            return t.force([
                t.equal<$T['constraints'], [string, number]>(),
                t.equal<apply<$T, {foo: 'hello', bar: 5}>, ['hello', 5]>(),
                t.equal<apply<$T, ['hello', 5]>, ['hello', 5]>()
            ])
        })
    
        test(t('tuples with reordering'), t => {
            type $T = From<[string, number], [{ 1: 'bar' }, { 0: 'foo' }]>
    
            return t.force([
                t.equal<$T['constraints'], [number, string]>(),
                t.equal<apply<$T, { foo: 'hello', bar: 5 }>, ['hello', 5]>(),
                t.equal<apply<$T, [5, 'hello']>, ['hello', 5]>()
            ])
        })
    
        test(t('object types'), t => {
            type $T = From<{foo: string, bar: number}, [{ foo: 'foo' }, { bar: 'bar' }]>

            return t.force([
                t.equal<$T['constraints'], [string, number]>(),
                t.equal<apply<$T, { bar: 5, foo: 'hello'}>, { foo: 'hello', bar: 5 }>(),
                t.equal<apply<$T, ['hello', 5]>, { foo: 'hello', bar: 5 }>()
            ])
        })

        test(t('object types with reordering'), t => {
            type $T = From<{foo: string, bar: number}, [{ bar: 'bar' }, { foo: 'foo' }]>
    
            return t.force([
                t.equal<$T['constraints'], [number, string]>(),
                t.equal<apply<$T, { bar: 5, foo: 'hello'}>, { foo: 'hello', bar: 5 }>(),
                t.equal<apply<$T, [5, 'hello']>, { foo: 'hello', bar: 5 }>()
            ])
        })
    })
})

group('tuples', t => {
    test(t('return value'), t =>
        t.equal<apply<From<[number, string]>, [1, 'foo']>, [1, 'foo']>(),
    )

    test(t('constraints'), t =>
        t.equal<From<[number, string]>['constraints'], [number, string]>()
    )

    group(t('with optional elements'), t =>  {
        type $T = From<[number, string?]>;

        test(t('return value'), t =>
            t.equal<apply<$T, [1, 'foo']>, [1, 'foo'?]>()
        )

        test(t('constraints'), t =>
            t.equal<$T['constraints'], [number, string]>()
        )
    })
})

group('object types', t =>  {
    // @ts-expect-error: object types > check indices
    type BadArgs = From<{ a: number, b: string }, ['c', 'd']>;
    
    type $T = From<{ a: number, b: string }, ['a', 'b']>;

    test(t('return value'), t =>
        t.equal<apply<$T, [1, 'foo']>, { a: 1, b: 'foo' }>()
    )

    test(t('constraints'), t =>
        t.equal<$T['constraints'], [number, string]>()
    )

    group(t('with optional elements'), t => {
        type $T = From<{ a: number, b?: string }, ['a', 'b']>;

        test(t('return value'), t =>
            t.equal<apply<$T, [1, 'foo']>, { a: 1, b?: 'foo' }>()
        );

        test(t('constraints'), t =>
            t.equal<$T['constraints'], [number, string]>()
        )
    })
})

test('arbitrarily many arguments', t => {
    type A = { a: 1 };
    type B = { a: 1, b: 2 };
    type C = { a: 1, b: 2, c: 3 };
    type D = { a: 1, b: 2, c: 3, d: 4 };

    type $A = From<A>;
    type $B = From<B, ['a', 'b']>;
    type $C = From<C, ['a', 'b', 'c']>;
    type $D = From<D, ['a', 'b', 'c', 'd']>;

    type R = {
        a: string, b: string, c: string, d: string, e: string,
        f: string, g: string, h: string, i: string, j: string,
        k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17, r: 18
    };

    type $R = From<R, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']>;

    return t.force([
        t.equal<apply<$A, [1]>, A>(),
        t.equal<apply<$B, [1, 2]>, B>(),
        t.equal<apply<$C, [1, 2, 3]>, C>(),
        t.equal<apply<$D, [1, 2, 3, 4]>, D>(),
        t.equal<
            apply<$R, ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']>, {
                a: "1", b: "2", c: "3", d: "4", e: "5", f: "6", g: "7", h: "8", i: "9", j: "10",
                k: 11, l: 12, m: 13, n: 14, o: 15, p: 16, q: 17, r: 18
            }
        >()
    ])
})