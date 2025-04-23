// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import {JsonViewer} from "./components/JsonViewer.tsx";
import {AppContext} from "./context.tsx";
import {useState} from "react";
import {RawViewer} from "./components/RawViewer.tsx";
import {cn} from "./lib/utils.ts";
// import {testData} from "./components/data2.ts";


function App() {

    const [jsonRaw, setJsonRaw] = useState('');

    return (
        <AppContext.Provider value={{
            jsonRaw,
            setJsonRaw,
        }}>
            <div className={cn(
                'w-screen h-screen flex',
            )}>
                <div className='w-[500px] h-full'>
                    <RawViewer/>
                </div>
                <div className='flex-1 h-full'>
                    <JsonViewer/>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;
