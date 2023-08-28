import { Type } from './Type';
import { apply } from './apply';
import { GetNumericKeys, Int, Slice, Subtract, ToTuple } from './utils';

export { createPartial as partial, partialRight, PartialRight, $partial }
export { PartialType } // should not be used but can't be private

/** Return a new type based upon `$T`, with `Args` already applied, expecting the remaining arguments */
type createPartial <
    $T extends Type,
    Args extends Partial<$Model['constraints']>,
    $Model extends Type = $T
> = $T extends $Model ? Args extends unknown[]
    ? partial<$T, Args>
    : never : never

/** A free version of `partial` */
interface $partial<$T extends Type> extends Type<1> {
    type: partial<$T, [this['arguments'][0]]>
}

type partial <$T extends Type, Args extends unknown[]> = [
    Args['length'],
    Required<$T['constraints']>['length']
] extends [
    infer From extends number,
    infer To extends number
] ? PartialType<$T, Args, Slice<$T['constraints'], From, To>, 'left'>
  : never;


/** Return a new type based upon `$T`, with `Args` already applied to the rightmost parameters of `$T`, and expecting the remaining arguments */
type partialRight<
    $T extends Type,
    Args extends PartialRight<$Model['constraints']>,
    $Model extends Type = $T
> = $T extends $Model
    ? Subtract<Required<$T['constraints']>['length'], Args['length']> extends infer To extends number ? PartialType<
        $T,
        Args,
        Slice<$T['constraints'], 0, To>,
        'right'
    > : never
    : never

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
    names: $T['names']
    namedConstraints: { __: any; };
    arg: {
        [K in keyof $T['names']] : this[$T['names'][K] & keyof this] extends infer R
            extends Constraints[$T['names'][K] & keyof Constraints]
                ? R : Constraints[$T['names'][K] & keyof Constraints]
    } & {
        [K in GetKeys<Constraints>]: this[Int<K>] extends infer R
            extends Constraints[Int<K>]
            ? R : Constraints[Int<K>]
    }
    constraints: Constraints
    arguments: unknown[]
}

type GetKeys<T, Keys extends number = GetNumericKeys<T>> = Keys | `${Keys}` ;