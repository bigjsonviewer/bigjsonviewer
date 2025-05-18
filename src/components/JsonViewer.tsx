import {FC, useContext, useEffect, useMemo, useState} from "react";
import {Virtuoso} from "react-virtuoso";
// import {AppContext} from "../context.tsx";
// import {Message} from "@arco-design/web-react";
import {cn} from "../lib/utils.ts";
import data from './result.json';
import {AppContext} from "../context.tsx";

// type DataNode = {
//     key: string;
//     type: number;
//     data: unknown;
//     children?: DataNode[];
// }


export const JsonViewer: FC = () => {
    const {jsonRaw} = useContext(AppContext);
    return <pre>
        {jsonRaw}
    </pre>
    // const [renderData, setRenderData] = useState<DataNode[]>([]);
    // useEffect(() => {
    //     if (!jsonRaw) {
    //         return
    //     }
    //     try {
    //         const obj = JSON.parse(jsonRaw);
    //         const res = jsonToFlattenDataNodes(obj);
    //         setRenderData(res)
    //         console.log('renderData:', res)
    //     } catch {
    //         Message.error('parse json error')
    //     }
    // }, [jsonRaw]);

    // const steps: {
    //     pc: number,
    //     op: number,
    // }[] = (data as {
    //     steps: {
    //         pc: number,
    //         op: number,
    //     }[]
    // }).steps;
    //
    //
    //
    // return <Virtuoso
    //     className={'h-full'}
    //     data={steps}
    //     itemContent={(_, node) => (
    //         <div className={cn(
    //             'h-[45px] whitespace-nowrap overflow-hidden',
    //         )}>
    //             {node.pc} - {JSON.stringify(node.op)}
    //         </div>
    //     )}
    // />
}