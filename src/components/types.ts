export enum JType {
    Null,
    Object,
    Array,
    String,
    Number,
    Boolean,
    Unknown,
}

export enum JSeparator {
    ObjectEnd,
    ArrayEnd,
}

export type JValue = {
    name?: string;
    type: JType;
    repeated?: boolean;
    value?: unknown;
    children?: JValue[];
    elems?: JValue[];
    raw: unknown;
    depth: number;
    parent?: JValue;
    separator?: JSeparator;
}

export const walkValue = (parent: JValue | undefined, obj: unknown, depth: number, list: JValue[]): JValue => {
    const v: JValue = {
        parent,
        depth,
        type: checkType(obj),
        raw: obj,
    }
    list.push(v);

    switch (v.type) {
        case JType.Object: {
            v.children = []
            for (const key in obj as object) {
                const vv = walkValue(v, (obj as Record<string, unknown>)[key], depth + 1, list);
                vv.name = key;
                v.children.push(vv);
            }
            const separator = {
                ...v,
                separator: JSeparator.ObjectEnd,
            }
            list.push(separator)
            break
        }
        case JType.Array: {
            v.repeated = true;
            v.elems = [];
            (obj as unknown[]).forEach((item: unknown) => {
                const vv = walkValue(v, item, depth + 1, list);
                v.elems!.push(vv);
            })
            const separator = {
                ...v,
                separator: JSeparator.ArrayEnd,
            }
            list.push(separator)
            break
        }
        case JType.String:
        case JType.Number:
        case JType.Boolean:
        case JType.Null: {
            v.value = obj;
            break
        }
    }
    return v;
}


const checkType = (value: unknown): JType => {
    if (value === null) {
        return JType.Null
    }
    if (Array.isArray(value)) {
        return JType.Array
    }
    if (typeof value === 'object') {
        return JType.Object
    }
    if (typeof value === 'string') {
        return JType.String
    }
    if (typeof value === 'number') {
        return JType.Number
    }
    if (typeof value === 'boolean') {
        return JType.Boolean
    }
    return JType.Unknown
}



