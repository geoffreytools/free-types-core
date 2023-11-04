import { Type } from './Type'

export { Const, $Const };

/**
 * Turn a type `T` into a constant `Type<❋, T>`, totally ignoring arity and type constraints on its input.
*/
type Const<T> = ConstantType<{
    type: T
}, {
    constraints: any,
    names: any
}>

interface ConstantType<Out extends { type: any }, __> {
    [k: number]: any
    type: Out['type']
    arguments: any[] & { length: any }
    namedConstraints: any
    arg: any
    constraints: any
    names: any
    contra: any
}

/**
 * Turn the input into a constant `Type<❋, T>`, totally ignoring arity and type constraints on its input.
*/
interface $Const extends Type<1> { type: Const<this[0]> }
