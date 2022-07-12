import { Type } from './Type';
import { apply } from './apply';
import { Slice, Subtract, ToTuple } from './utils';

export { partialRight, PartialRight }

/** Return a new type based upon `$T`, with `Args` already applied to the rightmost parameters of `$T`, and expecting the remaining arguments */
type partialRight<$T extends Type, Args extends PartialRight<$T['constraints']>> =
    RightPartialType<
        $T,
        Args,
        Slice<$T['constraints'], 0, Subtract<$T['constraints']['length'], Args['length']>>
    >

interface RightPartialType<
    $T extends Type,
    Applied extends unknown[],
    Constraints extends unknown[]
> extends Type {
    type: apply<$T, [...ToTuple<this['arguments']>, ...Applied]>
    constraints: Constraints
    arguments: unknown[]
}

type PartialRight<T extends unknown[], R = never> =
    T extends [unknown, ...(infer Rest)]
    ? PartialRight<Rest, T | R>
    : R