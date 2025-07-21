import {FC, useEffect, useMemo, useRef, useState} from "react";
import {useAppContext} from "../context.tsx";
import {JType, JValue} from "./types.ts";
import {Stage, Layer, Rect, Circle, Text, Line, Label} from 'react-konva';
import {useSize} from "ahooks";


const columns = [
    {
        field: 'name',
        title: 'Name',
        width: 'auto',
        tree: true,
        fieldFormat(item: JValue) {
            if (item.name) {
                return item.name;
            }

            if (item.type === JType.Object) {
                return 'Object'
            }

            if (item.type === JType.Array) {
                return 'array'
            }

            return 'Unknown';
        }
    }
];


export const JsonViewer: FC = () => {

    const {jValues, showDepth, foldKeys, treeRef, setFoldKeys} = useAppContext();

    // console.log('jValues: 0', jValues[0]);

    const ref = useRef<HTMLDivElement>(null);
    const refSize = useSize(ref);
    const size = refSize ?? {width: 0, height: 0}

    useEffect(() => {


    }, [showDepth, jValues])

    const [bg, setBg] = useState('red')

    return <div ref={ref} className='w-full h-full bg-yellow-100'>
        <Stage width={size.width} height={size.height}>
            <Layer>
                <Text text="Try to drag shapes" fontSize={15}/>
                <Text x={30} y={100} text="Try to drag shapes" fontSize={15}/>
                <Rect
                    onClick={() => {
                        console.log('click rect')
                    }}
                    onMouseOver={() => {
                        setBg('yellow')
                    }}
                    onMouseLeave={() => {
                        setBg('red')
                    }}
                    x={20}
                    y={50}
                    width={100}
                    height={100}
                    fill={bg}
                    shadowBlur={10}
                />
                <Circle
                    x={200}
                    y={100}
                    radius={50}
                    fill="green"
                />
                <Label/>
                <Line
                    x={20}
                    y={200}
                    points={[0, 0, 100, 0, 100, 100]}
                    tension={0.5}
                    closed
                    stroke="black"
                    fillLinearGradientStartPoint={{x: -50, y: -50}}
                    fillLinearGradientEndPoint={{x: 50, y: 50}}
                    fillLinearGradientColorStops={[0, 'red', 1, 'yellow']}
                />
            </Layer>
        </Stage>
    </div>
}

const RectItem: FC<{
    height: number
}> = () => {
    return <Rect></Rect>
}