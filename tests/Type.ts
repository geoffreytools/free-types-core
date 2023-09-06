import { test } from 'ts-spec';
import { Type } from '../src';

test('required positional parameters', t => [
    t.equal<
        Type<[number, unknown, string]>['constraints'],
        [number, unknown, string]
    >()
])

test('optional positional parameters', t => [
    t.equal<
        Type<[number, string?]>['constraints'],
        [number, string?]
    >(),
    t.equal<
        Type<{T: [0, number], U?: [1, string]}>['constraints'],
        [number, string?]
    >()
])

test('required named parameters', t => {
    type $T = Type<{T: [0, unknown], U: [1, unknown]}>;
    
    return t.force([
        t.equal<$T['names'], { T: 0, U: 1 }>(),
        t.equal<$T['constraints'], [unknown, unknown]>(),
    ])
})

test('optional named parameters', t => [
    t.equal<
        Type<{T: [0, number], U?: [1, string]}>['namedConstraints'],
        { T: number, U?: string }
    >(),
    t.equal<
        Type<{T: [0, number], U?: [1, string]}>['constraints'],
        [number, string?]
    >(),
    t.equal<
        Type<{T: [0, number], U?: [1, string]}>['names'],
        { T: 0, U: 1 }
    >()
])

type Unconstrained = { [k: number]: unknown }

test('shorthands', t => [
    test(t('variadic'), t => [
        t.equal<Type<number>['constraints'], Unconstrained>(),
        t.includes<Type<unknown[]>['constraints'], Unconstrained>(),
        t.includes<Type['constraints'], Unconstrained>()
    ]),

    test(t('arity'), t =>
        t.equal<Type<2>['constraints'], [unknown, unknown]>()
    ),

    test(t('sparse numeric keys'), t => [
        t.equal<
            Type<{ 1: number }>['constraints'],
            [unknown, number]
        >(),
        t.equal<
            Type<{ 0: number, 2: string }>['constraints'],
            [number, unknown, string]
        >(),
    ]),
    
    test(t('specified length'), t => t.equal<
        Type<{ 1: number, length: 4 }>['constraints'],
        [unknown, number, unknown, unknown]
    >()),
    
    test(t('tacit constraints'), t => {
        type $T = Type<{T: 0, U: 1 }>;
        
        return t.force([
            t.equal<$T['names'], { T: 0, U: 1 }>(),
            t.equal<$T['constraints'], [unknown, unknown]>(),
        ])
    })
])

test('constraint on the output', t => [
    t.equal<Type<1>['type'], unknown>(),
    t.equal<Type<1, string>['type'], string>(),
])
