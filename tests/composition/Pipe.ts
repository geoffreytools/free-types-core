import { test } from 'ts-spec';
import { Type, Pipe } from '../../src';


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

test('The return value is correct', t => [
    test(t('Positional arguments'), t => [
        t.equal<Pipe<['Dolly'], $Hello, $Exclaim>, 'Hello Dolly!'>(),
        t.equal<Pipe<[[1], [2]], $Concat, $Push3>, [1, 2, 3]>()
    ]),

    test(t('Named arguments'), t =>
        t.equal<Pipe<{ name: 'Dolly' }, $Hello, $Exclaim>, 'Hello Dolly!'>()
    )
])

{type Limit = Pipe<
    // @ts-expect-error: "You can compose up to 10 free types with Pipe"
    ['foo'],
    Type, Type, Type, Type, Type, Type, Type, Type, Type, Type, Type, Type, Type
    //                                                    ---- 10th
>}

// does not produce errors with Generics
type Exclaim<T extends string> = Pipe<[T], $Exclaim>;

// @ts-expect-error checks generic arguments
type Error<T extends number> = Pipe<[T], $Exclaim, $Push3>;


/* Valid compositions compile */

{type OK = [
    Pipe<[0], Type<[0], 1>>,
    Pipe<[0], Type<[0], 1>, Type<[1], 2>>,
    Pipe<[0], Type<[0], 1>, Type<[1], 2>, Type<[2], 3>>,
    Pipe<[0], Type<[0], 1>, Type<[1], 2>, Type<[2], 3>, Type<[3], 4>>
];}

 /* invalid composition are rejected */

{type Error = Pipe<
    [0],
    Type<[0], 1>,
    // @ts-expect-error: incompatible
    Type<[0]>
>}

{type Error = Pipe<
    [0],
    Type<[0], 1>,
    Type<[1], 2>,
    // @ts-expect-error: incompatible
    Type<[1]>
>}
{type Error = Pipe<
    [0],
    Type<[0], 1>,
    Type<[1], 2>,
    Type<[2], 3>,
    // @ts-expect-error: incompatible
    Type<[2]>
>}

/* Higher order types */

{type OK<T extends 0> = Pipe<[T], Type<[0], 0>, Type<[0]>>}
{type OK<T extends 0> = Pipe<[T], Type<[0], 0>, Type<[T]>>}

{type KO<T extends 0> = Pipe<
    [T],
    Type<[0], 1>,
    // @ts-expect-error: incompatible
    Type<[0]>
>}
{type KO<T extends 0> = Pipe<
    [T],
    Type<[0], 1>,
    // @ts-expect-error: incompatible
    Type<[string]>
>}
{type KO<T extends 0> = Pipe<
    [T],
    Type<[0], 1>,
    // @ts-expect-error: incompatible
    Type<[T]>
>}

/* arguments are checked */

{type Positional = Pipe<
    // @ts-expect-error: Check positional arguments
    [1],
    Type<[0], 1>,
    Type<[1], 2>
>}

{type Named = Pipe<
    // @ts-expect-error: Check named arguments
    { foo: 1 },
    Type<{ foo: [0, 0]}, 1>,
    Type<[1], 2>
>}