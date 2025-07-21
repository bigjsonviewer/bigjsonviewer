import "./App.css";
import {JsonViewer} from "./components/JsonViewer.tsx";
import {AppContext, useAppContext} from "./context.tsx";
import {FC, useMemo, useRef, useState} from "react";
import {DragUploader} from "./components/DragUploader.tsx";
import {JValue} from "./components/types.ts";
import prettyBytes from "pretty-bytes";
import {InputRef, Select, SelectProps} from "antd";
import {Search} from "./components/Search.tsx";
import {VirtuosoHandle} from "react-virtuoso";
import {useMount} from "ahooks";
import {cn} from "./utils/tailwindcss.ts";

function App() {

    const [rawSize, setRawSize] = useState(0);
    const [jValues, setJValues] = useState<JValue[]>([]);
    const [maxDepth, setMaxDepth] = useState(0);
    const [showDepth, setShowDepth] = useState(-1);
    const [expandKeys, setExpandKeys] = useState<Map<number, boolean>>(new Map<number, boolean>());
    const [error, setError] = useState<string | null>(null);
    const treeRef = useRef<VirtuosoHandle>({} as VirtuosoHandle);

    return (
        <AppContext.Provider value={{
            treeRef,
            rawSize,
            setRawSize,
            jValues,
            setJValues,
            showDepth,
            setShowDepth,
            foldKeys: expandKeys,
            setFoldKeys: setExpandKeys,
            maxDepth,
            setMaxDepth,
            fileError: error,
            setFileError: setError,
        }}>
            <div className={cn(
                'w-screen h-screen flex flex-col',
            )}>
                <Header/>
                <div className='flex-1 h-full'>
                    <DragUploader>
                        {jValues.length > 0 ? <JsonViewer/> : <NoData/>}
                    </DragUploader>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;

const Header: FC = () => {
    const {jValues, rawSize, maxDepth, showDepth, setShowDepth} = useAppContext();
    const ref = useRef<InputRef>({} as InputRef);

    useMount(() => {
        document.addEventListener('keydown', function (event) {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;
            if (isCtrlOrCmd && event.key.toLowerCase() === 'f') {
                event.preventDefault();
                ref.current?.focus();
            }
        });
    })

    const options = useMemo(() => {
        const list: SelectProps['options'] = [{
            value: -1,
            label: 'All',
        }];
        for (let i = 0; i < maxDepth; i++) {
            list.push({
                value: i,
                label: `${i + 1}`,
            })
        }
        return list;
    }, [maxDepth])

    return <div className='flex justify-between items-center p-2 border-b border-gray-200'>
        <div className='flex gap-4 items-center'>
            <strong>Big JSON Viewer</strong>
            {jValues.length > 0 && <div className='flex gap-2'>
                <span>items:</span>
                <span>{jValues.length}</span>
            </div>}
            {rawSize > 0 && <div className='flex gap-4 items-center'>
                <div className='flex gap-2'>
                    <span>size:</span>
                    <span>
                {prettyBytes(rawSize)}
                </span>
                </div>
                {/*<RawViewer/>*/}

            </div>}
        </div>
        <div className='flex gap-2'>
            <div className='flex gap-2 items-center'>
                Depth:
                <Select
                    className='w-[80px]'
                    value={showDepth}
                    onChange={(value) => {
                        setShowDepth(value);
                    }}
                    options={options}
                />
            </div>
            {rawSize > 0 && <Search inputRef={ref}/>}
        </div>
    </div>
}


const NoData: FC = () => {
    const {fileError} = useAppContext();
    return <div className='h-full flex flex-col gap-2 items-center justify-center'>
        <div className={'text-lg'}>Drag JSON file here</div>
        {fileError !== null && <div className='text-red-500 opacity-80'>
            Invalid JSON file
        </div>}
    </div>
}