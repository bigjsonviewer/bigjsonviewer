import {createContext, Dispatch, RefObject, SetStateAction, useContext} from "react";
import {VirtuosoHandle} from "react-virtuoso";

import {JValue} from "./components/types.ts";


export type AppContextProps = {
    treeRef: RefObject<VirtuosoHandle>;
    rawSize: number;
    setRawSize: Dispatch<SetStateAction<number>>;
    maxDepth: number;
    setMaxDepth: Dispatch<SetStateAction<number>>;
    jValues: Array<JValue>;
    setJValues: Dispatch<SetStateAction<Array<JValue>>>;
    showDepth: number;
    setShowDepth: Dispatch<SetStateAction<number>>;
    foldKeys: Map<number, boolean>;
    setFoldKeys: Dispatch<SetStateAction<Map<number, boolean>>>;
    fileError: string | null;
    setFileError: Dispatch<SetStateAction<string | null>>;
}

export const AppContext = createContext<AppContextProps>({} as AppContextProps);


export const useAppContext = () => {
    return useContext(AppContext);
}