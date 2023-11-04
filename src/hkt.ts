import { _Type } from "./apply";

export { HKT, Contra, Expect }

/** Interfaces extending this type are able to use `hkt` internally. */
type HKT = { HKT: [any, ...any[]] };

/** Expect a free type with contravariant arguments
 * @deprecated use `Expect` instead
 * */
type Contra<$T, $U extends _Type> = _Contra<Extract<$T, _Type>, $U>

type _Contra<$T extends _Type, $U extends _Type> =
    $U['constraints'] extends $T['constraints']
        ? $T['type'] extends $U['type']
            ? _Type
            : _Type<$T['constraints'], $U['type']>
        : _Type<[$U['constraints'], 'is not assignable to', $T['constraints']]>

type Expect<$T, Active extends boolean = true> = Active extends false ? $T : {
    [K in keyof $T]: K extends CovariantKey ? any : $T[K]
}

type CovariantKey = 'namedConstraints' | 'constraints' | 'arg' | 'names'