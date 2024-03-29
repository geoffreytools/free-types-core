import { Type, apply } from '../../src';
import { test } from 'ts-spec';


interface $Foo extends Type<2> { type: this['arguments'] }

type Foo<$T extends Type> = apply<$T, [1, 2, 3]>

test('supernumerary arguments are ignored', t => 
    t.equal<Foo<$Foo>, [1, 2]>()
)