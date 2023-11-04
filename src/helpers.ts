import { Next, IsUnknown, Prev, OptionalKeys } from './utils'

export { Get, At, Checked, Lossy, Optional, A, B, C, D, E, Applied }

/** Fake `Type` for user friendly error messages */
interface Type<In extends number | Names> extends BaseType {
    arg: Constraints<In>
    constraints: Constraints<In>
    names: In extends number ? any : In
}

type Constraints<In> = In extends number ? { [K in Prev<In>]: unknown; } : any

/** Fake `Type` for user friendly error messages */
interface OptionalType<In extends number | Names> extends BaseType {
    constraints: Partial<Constraints<In>>
    names: In extends number ? any : In
}

/** fast Type definition */
interface BaseType {
    constraints: { [k: number]: unknown }
    arguments: { [k: number]: unknown; }
    names: Names
}

type Names = { [k: string]: number; }

type Normalise<Index extends string | number> =
    Index extends number ? Next<Index> : { [K in Index]: number; }


/** tell whether a Type is applied with all its arguments or not */
type Applied<This extends {arguments: any}> =
    unknown[] extends This['arguments'] ? false : true;

/** safely index `this` */
type Get<
    K extends keyof This['arg'],
    This extends {arg: any},
> = K extends OptionalKeys<This['arg']> ? Exclude<This['arg'][K], undefined> : This['arg'][K]

// type GetAll<This extends {arg: any}> =
//     ToTuple<Required<Parameters<This['arg']>[0]>>

/** - safely index `this`
 * - optionally take a fallback
*/
type At<
    Index extends string | number,
    This extends Type<Normalise<Index>>,
    Fallback = unknown,
    I extends number = Index extends number ? Index : This['names'][Index]
> = IsUnknown<This['arguments'][I]> extends true ? Fallback : This['arguments'][I]

/** - safely index `this`
 * - defuse the corresponding type constraint with an inline conditional
 * - optionally take a fallback
 */
type Checked<
    Index extends string | number,
    This extends Type<Normalise<Index>>,
    Fallback = Index extends number
        ? This['constraints'][Index]
        : This['constraints'][This['names'][Index]],
    I extends number = Index extends number ? Index : This['names'][Index]
> = This['arguments'][I] extends This['constraints'][I]
    ? This['arguments'][I]
    : Fallback;

/** - safely index `this`
 * - works on optional parameters
 * - defuse the corresponding type constraint with an inline conditional
 * - optionally take a fallback
 */
 type Optional<
    Index extends string | number,
    This extends OptionalType<Normalise<Index>>,
    Fallback = Index extends number
        ? Exclude<This['constraints'][Index], undefined>
        : Exclude<This['constraints'][This['names'][Index]], undefined>,
    I extends number = Index extends number ? Index : This['names'][Index]
> = This['arguments'][I] extends Exclude<This['constraints'][I], undefined>
    ? This['arguments'][I]
    : Fallback

/** - safely index `this`
 * - intersect the corresponding type constraint
 */
type Lossy<
    Index extends string | number,
    This extends Type<Normalise<Index>>,
    I extends number = Index extends number ? Index : This['names'][Index]
> =  This['arguments'][I] & This['constraints'][I]


interface NumericValue extends BaseType {
    constraints: any
    arg: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4 }
}

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `0` When no argument is supplied
*/
type A<This extends Type<1> = NumericValue> = Get<0, This>;

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `1` When no argument is supplied
*/
type B<This extends Type<2> = NumericValue> = Get<1, This>;

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `2` When no argument is supplied
*/
type C<This extends Type<3> = NumericValue> = Get<2, This>

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `3` When no argument is supplied
*/
type D<This extends Type<4> = NumericValue> = Get<3, This>

/** - safely index `this`
 * - intersect the corresponding type constraint
 * - equals `4` When no argument is supplied
*/
type E<This extends Type<5> = NumericValue> = Get<4, This>