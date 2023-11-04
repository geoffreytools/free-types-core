import { Const } from "./Const";
import { _apply } from "./apply";
import { Next, ArrayLike } from "./utils";
import { Contra, NamedConstraints } from "./Type";

type Type = { type: any, constraints: any, names: any, arg: any };
type Unconstrained = {[k: number]: unknown};

export type $Before<
    $T extends Type,
    $P extends ContraIndex<$P, $T, I>,
    I extends number = never
> = [I] extends [never] ? $BeforeN<$T, $P> : $BeforeI<$T, $P, I>

interface $BeforeI<
    $T extends Type,
    $P extends Type,
    I extends number,
    Constraints extends Unconstrained = ReplaceAt<$T['constraints'], I, Const<$P['constraints'][0]>>
> extends $Type<$T> {
    type: _apply<$T, ReplaceAt<this['arguments'], I, $P>>
    constraints: Constraints
    contra: Contra<Constraints>
    namedConstraints: NamedConstraints<this>
}

interface $BeforeN<
    $T extends Type,
    $P extends Type,
    Constraints extends Unconstrained = $T['constraints'] extends infer I extends unknown[] ? {
        [K in keyof I]: $P['constraints'][0]
    } : unknown[]
> extends $Type<$T> {
    type: _apply<$T, this['arguments'] extends (infer I extends ArrayLike) & unknown[] ? {
        [K in keyof I] : _apply<$P, [I[K]]>
    } : ArrayLike>
    constraints: Constraints
    contra: Contra<Constraints>
    namedConstraints: NamedConstraints<this>
}

interface $Type<$T extends Type> {
    [k: number]: unknown
    names: $T['names']
    arg: $T['arg']
    arguments: unknown[]
}

type ContraIndex<
    $T extends Type,
    M extends Type,
    I extends number,
    Model = [I] extends [never] ? M['constraints'][number] : M['constraints'][I]
> = [Model] extends $T['constraints']
    ? { constraints: any[], type: Model, names: any, arg: any }
    : { constraints: [Model], type: Model, names: any, arg: any };

type ReplaceAt<
    T extends {[k: number]: unknown, length: number},
    N extends number,
    $P extends Type,
    L extends number = T['length'],
    I extends number = 0,
    R extends unknown[] = []
> = I extends L ? R
    : ReplaceAt<T, N, $P, L, Next<I>, [...R, I extends N ? _apply<$P, [T[I]]> : T[I]]>;