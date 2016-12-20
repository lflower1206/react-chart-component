import { ScaleBand, ScaleLinear } from 'd3-scale';
import { BaseType, Selection } from 'd3-selection';
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
    yScale : ScaleLinear<number, number>,
    axisBottom ?: Selection<BaseType, {}, null, undefined>,
    axisLeft ?: Selection<BaseType, {}, null, undefined>,
    bars ?: Selection<BaseType, {}, null, undefined>
}
