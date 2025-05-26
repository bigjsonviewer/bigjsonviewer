import {FC, useMemo} from "react";
import {Virtuoso} from "react-virtuoso";
import {cn} from "../lib/utils.ts";
import {useAppContext} from "../context.tsx";
import {JSeparator, JType, JValue} from "./types.ts";
import {RightOutlined} from "@ant-design/icons";


export const JsonViewer: FC = () => {

    const {jValues, showDepth} = useAppContext();

    const renderItems = useMemo(() => {
        return jValues.filter(v => showDepth === -1 || v.depth <= showDepth);
    }, [jValues, showDepth])

    return <Virtuoso<JValue>
        className={'h-full min-h-[300px] min-w-[500px]'}
        data={renderItems}
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
            {node.separator !== undefined ? <RenderSeparator node={node}/> : <RenderValue node={node}/>}
        </div>
    </div>
}

const RenderSeparator: FC<{ node: JValue }> = ({node}) => {
    switch (node.separator) {
        case JSeparator.ObjectEnd: {
            return <span>{'}'}</span>
        }
        case JSeparator.ArrayEnd: {
            return <span>{']'}</span>
        }
    }
    return ''
}


const RenderValue: FC<{
    node: JValue
}> = ({node}) => {
    return <>
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
    </>
}