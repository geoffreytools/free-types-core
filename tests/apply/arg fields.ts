import { Type, apply } from '../../src/';
import { Context, test, group } from 'ts-spec';

type Foo<T extends string[], U extends number> = 
    [key: [...T, 'world'], value: U]

const WiredCorrectly = <C extends string>(t: Context<C>) =>
    t.equal<Foo<["hello"], 42>>()

group('named parameters', t =>  {
    type $Named = Type<{ key: [0, string[]], value: [1, number] }>;

    // can apply named arguments in higher order type
    type HOTName<$T extends $Named> = apply<$T, { key: ['hello'], value: 42 }>

    // can apply positional arguments in higher order type
    type HOTPos<$T extends $Named> = apply<$T, [['hello'], 42]>

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

        // @ts-expect-error: can't apply undefined named arguments
        type Wrong = apply<$Foo, { key: ['hello'], value: 42 }>

    })

    interface $Wrong extends $Positional {
        // @ts-expect-error: can't reference undefined named arguments
        type: Foo<this['arg']['key'], this['arg']['value']>
    }

    // @ts-expect-error can't apply undefined named arguments in higher order type
    type BadHOT<$T extends $Positional> = apply<$T, { key: ['hello'], value: 42 }>
    
})
