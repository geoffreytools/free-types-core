import { Next, IsUnknown, Prev } from './utils'

export { At, Checked, Lossy, Optional, A, B, C, D, E }

// Fake `Type` for user friendly error messages
type Type<N extends number = number> = {
    constraints: N extends number ? { [K in Prev<N>]: unknown; } : unknown[]
    arguments: unknown[]
    names: { [k: string]: number }
}

type Type_ <N extends number> = {
    constraints: { [K in Prev<N>]?: unknown; }
    arguments: unknown[]
    names: { [k: string]: number }
}
type Default = {
    constraints: [0,1,2,3,4]
    arguments: unknown[]
    names: { [k: string]: number }
}

/** - safely index `this`
 * - optionally take a fallback
*/
type At<
    N extends Check,
    This extends N extends number ? Type<Next<N>> : Type,
    Fallback = unknown,
    Check extends string | number = N extends string ? keyof This['names'] & string : number
> = N extends number
    ? AtImpl<This, Fallback, N>
    : AtImpl<This, Fallback, This['names'][N]>;

type AtImpl<This extends Type, Fallback, I extends number> =
    IsUnknown<This['arguments'][I]> extends true ? Fallback : This['arguments'][I];


/** - safely index `this`
 * - defuse the corresponding type constraint with an inline conditional
 * - optionally take a fallback
 */
type Checked<
    N extends Check,
    This extends N extends number ? Type<Next<N>> : Type,
    Fallback = N extends number
        ? This['constraints'][N]
        : N extends string
        ? This['constraints'][This['names'][N]]
        : never,
    Check extends string | number = N extends string ? keyof This['names'] & string : number
> = N extends number ? CheckedImpl<N, This, Fallback>
    : CheckedImpl<This['names'][N], This, Fallback>;

type CheckedImpl<N extends number, This extends Type, Fallback> =
    This['arguments'][N] extends This['constraints'][N]
    ? This['arguments'][N]
    : Fallback;

/** - safely index `this`
 * - works on optional parameters
 * - defuse the corresponding type constraint with an inline conditional
 * - optionally take a fallback
 */
 type Optional<
    N extends Check,
    This extends N extends number ? Type_<Next<N>> : Type,
    Fallback = N extends number
        ? Exclude<This['constraints'][N], undefined>
        : N extends string
        ? Exclude<This['constraints'][This['names'][N]], undefined>
        : never,
    Check extends string | number = N extends string ? keyof This['names'] & string : number
> = N extends number ? OptionalImpl<N, This, Fallback>
    : OptionalImpl<This['names'][N], This, Fallback>;

type OptionalImpl<N extends number, This extends Type, Fallback> =
    This['arguments'][N] extends Exclude<This['constraints'][N], undefined>
    ? This['arguments'][N]
    : Fallback


/** - safely index `this`
 * - intersect the corresponding type constraint
 */
type Lossy<
    N extends Check,
    This extends N extends number ? Type<Next<N>> : Type,
    Check extends string | number = N extends string ? keyof This['names'] & string : number
> =  N extends number ? This['arguments'][N] & This['constraints'][N]
    : This['arguments'][This['names'][N]] & This['constraints'][This['names'][N]];


/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `0` When no argument is supplied
*/
type A<This extends Type<1> = Default> =
    This['arguments'][0] & This['constraints'][0];

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `1` When no argument is supplied
*/
type B<This extends Type<2> = Default> =
    This['arguments'][1] & This['constraints'][1];

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `2` When no argument is supplied
*/
type C<This extends Type<3> = Default> =
    This['arguments'][2] & This['constraints'][2];

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `3` When no argument is supplied
*/
type D<This extends Type<4> = Default> =
    This['arguments'][3] & This['constraints'][3];

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `4` When no argument is supplied
*/
type E<This extends Type<5> = Default> =
    This['arguments'][4] & This['constraints'][4];