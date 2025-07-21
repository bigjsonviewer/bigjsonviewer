import {FC, ReactNode, useEffect, useState} from 'react';
import type {UploadProps} from 'antd';
import {Upload} from 'antd';
import {JValue, walkValue} from "./types.ts";
import {useAppContext} from "../context.tsx";
import {Events, Flags, triggerEvent} from "../events.ts";
import {getCurrentWebview} from "@tauri-apps/api/webview";
import type {UnlistenFn} from "@tauri-apps/api/event";
import {BaseDirectory, readFile} from "@tauri-apps/plugin-fs";
import {isApp} from "../utils/isApp.ts";
import {cn} from "../utils/tailwindcss.ts";
import {testData2} from "./data.ts";
import {ElapsedTime} from "../utils.ts";


const {Dragger} = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload() {
        return false
    },
    openFileDialogOnClick: false,
};


export const DragUploader: FC<{
    children?: ReactNode
}> = ({children}) => {


    const [dragging, setDragging] = useState(false);
    const {setJValues, setRawSize, setMaxDepth, setFileError} = useAppContext()

    const setData = (text: string) => {
        setDragging(false);
        setJValues([]);
        setRawSize(0);
        setMaxDepth(0);
        setFileError(null);
        try {
            const t1 = ElapsedTime.start('parse json')
            const obj = JSON.parse(text)
            t1.end()

            const list: JValue[] = [];
            const maxDepth = {maxDepth: 0}
            const size = new Blob([text]).size;

            const t2 = ElapsedTime.start('walk items')
            walkValue(undefined, obj, 0, list, maxDepth);
            t2.end()

            setJValues(list);
            setRawSize(size);
            setMaxDepth(maxDepth.maxDepth);
            triggerEvent(Events.drag_file_success, {
                size,
                length: list.length,
                maxDepth: maxDepth.maxDepth,
            }, {flags: [Flags.drag_file]})
        } catch (e) {
            console.error('parse error:', e);
            setFileError(`${e}`);
            triggerEvent(Events.drag_file_failed, {
                error: `${e}`,
            }, {flags: [Flags.drag_file]})
        }
    };

    useEffect(() => {
        if (!import.meta.env.PROD) {
            setData(testData2);
        }
        if (!isApp()) {
            return
        }
        let unListen: UnlistenFn;
        void (async () => {
            unListen = await getCurrentWebview().onDragDropEvent((event) => {
                if (event.payload.type === 'over') {
                    // console.log('User hovering', event.payload.position);
                } else if (event.payload.type === 'drop') {
                    const paths = event.payload.paths;
                    console.log('User dropped', event.payload.paths);
                    void (async () => {
                        const contents = await readFile(paths[0], {
                            baseDir: BaseDirectory.Home,
                        });
                        const decoder = new TextDecoder('utf-8');
                        const text = decoder.decode(contents);
                        console.log('contents:', text.length)
                        setData(text);
                    })()
                } else {
                    console.log('File drop cancelled');
                }
            });
        })()
        return () => {
            unListen?.();
        }
    }, []);


    return (
        <div className={cn(
            'h-full',
            '[&_.ant-upload-btn]:!cursor-default',
            '[&_.ant-upload-btn]:!block',
            '[&_.ant-upload-btn]:!w-full',
            '[&_.ant-upload-btn]:!h-full',
            '[&_.ant-upload-btn]:!p-0',
            '[&_.ant-upload-drag-container]:!block',
            '[&_.ant-upload-drag-container]:!w-full',
            '[&_.ant-upload-drag-container]:!h-full',
            '[&_.ant-upload-drag-container]:!text-left',
            '[&_.ant-upload-drag]:!rounded-none',
            '[&_.ant-upload-drag]:!border-0',
            '[&_.ant-upload-drag]:!bg-transparent',
        )}
             onDragEnter={() => {
                 setDragging(true)
             }}
             onDragEnd={() => {
                 setDragging(false)
             }}
             onDragExit={() => {
                 setDragging(false)
             }}
             onDragLeave={() => {
                 setDragging(false)
             }}
        >
            <Dragger {...props} onDrop={(e) => {
                setDragging(false);
                const file = e.dataTransfer.files.item(0);
                if (!file) {
                    return
                }
                void (async () => {
                    setData(await file.text())
                })()
            }}>
                {children}
                {dragging && <div>
                    Dragging file...
                </div>}
            </Dragger>
        </div>
    )

}

