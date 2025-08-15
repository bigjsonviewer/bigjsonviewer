'use client';

import "./App.css";

import {UploadOutlined} from "@ant-design/icons";
import {useMount} from "ahooks";
import {Button, Input, InputRef, Select, SelectProps, Tag, Upload, UploadProps} from "antd";
import prettyBytes from "pretty-bytes";
import {FC, useMemo, useRef, useState} from "react";
import {VirtuosoHandle} from "react-virtuoso";

import {DragUploader} from "./components/DragUploader.tsx";
import {JsonViewer} from "./components/JsonViewer.tsx";
import {Search} from "./components/Search.tsx";
import {JValue} from "./components/types.ts";
import {AppContext, useAppContext} from "./context.tsx";
import {cn} from "./utils/tailwindcss.ts";

function App() {

    const [rawSize, setRawSize] = useState(0);
    const [jValues, setJValues] = useState<Array<JValue>>([]);
    const [maxDepth, setMaxDepth] = useState(0);
    const [showDepth, setShowDepth] = useState(-1);
    const [foldedKeys, setFoldedKeys] = useState<Map<number, boolean>>(new Map<number, boolean>());
    const [error, setError] = useState<string | null>(null);
    const treeRef = useRef<VirtuosoHandle>({} as VirtuosoHandle);
    const [filename, setFilename] = useState('');

    return (
        <AppContext.Provider value={{
            treeRef,
            rawSize,
            setRawSize,
            jValues,
            setJValues,
            showDepth,
            setShowDepth,
            foldedKeys,
            setFoldedKeys,
            maxDepth,
            setMaxDepth,
            fileError: error,
            setFileError: setError,
            filename,
            setFilename,
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


function truncateString(str: string, maxLength: number = 24) {
    if (str.length <= maxLength) {
        return str;
    }

    const front = str.slice(0, Math.trunc(maxLength / 2));
    const back = str.slice(-Math.trunc(maxLength / 2));

    return `${front}...${back}`;
}

const Header: FC = () => {
    const {jValues, rawSize, maxDepth, showDepth, setShowDepth, filename} = useAppContext();
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
            <strong className={'cursor-pointer'} onClick={() => {
                window.location.reload();
            }}>Big JSON Viewer</strong>
            {
                filename && <div>
                    <Tag title={filename} closable={true} onClose={() => {
                        window.location.reload();
                    }}>{truncateString(filename)}</Tag>
                </div>
            }
            <div className='flex items-center gap-2 text-gray-500 text-sm'>
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
        </div>
        <div className='flex items-center gap-2'>
            <div className='ml-2 flex gap-2 items-center'>
                Show Depth:
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
    const [data, setData] = useState('');
    return <div className='h-full w-[80%] p-2 mx-auto flex flex-col gap-2 items-center justify-center'>
        <div className={'flex w-full justify-between'}>
            <UploadButton/>
            <Button className={'w-[220px]'}
                    disabled={!data}
                    type={'primary'}
                    onClick={() => {
                        console.info('debug:', data)
                    }}>Parse</Button>

        </div>
        <div className={'relative w-full h-fit'}>
            {!data && <div
                className="h-full w-full absolute left-0 top-0 z-0 flex flex-col gap-1 justify-center items-center">
                <div className={'text-lg'}>
                    input JSON or drag file here
                </div>
                <div className={'text-green-600'}>
                    Tip: Big JSON Viewer does not record JSON data in any way!
                </div>
            </div>}
            <Input.TextArea
                // placeholder={'input JSON...'}
                value={data}
                onChange={e => {
                    setData(e.target.value)
                }} rows={16} className={cn(
                '!bg-transparent'
            )}/>
        </div>

        {fileError !== null && <div className='text-red-500 opacity-80'>
            Invalid JSON file
        </div>}
    </div>
}


const props: UploadProps = {
    name: 'file',
    // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    // headers: {
    //     authorization: 'authorization-text',
    // },
    accept: 'application/json',
    onChange() {
        // if (info.file.status !== 'uploading') {
        //     console.log(info.file, info.fileList);
        // }
        // if (info.file.status === 'done') {
        //     message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //     message.error(`${info.file.name} file upload failed.`);
        // }
    },
};

const UploadButton: FC = () => (
    <Upload className={cn(
        '[&_.ant-upload]:!p-0',
        // '[&_.ant-btn]:!text-gray-500'
    )} {...props}>
        <Button className={'text-gray-500'} icon={<UploadOutlined/>}>Upload</Button>
    </Upload>
);