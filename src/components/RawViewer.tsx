import {FC, useContext, useState} from "react";
import {Alert, Button, Input, Modal} from "@arco-design/web-react";
import {AppContext} from "../context.tsx";
import {IconClose} from "@arco-design/web-react/icon";

export const RawViewer: FC = () => {
    const [visible, setVisible] = useState(false);
    return <>
        <Button onClick={() => {
            setVisible(true);
        }}>Input</Button>
        <JsonInputModal
            visible={visible}
            setVisible={setVisible}
        />
    </>
}

const JsonInputModal: FC<{
    visible: boolean,
    setVisible: (visible: boolean) => void,


}> = ({visible, setVisible}) => {
    const [showAlert, setShowAlert] = useState(false);
    const {setJsonRaw} = useContext(AppContext);
    const [displayRaw, setDisplayRaw] = useState('');
    return <Modal
        title='Input JSON'
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        autoFocus={false}
        focusLock={true}
        alignCenter={false}
        style={{top: 120, width: '80%'}}
    >
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
    </Modal>
}