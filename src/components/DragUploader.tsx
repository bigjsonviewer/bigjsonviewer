import {FC, ReactNode, useState} from 'react';
import type {UploadProps} from 'antd';
import {Upload} from 'antd';
import {cn} from "../lib/utils.ts";
import {isArray} from 'lodash';

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
                    const obj = JSON.parse(text)
                    console.log('raw:', obj)
                    console.log('walk:', walkValue(obj))
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

export enum JType {
    Null,
    Object,
    Array,
    String,
    Number,
    Boolean,
    Unknown,
}

export type JValue = {
    name?: string;
    type: JType;
    repeated?: boolean;
    value?: unknown;
    children?: JValue[];
    elems?: JValue[];
}

const walkValue = (obj: unknown): JValue => {

    const v: JValue = {
        type: checkType(obj),
    }

    switch (v.type) {
        case JType.Object: {
            v.children = []
            for (const key in obj as object) {
                const vv = walkValue((obj as Record<string, unknown>)[key]);
                vv.name = key;
                v.children.push(vv);
            }
            break
        }
        case JType.Array: {
            v.repeated = true;
            v.elems = [];
            (obj as unknown[]).forEach((item: unknown) => {
                const vv = walkValue(item);
                v.elems!.push(vv);
            })
            break
        }
        case JType.String:
        case JType.Number:
        case JType.Boolean:
        case JType.Null: {
            v.value = obj;
            break
        }
    }

    return v;

}


const checkType = (value: unknown): JType => {
    if (value === null) {
        return JType.Null
    }
    if (Array.isArray(value)) {
        return JType.Array
    }
    if (typeof value === 'object') {
        return JType.Object
    }
    if (typeof value === 'string') {
        return JType.String
    }
    if (typeof value === 'number') {
        return JType.Number
    }
    if (typeof value === 'boolean') {
        return JType.Boolean
    }
    return JType.Unknown
}



