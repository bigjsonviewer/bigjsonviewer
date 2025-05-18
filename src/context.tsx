import {createContext, Dispatch, SetStateAction, useContext} from "react";


export type AppContextProps = {
    jsonRaw: string;
    setJsonRaw: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<AppContextProps>({
    jsonRaw: "",
    setJsonRaw: () => {
    }
});


export const useAppContext = () => {
    return useContext(AppContext);
}