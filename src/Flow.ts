import { _apply, _Type } from './apply'
import { Type } from './Type'
import { Next } from './utils'

export { Flow };

type Flow<
    $Ts extends Composable,
    Composable extends (_Type & {contra: any})[] = $Ts extends [_Type] ? [_Type] : Check<$Ts>
> = Composition<{
    type: Fallback<$Ts>
    constraints: $Ts[0]['constraints'],
    names: $Ts[0]['names'],
}, $Ts>;

type Descriptor = {
    type: any
    constraints: any,
    names: any,
}

interface Composition<D extends Descriptor, $Ts extends (_Type & {contra: any})[]> extends Type {
    type: unknown[] extends this['arguments'] ? D['type']
        : Pipe<[_apply<$Ts[0], this['arguments']>], $Ts>
    names: D['names']
    constraints: D['constraints']
    contra: $Ts[0]['contra']
    namedConstraints: $Ts[0]['namedConstraints']
}

type Fallback<$Ts> =
    $Ts extends [...any, infer $T extends {type: unknown}]
    ? $T['type']
    : never

export type Check<T extends unknown[], R extends _Type[] = [], Last extends _Type[] = []> =
    T extends [infer A extends _Type, infer B extends _Type, ...infer Rest]
    ? Check2<A, B> extends infer C extends [_Type, _Type] ? Check<Rest, [...R, ...Last, C[0]], [C[1]]> : never
    : T extends [infer A extends _Type, infer B extends _Type]
    ? [...R, ...Last,...Check2<A, B>]
    : T extends [infer A extends _Type]
    ? Last extends [] ? [...R, A] : [...R, ...Check2<Last[0], A>]
    : [...R, ...Last]

type Check2<A extends _Type, B extends _Type> =
    A['type'] extends B['constraints'][0] ? [A, B]
    : [Type<A['constraints'], B['constraints'][0]>, B]

type Pipe<
    Args extends unknown[],
    $Ts extends _Type[],
    I extends number = 1,
    R = _apply<$Ts[I], Args>,
    N extends number = Next<I>
> = N extends $Ts['length'] ? R
    : R extends $Ts[N]['constraints'][0] ? Pipe<[R], $Ts, N>
    : never