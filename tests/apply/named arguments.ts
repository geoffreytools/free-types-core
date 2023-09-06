import { test } from 'ts-spec';
import { Type, apply } from '../../src';

type Input = { bar: 2, foo: 1 };
type Output = [1, 2];

test('explicit syntax', t => {
    type $Model = Type<{ foo: [0, unknown], bar: [1, unknown]}>;

    interface $Foo extends $Model {
        type: this['arguments']
    }

    type Indirect<$T extends $Model> = apply<$T, Input>

    return t.force([
        t.equal<apply<$Foo, Input>, Output>(),
        t.equal<Indirect<$Foo>, Output>()
    ])
})

test('implicit syntax', t => {
    type $Model = Type<{ foo: [0], bar: [1] }>;

    interface $Foo extends $Model {
        type: this['arguments']
    }

    type Indirect<$T extends $Model> = apply<$T, Input>

    return t.force([
        t.equal<apply<$Foo, Input>, Output>(),
        t.equal<Indirect<$Foo>, Output>()
    ])
})

test('short syntax', t => {
    type $Model = Type<{ foo: 0, bar: 1 }>;

    interface $Foo extends $Model {
        type: this['arguments']
    }

    type Indirect<$T extends $Model> = apply<$T, Input>

    return t.force([
        t.equal<apply<$Foo, Input>, Output>(),
        t.equal<Indirect<$Foo>, Output>()
    ])
})