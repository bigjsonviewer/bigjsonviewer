import {createContext, Dispatch, SetStateAction, useContext} from "react";
import {JValue} from "./components/types.ts";


export type AppContextProps = {
    rawSize: number;
    setRawSize: Dispatch<SetStateAction<number>>;
    maxDepth: number;
    setMaxDepth: Dispatch<SetStateAction<number>>;
    jValues: JValue[];
    setJValues: Dispatch<SetStateAction<JValue[]>>;
    showDepth: number;
    setShowDepth: Dispatch<SetStateAction<number>>;
    expandKeys: Map<number, boolean>;
    setExpandKeys: Dispatch<SetStateAction<Map<number, boolean>>>;
    error: string | null;
    setError: Dispatch<SetStateAction<string | null>>;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);


export const useAppContext = () => {
    return useContext(AppContext);
}