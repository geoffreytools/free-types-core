import { Next, IsUnknown, Prev } from './utils'

export { At, Checked, Lossy, A, B, C, D, E }

// Fake `Type` for user friendly error messages
type Type<N extends number> = {
    constraints: { [K in Prev<N>]: unknown; }
    arguments: unknown[]
}

type Default = {
    constraints: [0,1,2,3,4]
    arguments: unknown[]
}

/** - safely index `this`
 * - optionally take a fallback
*/
type At<
    N extends number,
    This extends Type<Next<N>>,
    Fallback = unknown
> = IsUnknown<This['arguments'][N]> extends true ? Fallback
    : This['arguments'][N]

/** - safely index `this`
 * - defuse the corresponding type constraint with an inline conditional
 * - optionally take a fallback
 */
type Checked<
    N extends number,
    This extends Type<Next<N>>,
    Fallback = N extends keyof This['constraints'] ? This['constraints'][N] : never
> = N extends keyof This['constraints']
        ? This['arguments'][N] extends This['constraints'][N]
        ? This['arguments'][N]
        : Fallback
    : never;

/** - safely index `this`
 * - intersect the corresponding type constraint
 */
type Lossy<
    N extends number,
    This extends Type<Next<N>>
> =  N extends keyof This['constraints']
    ? This['arguments'][N] & This['constraints'][N]
    : never;

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