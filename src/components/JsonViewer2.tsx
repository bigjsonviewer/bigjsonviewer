import {isEmpty} from "lodash";
import {NodeApi, NodeRendererProps, Tree, TreeApi} from "react-arborist";
import {useRef} from "react";
import {useAppContext} from "../context.tsx";
import {JValue} from "./types.ts";
import {CaretDownOutlined, CaretRightOutlined} from "@ant-design/icons";


export const JsonViewer2 = () => {

    const {jValues} = useAppContext();
    const treeRef = useRef<TreeApi<JValue>>();

    // console.log(jValues)
    return <Tree
        className={'callTraceTree w-full h-full border border-black'}
        ref={treeRef}
        disableDrop
        rowHeight={32}
        indent={24}
        width={1200}
        height={800}
        data={[jValues[0]]}
        // selection={active}
        openByDefault={false}
        idAccessor="id"

        // onActivate={(node: NodeApi<CallTraceNode>) => {
        //     const data = node.data;
        //     setCallTraceRoot((prev) => {
        //         const next = cloneDeep<CallTraceNode>(prev);
        //         const selected = next.findSelected();
        //         if (selected) {
        //             selected.selected = false;
        //         }
        //         const current = next.findIndex(data.index);
        //         if (current) {
        //             current.selected = true;
        //         }
        //         return next;
        //     });
        // }}
    >
        {Node}
    </Tree>
}

function Node({node, style}: NodeRendererProps<JValue>) {
    const data = node.data;
    return (
        <div
            style={style}
            className={[
                'callTraceNode',
            ].join(" ")}
        >
            <div className='treeIndentLines'>
                {data.depth >= 0 &&
                    new Array(data.depth).fill(0).map((_, index) => {
                        return <div key={index}></div>;
                    })}
            </div>
            {!isEmpty(data.children) && <FolderArrow node={node}/>}
            <div>
                {data.name}
            </div>
            <div>
                {data.value}
            </div>
        </div>
    );
}

function FolderArrow({node}: { node: NodeApi<JValue> }) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                node.toggle();
            }}
            className='treeArrow'
        >
            {node.isInternal ? node.isOpen ? <CaretDownOutlined /> : <CaretRightOutlined /> : null}
        </div>
    );
}