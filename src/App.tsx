// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import {JsonViewer} from "./components/JsonViewer.tsx";
import {AppContext, useAppContext} from "./context.tsx";
import {FC, useMemo, useState} from "react";
import {RawViewer} from "./components/RawViewer.tsx";
import {cn} from "./lib/utils.ts";
import {DragUploader} from "./components/DragUploader.tsx";
import {JValue} from "./components/types.ts";

// import {testData} from "./components/data2.ts";


function App() {

    const [jsonRaw, setJsonRaw] = useState(`{"name":"tom","age":18"}`);
    const [jValues, setJValues] = useState<JValue[]>([]);
    const [showDepth, setShowDepth] = useState(2);


    return (
        <AppContext.Provider value={{
            jsonRaw,
            setJsonRaw,
            jValues,
            setJValues,
            showDepth,
            setShowDepth,
        }}>
            <div className={cn(
                'w-screen h-screen flex flex-col',
            )}>
                <Header/>
                <div className='flex-1 h-full'>
                    <DragUploader>
                        {!!jsonRaw ? <JsonViewer/> : <NoData/>}
                    </DragUploader>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;

const Header: FC = () => {
    const {jsonRaw} = useAppContext();

    const jsonRawSize = useMemo(() => {
        return new Blob([jsonRaw]).size;
    }, [jsonRaw])

    return <div className='flex justify-between items-center p-2 border-b border-gray-200'>
        <strong>Big JSON Viewer</strong>
        <div className='flex gap-2 items-center'>
            <span>
                size:
                {jsonRawSize}
            </span>
            <RawViewer/>

        </div>
    </div>

}


const NoData: FC = () => {
    return <div className='h-full flex items-center justify-center'>No Data</div>
}