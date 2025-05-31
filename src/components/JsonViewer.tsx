import {FC, useCallback, useMemo} from "react";
import {Virtuoso} from "react-virtuoso";
import {useAppContext} from "../context.tsx";
import {JSeparator, JType, JValue} from "./types.ts";
import {DownOutlined, RightOutlined} from "@ant-design/icons";
import {Typography} from "antd";
import {cn} from "../utils/tailwindcss.ts";


export const calcExpand = (expandKeys: Map<number, boolean>, node: JValue): boolean => {
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


const hasComma = (items: JValue[], i: number) => {
    const node = items[i];
    const notLast = (() => {
        return items[i + 1] !== undefined && items[i + 1].separator === undefined;
    })();
    const blockTypes = [JType.Object, JType.Array];
    return blockTypes.includes(node.parent?.type || JType.Unknown) && notLast
}

export const JsonViewer: FC = () => {

    const {jValues, showDepth, expandKeys, treeRef} = useAppContext();

    const renderItems = useMemo(() => {
        const items = jValues.filter(v => calcExpand(expandKeys, v));
        return items.map((v, i) => ({
            ...v,
            comma: hasComma(items, i)
        }))
    }, [jValues, showDepth, expandKeys]);

    // console.log('renderItems:', renderItems.map(v => ({
    //     id: v.id,
    //     name: v.name,
    //     separator: v.separator,
    //     comma: v.comma
    // })))

    return <Virtuoso<JValue>
        className={'h-full min-h-[300px] min-w-[500px]'}
        data={renderItems}
        ref={treeRef}
        itemContent={(_, node) => {
            return renderItem(node)
        }}
    />
}


const renderItem = (node: JValue) => {
    return <RenderItem node={node}/>
}

const prepareHoverParentStyle = (id: number | undefined) => {
    if (id === undefined) {
        return ''
    }
    return `   
        .n-${id} {
            color: #ff0000;
        }
    `
}

const prepareHoverBlockStyle = (id: number | undefined) => {
    if (id === undefined) {
        return ''
    }
    return `   
        .n-${id} {
            color: #ff0000;
        }
        .n-${id}.tree-indent-unit::before {
            border-inline-end: 1px dashed #ff0000;
        }
    `
}

const handleHoverEvent = (node: JValue) => {
    const style = document.createElement('style');
    style.setAttribute('s', 'bjv');
    const styles: string[] = []
    let parent = node.parent;
    while (parent) {
        styles.push(prepareHoverParentStyle(parent.id))
        parent = parent.parent
    }
    // if (BlockTypes.includes(node.type)) {
    //     styles.push(prepareHoverBlockStyle(node.id))
    // }
    if (node.separator) {
        styles.push(prepareHoverBlockStyle(node.parent?.id))
    }
    style.innerHTML = styles.join('\n');
    document.head.appendChild(style);
}

const handleIdentHoverEvent = (id: number | undefined) => {
    if (id === undefined) {
        return ''
    }
    const style = document.createElement('style');
    style.setAttribute('s', 'bjv');
    const styles: string[] = []
    styles.push(prepareHoverBlockStyle(id))
    style.innerHTML = styles.join('\n');
    document.head.appendChild(style);
}

const removeCustomStyles = () => {
    for (const child of document.head.children) {
        if (child.getAttribute('s') === 'bjv') {
            document.head.removeChild(child);
        }
    }
}


const RenderItem: FC<{
    node: JValue,
}> = ({node}) => {


    const indents = node.path.map((id) => (
        <div
            className={cn(
                'tree-indent-unit',
                `n-${id}`,
            )}
            style={{width: 24}}
            key={`${id}`}
            onMouseOver={() => handleIdentHoverEvent(id)}
            onMouseOut={() => removeCustomStyles()}
            onMouseLeave={() => removeCustomStyles()}
        />
    ));

    return <div
        className={cn(
            'h-[24px] w-full px-2 whitespace-nowrap overflow-hidden flex items-center',
            `n-${node.id}`,
        )}
        onMouseOver={() => {
            handleHoverEvent(node)
            handleIdentHoverEvent(node.parent?.id)
        }}
        onMouseOut={() => removeCustomStyles()}
        onMouseLeave={() => removeCustomStyles()}
    >
        {indents}
        <div className='h-full flex-1'>
            {node.separator !== undefined ? <RenderSeparator node={node} hasComma={node.comma}/> :
                <RenderValue node={node} hasComma={node.comma}/>}
        </div>
    </div>
}

const RenderSeparator: FC<{ node: JValue, hasComma?: boolean }> = ({node, hasComma}) => {
    switch (node.separator) {
        case JSeparator.ObjectEnd: {
            return <span className={cn(
                'ml-3',
                `n-${node.parent?.id}`,
            )}>{'}'}{hasComma && <span>,</span>}</span>
        }
        case JSeparator.ArrayEnd: {
            return <span className={cn(
                'ml-3',
                `n-${node.parent?.id}`,
            )}>{']'}{hasComma && <span>,</span>}</span>
        }
    }
    return ''
}


const RenderValue: FC<{
    node: JValue
    hasComma?: boolean,
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
                'flex flex-1 ml-2 items-center justify-between rounded hover:bg-amber-100',
                '[&:hover_.copy]:visible',
            )}>
            <div className='flex flex-1 '>
                <div className={'mr-2'}><RenderJName node={node}/></div>
                <RenderJValue node={node}/>
                {node.type !== JType.Object && node.type !== JType.Array && hasComma && <span>,</span>}
                {node.type === JType.Object &&
                    <ObjectStartSigns node={node} expanded={expanded} hasComma={hasComma}/>}
                {node.type === JType.Array &&
                    <ArrayStartSigns node={node} expanded={expanded} hasComma={hasComma}/>}
            </div>
            <div className={cn(
                'flex items-center gap-2 text-gray-400',
            )}>
                {node.children && <span>{node.children.length} items</span>}
                {node.elems && <span>{node.elems.length} items</span>}
                <span className='copy invisible'>
                    <Typography.Text className={cn(
                        '[&_.anticon-copy]:!text-gray-400'
                    )} copyable={{
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
    hasComma?: boolean,
}> = ({node, expanded, hasComma}) => {
    if (expanded) {
        return <span>{'{'}</span>
    }
    if (node.children!.length === 0) {
        return <div>{'{}'}{hasComma && <span>,</span>}</div>
    }
    return <div>{'{ ... }'}{hasComma && <span>,</span>}</div>
}

const ArrayStartSigns: FC<{
    node: JValue,
    expanded: boolean,
    hasComma?: boolean,
}> = ({node, expanded, hasComma}) => {
    if (expanded) {
        return <span>{'['}</span>
    }
    if (node.elems!.length === 0) {
        return <div>{'[]'}{hasComma && <span>,</span>}</div>
    }
    return <div>{'[ ... ]'}{hasComma && <span>,</span>}</div>
}