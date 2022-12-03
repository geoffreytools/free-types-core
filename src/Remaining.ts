import { Type } from './Type';
import { Slice, Subtract } from './utils';

export { Remaining };

/** Use as a type constraint to match a Type whose state of application is known */
type Remaining<
    T extends Type,
    R extends number,
> = unknown[] extends T['constraints'] ? Type : Type<Slice<
    T['constraints'],
    Subtract<T['constraints']['length'], R>,
    T['constraints']['length']>,
    T['type']
>;