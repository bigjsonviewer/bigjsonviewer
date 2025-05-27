import {FC, ReactNode, useState} from 'react';
import type {UploadProps} from 'antd';
import {Upload} from 'antd';
import {cn} from "../lib/utils.ts";
import {JValue, walkValue} from "./types.ts";
import {useAppContext} from "../context.tsx";

const {Dragger} = Upload;

const props: UploadProps = {
    name: 'file',
    multiple: false,
    beforeUpload() {
        return false
    },
    // action: '',
    // onChange(info) {
    //     console.log('change', info)
    //     const {status} = info.file;
    //     if (status !== 'uploading') {
    //         console.log(info.file, info.fileList);
    //     }
    //     if (status === 'done') {
    //         message.success(`${info.file.name} file uploaded successfully.`);
    //     } else if (status === 'error') {
    //         message.error(`${info.file.name} file upload failed.`);
    //     }
    // },
    openFileDialogOnClick: false,

};


export const DragUploader: FC<{
    children?: ReactNode
}> = ({children}) => {
    const [dragging, setDragging] = useState(false);
    const {setJValues, setRawSize} = useAppContext()
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
                    const text = await file.text();
                    const obj = JSON.parse(text)
                    const list: JValue[] = [];
                    walkValue(undefined, obj, 0, list);
                    setJValues(list);
                    setRawSize(new Blob([text]).size)
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

