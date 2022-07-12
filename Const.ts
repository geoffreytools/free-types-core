import { Type } from './Type'

export { Const, $Const };

/**
 * Turn a type `T` into a constant `Type<❋, T>`, totally ignoring arity and type constraints on its input.
*/
type Const<T> = {
    type: T
    constraints: any
    arguments: any[] & { length: any },
    0: any
    1: any
    2: any
    3: any
    4: any
    5: any
    6: any
    7: any
    8: any
    9: any
}

/**
 * Turn the input into a constant `Type<❋, T>`, totally ignoring arity and type constraints on its input.
*/
interface $Const extends Type<1> { type: Const<this[0]> }
