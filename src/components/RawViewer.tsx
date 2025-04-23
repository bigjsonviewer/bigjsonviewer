import {FC, useContext, useState} from "react";
import {Alert, Button, Input, Message} from "@arco-design/web-react";
import {AppContext} from "../context.tsx";
import {IconClose} from "@arco-design/web-react/icon";

export const RawViewer: FC = () => {
    const {setJsonRaw} = useContext(AppContext);
    const [showAlert, setShowAlert] = useState(false);
    const [displayRaw, setDisplayRaw] = useState('');
    return <div className='flex flex-col h-full w-full '>
        {/*<div className='p-2'>*/}
        {/*    <Button type={'primary'} onClick={() => {*/}

        {/*    }}>*/}
        {/*        Upload*/}
        {/*    </Button>*/}
        {/*</div>*/}
        <div className='relative flex-1 bg-yellow-50'>
            {showAlert && <div className={'absolute z-20'}>
                <Alert
                    action={<IconClose onClick={() => {
                        setShowAlert(false);
                    }}/>}
                    type='warning'
                    content='When the source code is too long, it will be truncated for display to improve performance.'
                />
            </div>}
            <Input.TextArea
                autoSize={false}
                // onPaste={(event) => {
                //     let data = event.clipboardData.getData('text');
                //     setJsonRaw(data);
                //     if (data.length > 1200) {
                //         data = data.slice(0, 1200) + '...'
                //     }
                //     setDispalyRaw(data)
                //     event.stopPropagation()
                // }}
                onChange={value => {
                    setJsonRaw(value)
                    let data = value;
                    if (data.length > 1200) {
                        setShowAlert(true);
                        data = data.slice(0, 1200) + '...'
                    }
                    setDisplayRaw(data)
                }}
                value={displayRaw}
                style={{height: '100%'}}
                placeholder="input or paste json"
            />
        </div>
    </div>
}