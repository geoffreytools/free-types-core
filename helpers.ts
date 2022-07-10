import { Next, IsUnknown, Fork, Prev } from './utils'

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

/** safely index `this`
*/
type At<
    N extends number & keyof This['constraints'],
    This extends Type<Next<N>>,
    Fallback = unknown
> = Fork<IsUnknown<This['arguments'][N]>, Fallback, This['arguments'][N]>

/** safely index `this` and defuse the corresponding type constraint with an inline conditional
 */
type Checked<
    N extends number & keyof This['constraints'],
    This extends Type<Next<N>>,
    Fallback = This['constraints'][N]
> = This['arguments'][N] extends This['constraints'][N] ? This['arguments'][N] : Fallback;

/** safely index `this` and intersect the corresponding type constraint
 */
type Lossy<
    N extends number & keyof This['constraints'],
    This extends Type<Next<N>>
> = This['arguments'][N] & This['constraints'][N];

/** safely index `this` and intersect the corresponding type constraint
 * equals `0` When no argument is supplied
*/
type A<This extends Type<1> = Default> =
    This['arguments'][0] & This['constraints'][0];

/** safely index `this` and intersect the corresponding type constraint
 * equals `1` When no argument is supplied
*/
type B<This extends Type<2> = Default> =
    This['arguments'][1] & This['constraints'][1];

/** safely index `this` and intersect the corresponding type constraint
 * equals `2` When no argument is supplied
*/
type C<This extends Type<3> = Default> =
    This['arguments'][2] & This['constraints'][2];

/** safely index `this` and intersect the corresponding type constraint
 * equals `3` When no argument is supplied
*/
type D<This extends Type<4> = Default> =
    This['arguments'][3] & This['constraints'][3];

/** safely index `this` and intersect the corresponding type constraint
 * equals `4` When no argument is supplied
*/
type E<This extends Type<5> = Default> =
    This['arguments'][4] & This['constraints'][4];