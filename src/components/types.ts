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
    ObjectEnd = 1,
    ArrayEnd,
}

export type JValue = {
    id: number;
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

const addSeparator = (list: JValue[], node: JValue, separator: JSeparator) => {
    list.push({
        ...node,
        separator,
        id: list.length + 1,
        depth: node.depth + 1,
        parent: node,
    })
    return
}
export const walkValue = (parent: JValue | undefined, obj: unknown, depth: number, list: JValue[]): JValue => {
    const v: JValue = {
        id: list.length + 1,
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
            addSeparator(list, v, JSeparator.ObjectEnd)
            break
        }
        case JType.Array: {
            v.repeated = true;
            v.elems = [];
            (obj as unknown[]).forEach((item: unknown) => {
                const vv = walkValue(v, item, depth + 1, list);
                v.elems!.push(vv);
            })
            addSeparator(list, v, JSeparator.ArrayEnd)
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



