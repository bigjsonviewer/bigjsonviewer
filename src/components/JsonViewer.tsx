import {FC} from "react";
import {Virtuoso} from "react-virtuoso";
import {cn} from "../lib/utils.ts";
import {useAppContext} from "../context.tsx";
import {JType, JValue} from "./types.ts";
import {CaretRightOutlined, RightOutlined} from "@ant-design/icons";


export const JsonViewer: FC = () => {

    const {jValues} = useAppContext();


    return <Virtuoso<JValue>
        className={'h-full min-h-[300px] min-w-[500px]'}
        data={jValues}
        itemContent={(_, node) => renderItem(node)}
    />
}


const renderItem = (node: JValue) => {

    const indents = Array(node.depth)
        .fill(0)
        .map((_, index) => (
            <div
                className="tree-indent-unit"
                style={{width: 24}}
                key={`${index}`}
            />
        ));

    return <div className={cn(
        'h-[45px] w-full whitespace-nowrap overflow-hidden flex items-center',
    )}
    >
        {indents}
        <div className='flex flex-1 justify-between pr-2'>
            <div className='flex gap-3'>
                {[JType.Object, JType.Array].includes(node.type) && <span><RightOutlined/> </span>}
                {node.name && <span>{node.name}: </span>}
                {node.value as string && <span>{node.value as string}</span>}
                {node.type === JType.Object && <span>{'{'}</span>}
                {node.type === JType.Array && <span>{'['}</span>}
            </div>
            <div>
                {node.children && <span>{node.children.length} fields</span>}
                {node.elems && <span>{node.elems.length} elems</span>}
            </div>
        </div>
    </div>
}
