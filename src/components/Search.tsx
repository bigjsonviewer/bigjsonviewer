import {ArrowDownOutlined, ArrowUpOutlined, CloseOutlined, LoadingOutlined} from "@ant-design/icons";
import {useDebounce} from "ahooks";
import {Button, Input, InputRef, Spin} from "antd";
import {FC, RefObject, useCallback, useEffect, useState} from "react";

import {useAppContext} from "../context.tsx";
// import {calcExpand} from "./JsonViewer.tsx";

const renderHitText = (str: string) => {
    return `<span class="hit">${str}</span>`
}

export const Search: FC<{
    inputRef: RefObject<InputRef>,
}> = ({inputRef}) => {

    const {setJValues, treeRef} = useAppContext();
    const [value, setValue] = useState('');
    const [searching, setSearching] = useState<boolean>(false);
    const [hitNodes, setHitNodes] = useState<Array<number>>([]);
    const [selectIndex, setSelectIndex] = useState<number>(-1);


    useEffect(() => {
        // console.log('hitIndex:', selectIndex, hitNodes[selectIndex]);
        const id = hitNodes[selectIndex];
        if (id !== undefined) {
            // const expand = calcExpand(expandKeys, jValues[id])
            // if (!expand) {
            //     let parent = jValues[id]?.parent;
            //     while (parent) {
            //         expandKeys.set(parent.id, true);
            //         parent = parent.parent;
            //     }
            //     setExpandKeys(new Map<number, boolean>(expandKeys));
            // }
            treeRef.current?.scrollToIndex(id);
        }
    }, [selectIndex, hitNodes, treeRef]);

    const search = useCallback((searchStr: string) => {
        setSearching(true);
        setSelectIndex(-1);
        setHitNodes([]);
        setTimeout(() => {
            const indexes: Array<number> = [];
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
            if (indexes.length > 0) {
                setSelectIndex(0);
            }
            setSearching(false);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }, 0)
    }, [setJValues, inputRef]);

    const debounce = useDebounce(value, {wait: 500});

    useEffect(() => {
        search(debounce);
    }, [debounce, search]);


    return <div className='w-[450px] flex items-center gap-2'>
        <Input
            ref={inputRef}
            size={'small'}
            prefix={<Spin spinning={searching} indicator={<LoadingOutlined/>}/>}
            suffix={<div className={'flex items-center gap-2'}>
                <div>
                    {selectIndex + 1}/{hitNodes.length}
                </div>
                <Button disabled={selectIndex <= 0} onClick={() => {
                    setSelectIndex(prev => prev - 1)
                }} icon={<ArrowUpOutlined/>}/>
                <Button disabled={selectIndex >= hitNodes.length - 1} onClick={() => {
                    setSelectIndex(prev => prev + 1)
                }} icon={<ArrowDownOutlined/>}/>
                <Button disabled={!value} icon={<CloseOutlined/>} onClick={() => {
                    setValue('');
                }}/>

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