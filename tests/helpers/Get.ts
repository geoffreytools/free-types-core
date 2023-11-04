import { test } from 'ts-spec'
import { Type, Get, apply } from '../../src';

test('undefined is an allowed value', t => {
    interface $Id extends Type<1> {
        type: this[0]
    }
    
    interface $IdGet extends Type<1> {
        type: Get<0, this>
    }

    return t.force([
        t.equal<apply<$Id, [undefined]>, undefined>(),
        t.equal<apply<$IdGet, [undefined]>, undefined>(),
    ])
})