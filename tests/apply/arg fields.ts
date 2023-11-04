import { Type, apply } from '../../src/';
import { Context, test, group } from 'ts-spec';

type Foo<T extends string[], U extends number> = 
    [key: [...T, 'world'], value: U]

const WiredCorrectly = <C extends string>(t: Context<C>) =>
    t.equal<Foo<["hello"], 42>>()

test('arg is available dynamically', t => {
    type Foo<A extends number, B extends string> = [A, B];

    interface $Foo extends Type {
        type: Foo<this['arg'][0], this['arg'][1]>
        constraints: [number, string]
        names: {foo: 1}
    }

    interface $NamedFoo extends Type {
        type: Foo<this['arg']['foo'], this['arg']['bar']>
        constraints: [number, string]
        names: { foo: 0, bar: 1 }
    }

    // @ts-expect-error: check dynamic names
    type BadNames = apply<$NamedFoo, { fo: 1, bar: 'a' }>

    // @ts-expect-error: check dynamic named argument constraints
    type BadConstraints = apply<$NamedFoo, { foo: 'a', bar: 1 }>

    return t.force([
        t.equal<apply<$Foo, [1, 'a']>, [1, 'a']>(),
        t.equal<apply<$NamedFoo, [1, 'a']>, [1, 'a']>(),
        t.equal<apply<$NamedFoo, { foo: 1, bar: 'a' }>, [1, 'a']>(),
    ]);
})

test('optional parameters', t => {
    type Exclaim<A extends string> = `${A}!`;
    
    interface $Exclaim extends Type<[string?]> {
        type: Exclaim<
            this[0] extends undefined
            ? 'default value'
            : this['arg'][0] & {}
        >
    }
    
    return test(t('return type is OK'), t => [
        t.equal<$Exclaim['type'], `${string}!`>(),
        t.equal<apply<$Exclaim, ['a']>, 'a!'>(),
        t.equal<apply<$Exclaim>, 'default value!'>()
    ])
})

test('preserve optionality', t =>
    t.equal<
        Type<{T: [0, number], U?: [1, string]}, string>['arg'],
        { 0: number, T: number, 1?: string, U?: string }
    >()
)

group('named parameters', t =>  {
    type $Named = Type<{ key: [0, string[]], value: [1, number] }>;

    // can apply named arguments in higher order type
    type HOTName<$T extends $Named> = apply<$T, { key: ['hello'], value: 42 }>

    // @ts-expect-error: check named arguments type in higher order type
    type WrongHOTName<$T extends $Named> = apply<$T, { key: 2001, value: 42 }>

    // can apply positional arguments in higher order type
    type HOTPos<$T extends $Named> = apply<$T, [['hello'], 42]>

    // @ts-expect-error: check positional arguments type in higher order type
    type WrongHOTPos<$T extends $Named> = apply<$T, [2001, 42]>

    // @ts-expect-error: can't pass positional Type to a HOT expecting a $Named
    type WrongType = HOTName<Type<[string[], number]>>

    group(t('referencing positional parameters'), t => {
        interface $Foo extends $Named {
            type: Foo<this['arg'][0], this['arg'][1]>
        }

        test(t('applying positional arguments'), t =>
            WiredCorrectly(t)<apply<$Foo, [['hello'], 42]>>()
        )
        
        test(t('applying named arguments'), t =>
            WiredCorrectly(t)<apply<$Foo, {key: ['hello'], value: 42}>>()
        )

        test(t('application via named higher order type'), t =>
            WiredCorrectly(t)<HOTName<$Foo>>()
        )

        test(t('application via positional higher order type'), t =>
            WiredCorrectly(t)<HOTPos<$Foo>>()
        )
    })

    group(t('referencing named parameters'), t => {
        interface $Foo extends $Named {
            type: Foo<this['arg']['key'], this['arg']['value']>
        }

        test(t('applying positional arguments'), t =>
            WiredCorrectly(t)<apply<$Foo, [['hello'], 42]>>()
        )

        test(t('applying named arguments'), t =>
            WiredCorrectly(t)<apply<$Foo, { key: ['hello'], value: 42 }>>()
        )
        
        test(t('application via named higher order type'), t =>
            WiredCorrectly(t)<HOTName<$Foo>>()
        )

        test(t('application via positional higher order type'), t =>
            WiredCorrectly(t)<HOTPos<$Foo>>()
        )
    })
})

group('positional parameters', t =>  {
    type $Positional = Type<[string[], number]>

    // can apply positional arguments in higher order type
    type HOT<$T extends $Positional> = apply<$T, [['hello'], 42]>

    group(t('referencing positional parameters'), t => {
        // compiles
        interface $Foo extends $Positional {
            type: Foo<this['arg'][0], this['arg'][1]>
        }

        test(t('applying positional arguments'), t =>
            WiredCorrectly(t)<apply<$Foo, [['hello'], 42]>>()
        )

        test(t('application via positional higher order type'), t =>
            WiredCorrectly(t)<HOT<$Foo>>()
        )

        // TODO: @ts-expect-error: can't apply undefined named arguments
        type Wrong = apply<$Foo, { key: ['hello'], value: 42 }>

    })

    interface $Wrong extends $Positional {
        // @ts-expect-error: can't reference undefined named arguments
        type: Foo<this['arg']['key'], this['arg']['value']>
    }

    // TODO : @ts-expect-error can't apply undefined named arguments in higher order type
    type BadHOT<$T extends $Positional> = apply<$T, { key: ['hello'], value: 42 }>
    
})

test('preserve tupleness', t => {
    type $Contract = Type<[unknown[]], unknown[]>;

    interface $Push42 extends $Contract {
        type: [...this['arg'][0], 42]
    }

    type Indirect<$T extends $Contract> = [...apply<$T, [[1, 2]]>]
    
    return t.force([
        t.equal<[0, ...apply<$Push42, [[1, 2]]>], [0, 1, 2, 42]>(),
        t.equal<[0, ...Indirect<$Push42>], [0, 1, 2, 42]>(),

    ])
})