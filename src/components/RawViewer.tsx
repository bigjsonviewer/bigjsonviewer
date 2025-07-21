import {ClockCircleFilled} from "@ant-design/icons";
import {Alert, Button, Input, Modal} from "antd";
import {FC, useState} from "react";

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
    const [displayRaw, setDisplayRaw] = useState('');
    return <Modal
        title='Input JSON'
        open={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        style={{top: 120, width: '80%'}}
    >
        {showAlert && <div className={'absolute z-20'}>
            <Alert
                action={<ClockCircleFilled onClick={() => {
                    setShowAlert(false);
                }}/>}
                type='warning'
                message='When the source code is too long, it will be truncated for display to improve performance.'
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
                // setJsonRaw(value.currentTarget.value)
                let data = value.currentTarget.value;
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