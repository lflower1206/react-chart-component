import { ScaleBand, ScaleLinear } from 'd3-scale';
import { List } from 'immutable';

interface margin {
    top: number
    right: number
    bottom: number
    left: number
}

export interface IBarData {
    name: string, 
    value: number
}

export interface IProps {
    svgWidth ?: number
    svgHeight ?: number
    data : List<IBarData>
};

export interface IState {
    margin : margin,
    drawableHeight : number,
    drawableWidth : number,
    xScale : ScaleBand<string>,
    yScale : ScaleLinear<number, number>
}
