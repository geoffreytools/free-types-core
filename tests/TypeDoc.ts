import { test } from 'ts-spec'
import { Type, TypeDoc, apply } from '../src'

type $Exclaim = TypeDoc<$Impl>;

interface $Impl extends Type<{T: [0, string]}> {
    type: `${this['arg'][0]}!`
}

test('TypeDoc is transparent', t => [
    t.equal<apply<$Exclaim, ['a']>, 'a!'>(),
    t.equal<$Exclaim['constraints'], [string]>(),
    t.equal<$Exclaim['names'], { T: 0 }>(),
    t.equal<$Exclaim['namedConstraints'], { T: string }>(),
    t.equal<$Exclaim['arg'], { T: string, 0: string }>(),
])
