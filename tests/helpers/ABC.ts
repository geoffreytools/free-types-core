import { test } from 'ts-spec'
import { Type, A, B, C, apply } from '../../src';

type AlphaNumPair<A extends string, B extends number> = [A, B];


{interface $Pair extends Type<2> {
    // @ts-expect-error: A checks position
    type: [A<this>, C<this>]
}}

interface $AlphaNumPair extends Type<2> {
    type: A<this> extends this['constraints'][0]
        ? B<this> extends this['constraints'][1]
            ? AlphaNumPair<A<this>, B<this>>
            : never
        : never
    constraints: [string, number]
}

interface $AlphaNumPair2 extends Type<2> {
    type: AlphaNumPair<A<this>, B<this>>
    constraints: [string, number]
}

test('A apply', t =>
    t.equal<apply<$AlphaNumPair, ['a', 1]>, ['a', 1]>()
)

// @ts-expect-error: A arg 1 is type checked
type WrongArg1 = apply<$AlphaNumPair, [0, 1]>

// @ts-expect-error: A arg 2 is type checked
type WrongArg2 = apply<$AlphaNumPair, ['a', 'b']>
