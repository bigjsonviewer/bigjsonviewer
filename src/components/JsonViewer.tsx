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

        itemContent={(_, node) => {
            return renderItem(jValues, node)
        }}
    />
}


const renderItem = (jValues: JValue[], node: JValue) => {


    const indents = Array(node.separator ? node.depth - 1 : node.depth)
        .fill(0)
        .map((_, index) => (
            <div
                className="tree-indent-unit"
                style={{width: 24}}
                key={`${index}`}
            />
        ));

    const hasComma = (() => {

        const notLast = (() => {
            return jValues[node.id + 1] !== undefined && jValues[node.id + 1].separator === undefined;
        })();

        const blockTypes = [JType.Object, JType.Array];
        if (blockTypes.includes(node.type)) {
            return node.separator !== undefined && notLast
        }
        return blockTypes.includes(node.parent?.type || JType.Unknown) && notLast
    })()

    return <div className={cn(
        'h-[35px] w-full whitespace-nowrap overflow-hidden flex items-center',
    )}
    >
        {indents}
        <div className='h-full flex-1'>
            {node.separator !== undefined ? <RenderSeparator node={node} hasComma={hasComma}/> :
                <RenderValue node={node} hasComma={hasComma}/>}
        </div>
    </div>
}

const RenderSeparator: FC<{ node: JValue, hasComma: boolean }> = ({node, hasComma}) => {
    switch (node.separator) {
        case JSeparator.ObjectEnd: {
            return <span className='ml-3'>{'}'}{hasComma && <span>,</span>}</span>
        }
        case JSeparator.ArrayEnd: {
            return <span className='ml-3'>{']'}{hasComma && <span>,</span>}</span>
        }
    }
    return ''
}


const RenderValue: FC<{
    node: JValue
    hasComma: boolean,
}> = ({node, hasComma}) => {
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
            <div className='flex flex-1 '>
                <div className={'mr-2'}><RenderJName node={node}/></div>
                <RenderJValue node={node}/>
                {node.type !== JType.Object && node.type !== JType.Array && hasComma && <span>,</span>}
                {node.type === JType.Object &&
                    <ObjectStartSigns toggle={toggle} node={node} expanded={expanded} hasComma={hasComma}/>}
                {node.type === JType.Array &&
                    <ArrayStartSigns toggle={toggle} node={node} expanded={expanded} hasComma={hasComma}/>}
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
        return <div>
            {'"'}<span dangerouslySetInnerHTML={{
            __html: node.searchName
        }}/>{'"'}:
        </div>
    }
    if (node.name) {
        return <div>
            {`"${node.name}"`}:
        </div>
    }
    return <></>
}

const RenderJValue: FC<{ node: JValue }> = ({node}) => {

    switch (node.type) {
        case JType.String: {
            return <RenderJString node={node}/>
        }
        case JType.Number: {
            return <RenderJNumber node={node}/>
        }
        case JType.Boolean: {
            return <RenderJBool node={node}/>
        }
        case JType.Null: {
            return <RenderJNull node={node}/>
        }
    }

    if (node.searchValue) {
        return <div dangerouslySetInnerHTML={{
            __html: node.searchValue
        }}/>
    }
    return <div>
        {node.value}
    </div>
}

const RenderJString: FC<{ node: JValue }> = ({node}) => {
    if (node.searchValue) {
        return <div className='string'>
            {'"'}<span dangerouslySetInnerHTML={{
            __html: node.searchValue
        }}/>{'"'}
        </div>
    }
    return <div className='string'>
        {`"${node.value}"`}
    </div>
}

const RenderJNumber: FC<{ node: JValue }> = ({node}) => {
    if (node.searchValue) {
        return <div className="number" dangerouslySetInnerHTML={{
            __html: node.searchValue
        }}/>
    }
    return <div className="number">
        {node.value}
    </div>
}

const RenderJBool: FC<{ node: JValue }> = ({node}) => {
    if (node.searchValue) {
        return <div className="boolean" dangerouslySetInnerHTML={{
            __html: node.searchValue
        }}/>
    }
    return <div className="boolean">
        {node.value}
    </div>
}

const RenderJNull: FC<{ node: JValue }> = ({node}) => {
    if (node.searchValue) {
        return <div className="null" dangerouslySetInnerHTML={{
            __html: node.searchValue
        }}/>
    }
    return <div className="null">
        {node.value}
    </div>
}


const ObjectStartSigns: FC<{
    node: JValue,
    expanded: boolean,
    toggle: (node: JValue) => void,
    hasComma: boolean,
}> = ({node, expanded, toggle, hasComma}) => {
    if (expanded) {
        return <span>{'{'}</span>
    }
    if (node.children!.length === 0) {
        return <Tag className='cursor-pointer' onClick={() => {
            toggle(node)
        }}>{'{}'}{hasComma && <span>,</span>}</Tag>
    }
    return <Tag className='cursor-pointer' onClick={() => {
        toggle(node)
    }}>{'{...}'}{hasComma ? <span>,</span> : '?'}</Tag>
}

const ArrayStartSigns: FC<{
    node: JValue,
    expanded: boolean,
    toggle: (node: JValue) => void,
    hasComma: boolean,
}> = ({node, expanded, toggle, hasComma}) => {
    if (expanded) {
        return <span>{'['}</span>
    }
    if (node.elems!.length === 0) {
        return <Tag className='cursor-pointer' onClick={() => {
            toggle(node)
        }}>{'[]'}{hasComma && <span>,</span>}</Tag>
    }
    return <Tag className='cursor-pointer' onClick={() => {
        toggle(node)
    }}>{'[...]'}{hasComma && <span>,</span>}</Tag>
}