export { TypeDoc }

type Type = { type: any, constraints: any, names: any};

type TypeDoc<$T extends Type> = CreateType<{
    type: $T['type']
},{
    constraints: $T['constraints']
    names: $T['names']
}, $T>

/** @ts-ignore: Nasty hack */
interface CreateType<_, __, $T extends {}> extends $T {}
