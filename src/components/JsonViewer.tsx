import {FC, useEffect, useRef} from "react";
import {useAppContext} from "../context.tsx";
import {JType, JValue} from "./types.ts";
import {ListTable} from '@visactor/vtable';
import type {ListTableConstructorOptions} from "@visactor/vtable/es/ts-types";

// const records = [
//     {
//         group: 'CA-2018-156720'
//     },
//     {
//         group: 'CA-2018-115427'
//     },
// ];

const columns = [
    {
        field: 'name',
        title: 'Name',
        width: 'auto',
        tree: true,
        fieldFormat(item: JValue) {
            if (item.name) {
                return item.name;
            }

            if (item.type === JType.Object) {
                return 'Object'
            }

            if (item.type === JType.Array) {
                return 'array'
            }

            return 'Unknown';
        }
    }
];


export const JsonViewer: FC = () => {

    const {jValues, showDepth, foldKeys, treeRef, setFoldKeys} = useAppContext();

    console.log('jValues: 0', jValues[0]);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) {
            return
        }
        const option: ListTableConstructorOptions = {
            records: [jValues[0]],
            columns,
            widthMode: 'standard',
            hierarchyExpandLevel: showDepth
        };
        new ListTable(ref.current, option);
    }, [showDepth, jValues])

    return <div ref={ref} className={'w-full h-full bg-yellow-100'}></div>
}
