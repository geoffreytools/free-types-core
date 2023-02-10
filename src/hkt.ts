import { Type } from "./Type";

export { HKT, Contra }

/** Interfaces extending this type are able to use `hkt` internally. */
type HKT = { HKT: [any, ...any[]] };

/** Expect a free type with contravariant arguments */
type Contra<$T, $U extends Type> = Type & _Contra<$T, $U>['type']

interface _Contra<$T, $U extends Type> {
    type: $U['constraints'] extends this['$T']['constraints']
    ? this['$T']['type'] extends $U['type']
        ? Type
        : Type<this['$T']['constraints'], $U['type']>
    :  {
        [K in 'Contravariance issue']: [
            'the input', $U['constraints'], 'is not assignable to', this['$T']['constraints']
        ]
    }
    $T: $T extends Type ? $T : never
}