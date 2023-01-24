import { Tuple } from './utils';

export { Type };

/** Extend `Type<Input?, Output?>` with an interface to produce a free type, or use it as a type constraint.*/

type Type<Input extends number | unknown[] = unknown[], Output = unknown> =
    CreateType<{
        type: Output
        constraints: Constraints<Input, Slots<Input>>
        arguments: unknown[]
    }>

interface CreateType<T extends { type: unknown; constraints: unknown[] }> {
    [k: number]: unknown
    type: T['type'];
    constraints: T['constraints'];
    arguments: unknown[];
}

type Slots<T> = T extends Precomputable
    ? PrecomputedSlots[T & Precomputable]
    : Tuple<T extends unknown[] ? T['length'] : T extends number ? T : number>;

type Constraints<Input, Slots> =
    number extends Input ? unknown[]
    : unknown[] extends Input ? unknown[]
    : Input extends unknown[] ? Input
    : Slots

type PrecomputedSlots = { [I in Precomputable]: Tuple<Seq10[I]> }
type Precomputable = Seq10[number];
type Seq10 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];