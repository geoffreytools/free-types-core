import { test, Context } from 'ts-spec';
import { Type, apply, partialRight, A, B, C, ToTuple } from '../../src'

test('arguments are wired correctly', t => {
    interface $Arg extends Type<[number, number]> {
        type: this['arg']
    }
    
    interface $Arguments extends Type<[number, number]> {
        type: ToTuple<this['arguments']>
    }

    return [
        test(t('this["arg"] returns the most accurate answer'), t =>
            t.equal<partialRight<$Arg, [1]>['type'], {0: number, 1: 1}>()
        ),

        test(t('this["arguments"] preserves `unknown` values'), t =>
            t.equal<partialRight<$Arguments, [1]>['type'], [unknown, 1]>()
        )
    ];
})

type Cuboid<
    A extends number = number,
    B extends number = number,
    C extends number = number
> = `H${A} W${B} L${C}`

interface $Cuboid extends Type<{A: [0, number], B: [1, number], C: [2, number]}> {
    type: Cuboid<A<this>, B<this>, C<this>>
}

test('named constraints', t => [
    t.equal<
        partialRight<$Cuboid, [1]>['namedConstraints'],
        { A: number, B: number }
    >()
])

test('inferred partial type', t => [
    t.equal<partialRight<$Cuboid, []>['type'], Cuboid>(),
    t.equal<partialRight<$Cuboid, [3]>['type'], Cuboid<number, number, 3>>(),
    t.equal<partialRight<$Cuboid, [2, 3]>['type'], Cuboid<number, 2, 3>>(),
    t.equal<partialRight<$Cuboid, [1, 2, 3]>['type'], Cuboid<1, 2, 3>>()
])

const OK = <D extends string>(t: Context<D>) => t.equal<Cuboid<1, 2, 3>>()

test('partially apply', t => [
    test(t('0 argument'), t => OK(t)<apply<partialRight<$Cuboid, []>, [1, 2, 3]>>()),
    
    test(t('1 argument'), t => OK(t)<apply<partialRight<$Cuboid, [3]>, [1, 2]>>()),
    
    test(t('2 arguments'), t => OK(t)<apply<partialRight<$Cuboid, [2, 3]>, [1]>>()),
    
    test(t('all arguments'), t => [
        OK(t)<apply<partialRight<$Cuboid, [1, 2, 3]>, []>>(),
        OK(t)<apply<partialRight<$Cuboid, [1, 2, 3]>>>(),
    ]),
])

test('incrementally apply arguments', t => [
    t.equal<
        apply<
            partialRight<
                partialRight<
                    partialRight<
                        partialRight<
                            $Cuboid,
                        []>,
                    [3]>,
                [2]>,
            [1]>
        >,
        "H1 W2 L3"
    >()
])

{   /* partial type checking */

    // @ts-expect-error: partial type checks 1st arg
    type wrong1stArg = partialRight<$Cuboid, ['3']>

    // @ts-expect-error: partial type checks 2nd arg
    type wrong2ndArg = partialRight<partialRight<$Cuboid, [3]>, ['2']>

    // @ts-expect-error: partial type checks 3rd arg
    type wrong3rdArg = partialRight<partialRight<$Cuboid, [2, 3]>, ['1']>

    // @ts-expect-error: partial can't overshoot
    type tooManyArgs = partialRight<$Cuboid, [1, 2, 3, 4]>

    // @ts-expect-error: partial of partial can't overshoot
    type tooManyArgs2 = partialRight<partialRight<$Cuboid, [4]>, [1, 2, 3]>
}

{   /* apply type checking */

    // @ts-expect-error: `apply` must apply all remaning args
    type missingArg = apply<partialRight<$Cuboid, [3]>, [1]>

    // @ts-expect-error: `apply` type checks remaining args
    type wrong3rdArg = apply<partialRight<$Cuboid, [3]>, [1, '2']>

    // @ts-expect-error: `apply` type checks remaining args (bis)
    type wrong3rdArgBis = apply<partialRight<$Cuboid, [3, 3]>, ['1']>
}

// undefined

type Foo<A extends undefined, B> = [A, B]

interface $Foo extends Type<[undefined, unknown]> {
    type: Foo<A<this>, B<this>>
}

test("`undefined` can be used as a constraint", t => [
    t.equal<apply<$Foo, [undefined, 1]>, [undefined, 1]>(),
    t.equal<apply<partialRight<$Foo, [1]>, [undefined]>, [undefined, 1]>()
])