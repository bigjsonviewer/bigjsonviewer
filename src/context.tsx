import {createContext, Dispatch, SetStateAction} from "react";


export type AppContextProps = {
    jsonRaw: string;
    setJsonRaw: Dispatch<SetStateAction<string>>;
}

export const AppContext = createContext<AppContextProps>({
    jsonRaw: "",
    setJsonRaw: () => {}
});

