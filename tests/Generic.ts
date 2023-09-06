import { Type, Generic } from '../src';
import { test } from 'ts-spec';

interface $Foo extends Type<[number, string]> {
    type: [this[0], this[1]]
}

test('Generic applies a free type with its type constraints', t =>
    t.equal<Generic<$Foo>, [number, string]>()
)