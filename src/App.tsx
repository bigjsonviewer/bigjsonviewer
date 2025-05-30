import "./App.css";
import {JsonViewer} from "./components/JsonViewer.tsx";
import {AppContext, useAppContext} from "./context.tsx";
import {FC, useEffect, useMemo, useState} from "react";
import {cn} from "./lib/utils.ts";
import {DragUploader} from "./components/DragUploader.tsx";
import {JValue} from "./components/types.ts";
import prettyBytes from "pretty-bytes";
import {Select, SelectProps} from "antd";
import {Search} from "./components/Search.tsx";

function App() {

    const [rawSize, setRawSize] = useState(0);
    const [jValues, setJValues] = useState<JValue[]>([]);
    const [maxDepth, setMaxDepth] = useState(0);
    const [showDepth, setShowDepth] = useState(-1);
    const [expandKeys, setExpandKeys] = useState<Map<number, boolean>>(new Map<number, boolean>());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const keys = new Map<number, boolean>();
        jValues.forEach((v) => {
            if (showDepth === -1 || v.depth <= showDepth) {
                keys.set(v.id, true)
            }
        })
        setExpandKeys(keys)
    }, [jValues, showDepth]);

    return (
        <AppContext.Provider value={{
            rawSize,
            setRawSize,
            jValues,
            setJValues,
            showDepth,
            setShowDepth,
            expandKeys,
            setExpandKeys,
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
    const {rawSize, maxDepth, showDepth, setShowDepth} = useAppContext();

    const options = useMemo(() => {
        const list: SelectProps['options'] = [{
            value: -1,
            label: 'All',
        }];
        for (let i = 0; i <= maxDepth; i++) {
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
            <Search/>
        </div>
        {rawSize > 0 && <div className='flex gap-4 items-center'>
            <div className='flex gap-2'>
                <span>size:</span>
                <span>
                {prettyBytes(rawSize)}
                </span>
            </div>
            {/*<RawViewer/>*/}
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
        </div>}
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