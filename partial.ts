import { Type } from './Type';
import { apply } from './apply';
import { Slice, Subtract, Next, ToTuple } from './utils';

export { partial, $partial, partialRight, Remaining, PartialRight }

/** Return a new type based upon `$T`, with `Args` already applied, expecting the remaining arguments */
type partial <$T extends Type, Args extends Partial<$T['constraints']>> =
    Args extends unknown[] ? _partial<$T, Args, 'left'> : never

/** A free version of `partial`
 * ```typescript
 * $partial<$T extends Type> extends Type<1>
 * ```
*/
interface $partial<$T extends Type> extends Type<1> {
    type: _partial<$T, [this['arguments'][0]], 'left'>
}


/** Return a new type based upon `$T`, with `Args` already applied to the rightmost parameters of `$T`, and expecting the remaining arguments */
type partialRight<$T extends Type, Args extends PartialRight<$T['constraints']>> =
    _partial<$T, Args, 'right'>

type _partial <
    $T extends Type,
    Args extends unknown[],
    Direction extends 'left' | 'right',
    RemainingConstraints extends unknown[] = GetRemainingConstraints<$T['constraints'], Args>[Direction]
> =
    PartialType<{
        origin: $T
        remaining: RemainingConstraints['length']
        applied: Args
        direction: Direction
        constraints: RemainingConstraints
    }>

interface GetRemainingConstraints<Constraints extends unknown[], Args extends unknown[]> {
    left: Slice<Constraints, Args['length'], Constraints['length']>
    right: Slice<Constraints, 0, Subtract<Constraints['length'], Args['length']>>
}

interface PartialType<T extends PartialTemplate> extends Type {
    type: apply<T['origin'], MergeArguments<T['applied'], ToTuple<this['arguments']>>[T['direction']]>
    constraints: T['constraints']
    arguments: unknown[]
}

type PartialTemplate = {
    origin: Type
    remaining: number
    applied: unknown[]
    direction: 'left' | 'right'
    constraints: unknown[]
}

interface MergeArguments<PrevArgs extends unknown[], NewArgs extends unknown[]> {
    left: [...PrevArgs, ...NewArgs]
    right: [...NewArgs, ...PrevArgs]
}

/** Use as a type constraint to match a Type whose state of application is known */
type Remaining<
    T extends Type,
    R extends number,
> = Type<Slice<
    T['constraints'],
    Subtract<T['constraints']['length'], R>,
    T['constraints']['length']>,
    T['type']
>;

type PartialRight<T extends unknown[], I extends number = 0, R = never> =
    I extends T['length'] ? R
    : PartialRight<T, Next<I>, R | Slice<T, I, T['length']>>