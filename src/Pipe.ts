import { Next } from "./utils";

import { _apply, apply, _Type as Type } from './apply'
type _Type<C = any> = { type: any, constraints: C }

type TooManyArgs = 'You can compose up to 10 free types with Pipe'
type WrongArg = 'would be called with wrong argument'

/** Pipe an arguments list or named arguments through a composition of free types
 * ```
 * type Foo = Pipe<[1, 2], $Add, $Next, $Exclaim> // "4!"
 * ```
 * ---
 * **Note**: Error messages are narrower than they need to be:
 * ```
 * Pipe<['foo'], $Exclain, $Next>
 * //                      ~~~~~
 * // Type<[number], number>' does not satisfy the constraint 'Type<["foo!"], number>
 * ```
 * Understand it as `Type<[number], number>` would be called with wrong argument `"foo!"`. This inconvenience is required for generic higher order compositions to work properly.
 */
export type Pipe<
    Args extends [STOP] extends [never] ? Check : TooManyArgs,
    A extends Type = never,
    B extends _<B, WrongArg, RA> = never,
    C extends _<C, WrongArg, RB> = never,
    D extends _<D, WrongArg, RC> = never,
    E extends _<E, WrongArg, RD> = never,
    F extends _<F, WrongArg, RE> = never,
    G extends _<G, WrongArg, RF> = never,
    H extends _<H, WrongArg, RG> = never,
    I extends _<I, WrongArg, RH> = never,
    J extends _<J, WrongArg, RI> = never,
    STOP = never,
    RA = apply<A, Args, any>,
    RB = _apply<B, [RA]>,
    RC = _apply<C, [RB]>,
    RD = _apply<D, [RC]>,
    RE = _apply<E, [RD]>,
    RF = _apply<F, [RE]>,
    RG = _apply<G, [RF]>,
    RH = _apply<H, [RG]>,
    RI = _apply<I, [RH]>,
    RJ = _apply<J, [RI]>,
    Check = Args extends readonly unknown[] ? A['constraints']: A['namedConstraints']
> = Result<[RA, RB, RC, RD, RE, RF, RG, RH, RI, RJ]>;

type Result<T extends unknown[], I extends number = 0, R = never> =
     [T[I]] extends [never] ? R
    : I extends T['length'] ? R
    : Result<T, Next<I>, T[I]>

type _<$T extends _Type, _, $U> = [$U] extends $T['constraints'] ? any : _Type<[$U]>;
