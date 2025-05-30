import {LoadingOutlined, SearchOutlined} from "@ant-design/icons";
import {Input, Spin} from "antd";
import {useCallback, useState} from "react";
import {useAppContext} from "../context.tsx";

const renderHitText = (str: string) => {
    return `<span class="hit">${str}</span>`
}

export const Search = () => {

    const {setJValues} = useAppContext();
    const [value, setValue] = useState('');
    const [searching, setSearching] = useState<boolean>(false);
    const [hitIndexes, setHitIndexes] = useState<number[]>([]);

    const search = useCallback(() => {
        const searchStr = value;
        setSearching(true);
        setTimeout(() => {
            const indexes: number[] = [];
            setJValues(prev => {
                return prev.map((item, index) => {
                    let hit = false;
                    if (item.name && item.name.includes(searchStr)) {
                        item.searchName = item.name.replace(searchStr, renderHitText(searchStr))
                        hit = true;
                    } else {
                        item.searchName = undefined;
                    }
                    if (item.value && item.value.includes(searchStr)) {
                        item.searchValue = item.value.replace(searchStr, renderHitText(searchStr))
                        hit = true;
                    } else {
                        item.searchValue = undefined;
                    }
                    if (searchStr && hit) {
                        indexes.push(index);
                    }
                    return {...item};
                })
            })
            setHitIndexes(indexes);
            setSearching(false)
        }, 0)
    }, [value, setJValues])


    return <div className='w-[450px] flex items-center gap-2'>
        <Input
            suffix={
                searching ? <Spin spinning={true} indicator={<LoadingOutlined/>}/> :
                    <SearchOutlined onClick={() => search()}/>
            }
            placeholder=""
            disabled={searching}
            value={value}
            onChange={e => {
                setValue(e.target.value);
            }}
            onPressEnter={() => search()}
        />
        <span>
            {hitIndexes.length}
        </span>
    </div>
}