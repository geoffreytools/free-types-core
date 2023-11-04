import { test, Context } from 'ts-spec';
import { Type, apply, partial, A, B, C, ToTuple } from '../../src'

test('arguments are wired correctly', t => {
    interface $Arg extends Type<[number, number]> {
        type: this['arg']
    }
    
    interface $Arguments extends Type<[number, number]> {
        type: ToTuple<this['arguments']>
    }

    return [
        test(t('this["arg"] returns the most accurate answer'), t =>
            t.equal<partial<$Arg, [1]>['type'], {0: 1, 1: number}>()
        ),

        test(t('this["arguments"] preserves `unknown` values'), t =>
            t.equal<partial<$Arguments, [1]>['type'], [1, unknown]>()
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

test('inferred partial type', t => [
    t.equal<partial<$Cuboid, []>['type'], Cuboid>(),
    t.equal<partial<$Cuboid, [1]>['type'], Cuboid<1>>(),
    t.equal<partial<$Cuboid, [1, 2]>['type'], Cuboid<1, 2>>(),
    t.equal<partial<$Cuboid, [1, 2, 3]>['type'], Cuboid<1, 2, 3>>()
])

const OK = <D extends string>(t: Context<D>) => t.equal<Cuboid<1, 2, 3>>()

test('partially apply', t => [
    test('partially apply 0 argument', t => OK(t)<apply<partial<$Cuboid, []>, [1, 2, 3]>>()),
    
    test('partially apply 1 argument', t => OK(t)<apply<partial<$Cuboid, [1]>, [2, 3]>>()),
    
    test('partially apply 2 arguments', t => OK(t)<apply<partial<$Cuboid, [1, 2]>, [3]>>()),
    
    test('partially apply all arguments', t => [
        OK(t)<apply<partial<$Cuboid, [1, 2, 3]>, []>>(),
        OK(t)<apply<partial<$Cuboid, [1, 2, 3]>>>()
    ])
])

test('incrementally apply arguments', t => [
    t.equal<
        apply<partial<partial<partial<partial<$Cuboid, []>, [1]>, [2]>, [3]>>,
        "H1 W2 L3"
    >()
])

{   /* partial type checking */

    // @ts-expect-error: partial type checks 1st arg
    type wrong1stArg = partial<$Cuboid, ['1']>

    // @ts-expect-error: partial type checks 2nd arg
    type wrong2ndArg = partial<partial<$Cuboid, [1]>, ['2']>

    // @ts-expect-error: partial type checks 3rd arg
    type wrong3rdArg = partial<partial<$Cuboid, [1, 2]>, ['3']>

    // @ts-expect-error: partial can't overshoot
    type tooManyArgs = partial<$Cuboid, [1, 2, 3, 4]>

    // @ts-expect-error: partial of partial can't overshoot
    type tooManyArgs2 = partial<partial<$Cuboid, [1]>, [2, 3, 4]>
}

{   /* apply type checking */

    // @ts-expect-error: `apply` must apply all remaning args
    type missingArg = apply<partial<$Cuboid, [1]>, [2]>

    // @ts-expect-error: `apply` type checks remaining args
    type wrong3rdArg = apply<partial<$Cuboid, [1]>, [2, '3']>

    // @ts-expect-error: `apply` type checks remaining args (bis)
    type wrong3rdArgBis = apply<partial<$Cuboid, [1, 2]>, ['3']>
}

// undefined

type Foo<A extends undefined, B> = [A, B]

interface $Foo extends Type<[undefined, unknown]> {
    type: Foo<A<this>, B<this>>
}

test("`undefined` can be used as a constraint", t => [
    t.equal<apply<$Foo, [undefined, 1]>, [undefined, 1]>(),
    t.equal<apply<partial<$Foo, [undefined]>, [1]>, [undefined, 1]>()
])