import { Slice, Type, apply} from '../src'

type $Model = Type<[string, number]>;

// $T['constraints'] has statically known length
interface $Foo<$T extends $Model> extends Type<$T['constraints']> {}

// `type` is statically accessible for type checking
interface $Bar<N extends number, $T extends Type>
    extends Type<Slice<$T['constraints'], 0, N>>
        { type: unknown }

// this['arguments'] is interpreted as an array
interface $Baz<$T extends $Model> extends Type<$T['constraints']> {
    type: this['arguments'] extends $T['constraints']
        ? apply<$Model, this['arguments']>
        : never
}

// this['arguments'] extends [...] is interpreted as an array
interface $Constrain<$T extends Type>
    extends Type<$T['constraints']> {
        type: apply<$T,
            this['arguments'] extends $T['constraints']
            ? this['arguments'] : this['constraints']
        >
    }