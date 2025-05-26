import {FC, ReactNode, useState} from 'react';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';
import {cn} from "../lib/utils.ts";
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
    const {setJsonRaw} = useAppContext()
    return (
        <div className={cn(
            'h-full',
            '[&_.ant-upload-btn]:!cursor-default'
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
                console.log('Dropped files', e.dataTransfer.files);
                const file = e.dataTransfer.files.item(0);
                if (!file) {
                    return
                }
                void (async () => {
                    const text = await file.text();
                    console.log('text:', JSON.parse(text))
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