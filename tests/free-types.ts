import { test } from 'ts-spec';
import { apply, free, partialRight } from '../src'

type URL = 'https://foo'
type Response = { foo: number } 

type $Command = partialRight<free.UnaryFunction, [void]>;
type CommandResult = (a: "https://foo") => void;

type $Query = free.UnaryFunction;
type QueryResult =  (a: "https://foo") => { foo: number };

test('UnaryFunction', t => [
    t.equal<apply<$Query, [URL, Response]>, QueryResult>(),
    t.equal<apply<$Command, [URL]>, CommandResult>()
])

test('free', t => [
    t.equal<apply<free.Id, [1]>, 1>(),
    t.equal<apply<free.Tuple, [1]>, [1]>(),
    
    t.equal<apply<free.Array, [1]>, Array<1>>(),
    t.equal<apply<free.ReadonlyArray, [1]>, ReadonlyArray<1>>(),
    t.equal<apply<free.Set, [1]>, Set<1>>(),
    t.equal<apply<free.ReadonlySet, [1]>, ReadonlySet<1>>(),
    t.equal<apply<free.Promise, [1]>, Promise<1>>(),

    t.equal<apply<free.Map, [1, 2]>, Map<1, 2>>(),
    t.equal<apply<free.Record, [1, 2]>, Record<1, 2>>(),
    t.equal<apply<free.ReadonlyMap, [1, 2]>, ReadonlyMap<1, 2>>(),
    t.equal<apply<free.WeakMap, [object, 2]>, WeakMap<object, 2>>(),
])
