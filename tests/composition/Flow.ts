import {  test } from 'ts-spec';
import { Type, apply, partial, Flow } from '../../src';

interface $Exclaim extends Type<[string]> {
    type: `${this['arg'][0]}!`
}

interface $Push3 extends Type<[unknown[]]> {
    type: [...this['arg'][0], 3]
}

interface $Concat extends Type<[unknown[], unknown[]]> {
    type: [...this['arg'][0], ...this['arg'][1]]
}

interface $Hello extends Type<{ name: [0, string] }> {
    type: `Hello ${this['arg']['name']}`
}

// @ts-expect-error: check named parameters
type Typo = apply<Flow<[$Hello, $Exclaim]>, { nae: 'Dolly' }>;

test('The return value is correct', t => [
    test(t('Positional arguments'), t => [
        t.equal<apply<Flow<[$Hello, $Exclaim]>, ['Dolly']>, 'Hello Dolly!'>(),
        t.equal<apply<Flow<[$Concat, $Push3]>, [[1], [2]]>, [1, 2, 3]>()
    ]),

    test(t('Named arguments'), t =>
        t.equal<apply<Flow<[$Hello, $Exclaim]>, { name: 'Dolly' }>, 'Hello Dolly!'>()
    )   
])

/* Valid compositions compile */
{type OK = [
    Flow<[Type<[0], 1>]>,
    Flow<[Type<[0], 1>, Type<[1], 2>]>,
    Flow<[Type<[0], 1>, Type<[1], 2>, Type<[2], 3>]>,
    Flow<[Type<[0], 1>, Type<[1], 2>, Type<[2], 3>, Type<[3], 4>]>
];}

{ /* invalid composition are rejected */
    // @ts-expect-error: Checks Unary composition
    type wrongUnaryComposition = Flow<[$Exclaim, $Push3]>

    // @ts-expect-error: Checks Binary composition
    type wrongBinaryComposition = Flow<[$Concat, $Push3, $Exclaim]>
}

test(`Invalid compositions' error message point at the error`,  t => {
    type Check<A extends unknown[]> = import('../../src/Flow').Check<A>;

    return [
        t.equal<
            Check<[Type<[0], 1>, Type<[0]>]>,
            //               ~
            [Type<[0], 0>, Type<[0]>]
            //         _
        >(),
        t.equal<
            Check<[Type<[0], 1>, Type<[1], 2>, Type<[1]>]>,
            //                             ~   
            [Type<[0], 1>, Type<[1], 1>, Type<[1]>]
            //                       _
        >(),
        t.equal<
            Check<[Type<[0], 1>, Type<[1], 2>, Type<[2], 3>, Type<[2]>]>,
            //                                           ~   
            [Type<[0], 1>, Type<[1], 2>, Type<[2], 2>, Type<[2]>]
            //                                     _
        >(),
    ]
})

{
    // @ts-expect-error: Checks arguments
    type wrongArguments = apply<Flow<[$Hello, $Exclaim]>, [1]>
}

test('Higher order types', t => [
    test(t('unspecified arity'), t => {
        type Foo<$T extends Type> = apply<$T, [[1], [2]]>;
    
        return t.equal<Foo<Flow<[$Concat, $Push3]>>, [1, 2, 3]>()
    }),
    
    test(t('specific arity'), t => {
        type Foo<$T extends Type<2>> = apply<$T, [[1], [2]]>;
    
        return t.equal<Foo<Flow<[$Concat, $Push3]>>, [1, 2, 3]>()
    })
])

test('partial application of composition', t => {
    type $P = partial<Flow<[$Concat, $Push3]>, [[1]]>
    return t.equal<apply<$P, [[2]]>, [1, 2, 3]>()
})