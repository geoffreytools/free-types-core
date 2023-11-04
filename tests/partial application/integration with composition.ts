import { test } from 'ts-spec';
import { apply, partialRight, free, partial } from "../../src/";
import { Pipe, Flow } from '../../src/';

/** Control without partial application */
type C = [free.Promise, free.Array, free.Set];
type $C = Flow<C>;

/** Simple composition */
type S = [
    free.Promise,
    partialRight<free.Map, ['foo']>,
    free.Set
];
type $S = Flow<S>;

/** Intermediary composition */
type I = [
    free.Promise,
    partial<free.Function, [['foo']]>,
    free.Set
];
type $I = Flow<I>;

test('Flow compiles' as const, t => [
    t.not.never<Flow<C>>(),
    t.not.never<Flow<S>>(),
    t.not.never<Flow<I>>(),
])

test('partial with Pipe' as const, t => [
    t.equal<Pipe<[1], C[0], C[1], C[2]>, Set<Promise<1>[]>>(),
    t.equal<Pipe<[1], S[0], S[1], S[2]>, Set<Map<Promise<1>, "foo">>>(),
    t.equal<Pipe<[1], I[0], I[1], I[2]>, Set<(a: 'foo') => Promise<1>>>(),
])

test('partial with Flow' as const, t => [
    t.equal<apply<$C, [1]>, Set<Promise<1>[]>>(),
    t.equal<apply<$S, [1]>, Set<Map<Promise<1>, "foo">>>(),
    t.equal<apply<$I, [1]>, Set<(a: 'foo') => Promise<1>>>(),
])