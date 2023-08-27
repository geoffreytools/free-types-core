import { Tuple } from './utils';

export { Type };

/** Extend `Type<Input?, Output?>` with an interface to produce a free type, or use it as a type constraint.*/

type Type<Input extends number | unknown[] = unknown[], Output = unknown, Labels extends string[] = []> =
    CreateType<{
        type: Output
        constraints: Constraints<Input, Slots<Input>>
        arguments: unknown[],
        labels: ReverseMap<Labels>
    }>

interface CreateType<T extends { type: unknown; constraints: unknown[], labels: { [k: string]: number } }> {
    [k: number]: unknown
    type: T['type'];
    constraints: T['constraints'];
    arguments: unknown[];
    labels: T['labels']
}

type ReverseMap<T extends string[]> = {
    [K in keyof T as K extends `${number}` ? T[K] : never]:
        K extends `${infer I extends number}` ? I : never
};

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