import { unwrap, Unwrapped, Search } from './unwrap'
import { _apply } from './apply';

import { TypesMap } from './TypesMap';

export { Replace }

/** Replace the inner value of a type with compatible arguments.
 * 
 *  Can be used to constrain the inner value of a type
 */
type Replace<
    T,
    Args extends U['type']['constraints'],
    From extends Search = TypesMap,
    U extends Unwrapped = unwrap<T, From>
> = _apply<U['type'], Args>