import { Type } from './Type';
import { apply } from './apply';

export { inferArgs };

type inferArgs<T, $T extends Type> =
    T extends apply<$T, [
        infer A, infer B, infer C, infer D, infer E,
        infer F, infer G, infer H, infer I, infer J
    ]> ? Extract<[A, B, C, D, E, F, G, H, I, J]>[$T['constraints']['length']] 
    : never

interface Extract<T extends unknown[]> {
    [k: number]: unknown[]
    0: []
    1: [T[0]]
    2: [T[0], T[1]]
    3: [T[0], T[1], T[2]]
    4: [T[0], T[1], T[2], T[3]]
    5: [T[0], T[1], T[2], T[3], T[4]]
    6: [T[0], T[1], T[2], T[3], T[4], T[5]]
    7: [T[0], T[1], T[2], T[3], T[4], T[5], T[6]]
    8: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7]]
    9: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8]]
    10: [T[0], T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9]]
}