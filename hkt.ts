import { Type } from "./Type";

export { HKT, Contra }

/** Interfaces extending this type are able to use `hkt` internally. */
type HKT = { HKT: [any, ...any[]] };

/** Expect a free type with contravariant arguments */
type Contra<$T extends Type, $U extends Type> =
    $U['constraints'] extends $T['constraints']
    ? $T['type'] extends $U['type']
        ? Type
        : Type<$T['constraints'], $U['type']>
    :  {
        'Contravariance issue': {
            'the input': $U['constraints'], 'is not assignable to': $T['constraints']
        }
};