import {FC, useCallback, useMemo} from "react";
import {Virtuoso} from "react-virtuoso";
import {cn} from "../lib/utils.ts";
import {useAppContext} from "../context.tsx";
import {JSeparator, JType, JValue} from "./types.ts";
import {DownOutlined, RightOutlined} from "@ant-design/icons";
import {Tag, Typography} from "antd";


const calcExpand = (expandKeys: Map<number, boolean>, node: JValue): boolean => {
    let expand = true;
    let parent = node.parent;
    while (parent) {
        if (!expandKeys.get(parent.id)) {
            expand = false;
            break;
        }
        parent = parent.parent;
    }
    return expand
}

export const JsonViewer: FC = () => {

    const {jValues, showDepth, expandKeys} = useAppContext();


    const renderItems = useMemo(() => {
        return jValues.filter(v => calcExpand(expandKeys, v));
    }, [jValues, showDepth, expandKeys])

    return <Virtuoso<JValue>
        className={'h-full min-h-[300px] min-w-[500px]'}
        data={renderItems}

        itemContent={(_, node) => renderItem(node)}
    />
}


const renderItem = (node: JValue) => {

    const indents = Array(node.separator ? node.depth - 1 : node.depth)
        .fill(0)
        .map((_, index) => (
            <div
                className="tree-indent-unit"
                style={{width: 24}}
                key={`${index}`}
            />
        ));

    return <div className={cn(
        'h-[35px] w-full whitespace-nowrap overflow-hidden flex items-center',
    )}
    >
        {indents}
        <div className='h-full flex-1'>
            {node.separator !== undefined ? <RenderSeparator node={node}/> : <RenderValue node={node}/>}
        </div>
    </div>
}

const RenderSeparator: FC<{ node: JValue }> = ({node}) => {
    switch (node.separator) {
        case JSeparator.ObjectEnd: {
            return <span className='ml-3'>{'}'}</span>
        }
        case JSeparator.ArrayEnd: {
            return <span className='ml-3'>{']'}</span>
        }
    }
    return ''
}


const RenderValue: FC<{
    node: JValue
}> = ({node}) => {
    const {expandKeys, setExpandKeys, showDepth} = useAppContext();

    const expanded = !!expandKeys.get(node.id);

    const toggle = useCallback((node: JValue) => {
        setExpandKeys(prev => {
            if (prev.get(node.id)) {
                prev.set(node.id, false)
            } else {
                prev.set(node.id, true)
            }
            return new Map<number, boolean>(prev);
        })
    }, [setExpandKeys, showDepth])

    return <div className='h-full flex flex-1 items-center'>
        {[JType.Object, JType.Array].includes(node.type) && <div className='cursor-pointer' onClick={() => {
            toggle(node);
        }}>{expanded ? <DownOutlined/> : <RightOutlined/>}</div>}
        <div
            className={cn(
                'h-full flex flex-1 ml-2 px-2 items-center justify-between border rounded border-transparent hover:border-blue-400',
                '[&:hover_.copy]:visible',
            )}>
            <div className='flex flex-1 gap-3 '>
                <RenderJName node={node}/>
                <RenderJValue node={node}/>
                {node.type === JType.Object && <ObjectStartSigns toggle={toggle} node={node} expanded={expanded}/>}
                {node.type === JType.Array && <ArrayStartSigns toggle={toggle} node={node} expanded={expanded}/>}
            </div>
            <div className={cn(
                'flex items-center gap-2',
            )}>
                {node.children && <span>{node.children.length} items</span>}
                {node.elems && <span>{node.elems.length} items</span>}
                <span className='copy invisible'>
                    <Typography.Text copyable={{
                        text: () => JSON.stringify(node.raw, null, 2)
                    }}/>
                </span>
            </div>
        </div>
    </div>
}

const RenderJName: FC<{ node: JValue }> = ({node}) => {
    if (node.searchName) {
        return <div dangerouslySetInnerHTML={{
            __html: node.searchName
        }}/>
    }
    if (node.name) {
        return <div>
            {node.name}:
        </div>
    }
    return <></>
}

const RenderJValue: FC<{ node: JValue }> = ({node}) => {
    if (node.searchValue) {
        return <div dangerouslySetInnerHTML={{
            __html: node.searchValue
        }}/>
    }
    if (node.value) {
        return <div>
            {node.value}
        </div>
    }
    return <></>
}

const ObjectStartSigns: FC<{
    node: JValue,
    expanded: boolean,
    toggle: (node: JValue) => void,
}> = ({node, expanded, toggle}) => {
    if (expanded) {
        return <span>{'{'}</span>
    }
    if (node.children!.length === 0) {
        return <Tag className='cursor-pointer' onClick={() => {
            toggle(node)

        }}>{'{}'}</Tag>
    }
    return <Tag className='cursor-pointer' onClick={() => {
        toggle(node)
    }}>{'{...}'}</Tag>
}

const ArrayStartSigns: FC<{
    node: JValue,
    expanded: boolean,
    toggle: (node: JValue) => void,
}> = ({node, expanded, toggle}) => {
    if (expanded) {
        return <span>{'['}</span>
    }
    if (node.elems!.length === 0) {
        return <Tag className='cursor-pointer' onClick={() => {
            toggle(node)
        }}>{'[]'}</Tag>
    }
    return <Tag className='cursor-pointer' onClick={() => {
        toggle(node)
    }}>{'[...]'}</Tag>
}