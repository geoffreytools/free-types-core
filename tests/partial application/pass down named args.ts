import { test, Context } from 'ts-spec';
import { Type, apply, partial, Remaining, A, B, C, D, partialRight } from '../../src'

type F<
    A extends string,
    B extends number,
    C extends undefined,
    D extends boolean
> = [A, B, C, D];

type $Model = Type<{
    A: [0, string],
    B: [1, number],
    C: [2, undefined],
    D: [3, boolean]
}>

interface $F extends $Model {
    type: F<A<this>, B<this>, C<this>, D<this>>
}

const OK = <D extends string>(t: Context<D>) =>
    t.equal<["foo", 2, undefined, true]>()

test('shallow', t => {
    type Foo<
        A extends string,
        B extends number,
        C extends undefined
    > = Bar<partial<$F, [A, B, C]>>;

    type Bar<$T extends Type<[boolean]>> =
        apply<$T, [true]>

    return OK(t)<Foo<'foo', 2, undefined>>()
})

test('deep', t => {
    type Foo<
        A extends string,
        B extends number,
    > = Bar<partial<$F, [A, B]>, undefined>;
    
    type Bar<
        $T extends Type<[undefined, boolean]>,
        C extends undefined,
        // enables $T to be generic
    > = Baz<partial<$T, [C], Type<[undefined, boolean]>>>
        //                   --------------------------

    type Baz<$T extends Type<[boolean]>> =
        apply<$T, [true]>

    return OK(t)<Foo<'foo', 2>>()
})

test('shallow using Remaining', t => {
    type Foo<
        A extends string,
        B extends number,
        C extends undefined
    > = Bar<partial<$F, [A, B, C]>>;

    type Bar<$T extends Remaining<$F, 1>> =
        apply<$T, [true]>

    return OK(t)<Foo<'foo', 2, undefined>>()
})

test('deep using Remaining', t => {
    type Foo<
        A extends string,
        B extends number,
    > = Bar<partial<$F, [A, B]>, undefined>;
    
    type Bar<
        $T extends Remaining<$F, 2>,
        C extends undefined,
        // enables $T to be generic
    > = Baz<partial<$T, [C], Remaining<$F, 2>>>
        //                   ------------------

    type Baz<$T extends Remaining<$F, 1>> =
        apply<$T, [true]>

    return OK(t)<Foo<'foo', 2>>()

})

test('shallow Right', t =>{
    type Foo<
        A extends number,
        B extends undefined,
        C extends boolean
    > = Bar<partialRight<$F, [A, B, C]>>;

    type Bar<$T extends Type<[string]>> =
        apply<$T, ['foo']>

    return OK(t)<Foo<2, undefined, true>>()
})

test('deep Right', t =>{
    type Foo<
        A extends undefined,
        B extends boolean,
    > = Bar<partialRight<$F, [A, B]>, 2>;
    
    type Bar<
        $T extends Type<[string, number]>,
        C extends number,
        // enables $T to be generic
    > = Baz<partialRight<$T, [C], Type<[string, number]>>>
        //                        ----------------------

    type Baz<$T extends Type<[string]>> =
        apply<$T, ['foo']>

    return OK(t)<Foo<undefined, true>>()
})