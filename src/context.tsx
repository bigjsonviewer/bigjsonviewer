import {createContext, Dispatch, SetStateAction, useContext} from "react";
import {JValue} from "./components/types.ts";


export type AppContextProps = {
    jsonRaw: string;
    setJsonRaw: Dispatch<SetStateAction<string>>;
    jValues: JValue[];
    setJValues: Dispatch<SetStateAction<JValue[]>>;
    showDepth: number;
    setShowDepth: Dispatch<SetStateAction<number>>;
}

export const AppContext = createContext<AppContextProps>({
    jsonRaw: "",
    setJsonRaw: () => {
    },
    jValues: [],
    setJValues: () => {
    },
    showDepth: -1,
    setShowDepth: () => {
    }
});


export const useAppContext = () => {
    return useContext(AppContext);
}