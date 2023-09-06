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