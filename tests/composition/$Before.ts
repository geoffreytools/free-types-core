import { test } from 'ts-spec';
import { Type, apply, $Before } from '../../src';

interface $Exclaim extends Type<[string]> {
    type: `${this['arg'][0]}!`
}

interface $Concat extends Type<[string, string]> {
    type: `${this['arg'][0]}${this['arg'][1]}`
}

type $ConcatExclaim = $Before<$Concat, $Exclaim>;

type a = apply<$ConcatExclaim, ['a', 'b']>

test('The return value is correct', t => [
    t.equal<apply<$ConcatExclaim, ['a', 'b']>, 'a!b!'>()
])

// @ts-expect-error: type check transform's input type
type $BadInputType = $Before<$Concat, Type<[number], string>>;

// @ts-expect-error: type check transform's return type
type $BadReturnType = $Before<$Concat, Type<[string], number>>;
