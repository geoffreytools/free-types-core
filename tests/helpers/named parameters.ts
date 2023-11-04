import { Type, apply, At, Lossy, Checked, Optional } from '../../src';
import { test, Context } from 'ts-spec';

type Foo<A extends string, B extends number> = [a: A, b: B];

type $Model = Type<{ foo: [0, string], bar: [1, number] }>

const OK = <D extends string>(t: Context<D>) => <$T extends Type>() =>
    t.equal<apply<$T, [foo: 'foo', bar: 42]>, [a: 'foo', b: 42]>();

test('At', t => {
    interface $Foo extends $Model {
        type: [a: At<'foo', this>, b: At<'bar', this>]
    }

    return OK(t)<$Foo>()
})

test('At Manual', t => {
    interface $Foo extends Type {
        type: [a: At<'foo', this>, b: At<'bar', this>]
        names: { foo: 0, bar: 1 }
    }

    return OK(t)<$Foo>()
})

test('Lossy', t => {
    interface $Foo extends $Model {
        type: Foo<Lossy<'foo', this>, Lossy<'bar', this>>
    }

    return OK(t)<$Foo>()
})

test('Lossy Manual', t => {
    interface $Foo extends Type {
        type: Foo<Lossy<'foo', this>, Lossy<'bar', this>>
        constraints: [foo: string, bar: number]
        names: { foo: 0, bar: 1 }
    }

    return OK(t)<$Foo>()
})

test('Checked', t => {
    interface $Foo extends $Model {
        type: Foo<Checked<'foo', this>, Checked<'bar', this>>
    }

    return OK(t)<$Foo>()
})

test('Checked Manual', t => {
    interface $Foo extends Type {
        type: Foo<Checked<'foo', this>, Checked<'bar', this>>
        constraints: [foo: string, bar: number]
        names: { foo: 0, bar: 1 }
    }

    return OK(t)<$Foo>()
})


test('Optional manual', t => {
    // doesn't work with auto args yet.
    interface $Foo extends Type {
        type: [Optional<'foo', this>, Optional<'bar', this>]
        constraints: [foo?: string, bar?: number]
        names: { foo: 0, bar: 1 }
    }

    return OK(t)<$Foo>()
})
