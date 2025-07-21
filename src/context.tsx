import {createContext, Dispatch,  RefObject, SetStateAction, useContext} from "react";
import {JValue} from "./components/types.ts";
import {VirtuosoHandle} from "react-virtuoso";


export type AppContextProps = {
    treeRef:RefObject<VirtuosoHandle | null>;
    rawSize: number;
    setRawSize: Dispatch<SetStateAction<number>>;
    maxDepth: number;
    setMaxDepth: Dispatch<SetStateAction<number>>;
    jValues: JValue[];
    setJValues: Dispatch<SetStateAction<JValue[]>>;
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