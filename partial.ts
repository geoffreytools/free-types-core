import { Type } from './Type';
import { apply } from './apply';
import { Slice, ToTuple } from './utils';

export { partial, $partial }

/** Return a new type based upon `$T`, with `Args` already applied, expecting the remaining arguments */
type partial <$T extends Type, Args extends Partial<$T['constraints']>> =
    Args extends unknown[] ? _partial<$T, Args> : never

/** A free version of `partial`
 * 
 * $partial<$T extends Type> extends Type<1>
*/
interface $partial<$T extends Type> extends Type<1> {
    type: _partial<$T, [this['arguments'][0]]>
}

type _partial <$T extends Type, Args extends unknown[]> =
    PartialType<$T, Args, Slice<$T['constraints'], Args['length'], $T['constraints']['length']>>

interface PartialType<
    $T extends Type,
    Applied extends unknown[],
    Constraints extends unknown[]
> extends Type {
    type: apply<$T, [...Applied, ...ToTuple<this['arguments']>]>
    constraints: Constraints
    arguments: unknown[]
}
