import { Type } from './Type';
import { apply } from './apply';
import { Slice, Subtract, ToTuple } from './utils';

export { partial, partialRight, PartialRight, $partial }

/** Return a new type based upon `$T`, with `Args` already applied, expecting the remaining arguments */
type partial <
    $T extends Type,
    Args extends Partial<$Model['constraints']>,
    $Model extends Type = $T
> = $T extends $Model ? Args extends unknown[]
    ? _partial<$T, Args>
    : never : never

/** A free version of `partial` */
interface $partial<$T extends Type> extends Type<1> {
    type: _partial<$T, [this['arguments'][0]]>
}

type _partial <$T extends Type, Args extends unknown[]> =
    PartialType<
        $T,
        Args,
        Slice<$T['constraints'],
        Args['length'],
        $T['constraints']['length']>,
        'left'
    >

/** Return a new type based upon `$T`, with `Args` already applied to the rightmost parameters of `$T`, and expecting the remaining arguments */
type partialRight<
    $T extends Type,
    Args extends PartialRight<$Model['constraints']>,
    $Model extends Type = $T
> =
    $T extends $Model ? PartialType<
        $T,
        Args,
        Slice<$T['constraints'], 0, Subtract<$T['constraints']['length'], Args['length']>>,
        'right'
    > : never

type PartialRight<T extends unknown[], R = never> =
    T extends [unknown, ...(infer Rest)]
    ? PartialRight<Rest, T | R>
    : [] | R

interface PartialType<
    $T extends Type,
    Applied extends unknown[],
    Constraints extends unknown[],
    Direction
> extends Type {
    type: apply<$T,
        Direction extends 'left' ? [...Applied, ...ToTuple<this['arguments']>] : [...ToTuple<this['arguments']>, ...Applied]
    >
    constraints: Constraints
    arguments: unknown[]
}
