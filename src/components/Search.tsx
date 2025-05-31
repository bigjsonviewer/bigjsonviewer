import {ArrowDownOutlined, ArrowUpOutlined, LoadingOutlined} from "@ant-design/icons";
import {Button, Input, InputRef, Spin} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAppContext} from "../context.tsx";
import {useDebounce} from "ahooks";

const renderHitText = (str: string) => {
    return `<span class="hit">${str}</span>`
}

export const Search = () => {

    const {setJValues, treeRef} = useAppContext();
    const [value, setValue] = useState('');
    const [searching, setSearching] = useState<boolean>(false);
    const [hitNodes, setHitNodes] = useState<number[]>([]);
    const [selectIndex, setSelectIndex] = useState<number>(0);
    const ref = useRef<InputRef>(null);

    useEffect(() => {
        // console.log('hitIndex:', selectIndex, hitNodes[selectIndex]);
        const id = hitNodes[selectIndex];
        if (id !== undefined) {
            treeRef.current?.scrollToIndex(id);
        }
    }, [selectIndex, hitNodes]);

    const search = useCallback((searchStr: string) => {
        setSearching(true);
        setSelectIndex(0);
        setHitNodes([]);
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
                        item.hit = true;
                        indexes.push(index);
                    }
                    return item.hit ? {...item} : item;
                })
            })
            setHitNodes(indexes);
            setSearching(false);
            setTimeout(() => {
                ref.current?.focus();
            }, 0);
        }, 0)
    }, [value, setJValues]);

    const debounce = useDebounce(value, {wait: 500});
    useEffect(() => {
        search(debounce);
    }, [debounce]);


    return <div className='w-[450px] flex items-center gap-2'>
        <Input
            ref={ref}
            prefix={<Spin spinning={searching} indicator={<LoadingOutlined/>}/>}
            suffix={<div className={'flex items-center gap-2'}>
                {hitNodes.length > 0 && <div>
                    {selectIndex + 1}/{hitNodes.length}
                </div>
                }
                <Button disabled={selectIndex <= 0} onClick={() => {
                    setSelectIndex(prev => prev - 1)
                }} icon={<ArrowUpOutlined/>}/>
                <Button disabled={selectIndex >= hitNodes.length - 1} onClick={() => {
                    setSelectIndex(prev => prev + 1)
                }} icon={<ArrowDownOutlined/>}/>
            </div>}
            placeholder=""
            disabled={searching}
            value={value}
            onChange={e => {
                setValue(e.target.value);
            }}
        />
    </div>
}