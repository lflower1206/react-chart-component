import { ScaleTime, ScaleLinear } from 'd3-scale';
import { BaseType, Selection } from 'd3-selection';
import { Line } from 'd3-shape';
import { List } from 'immutable';

interface margin {
    top:    number
    right:  number
    bottom: number
    left:   number
}

export interface ILineSeries {
    time:  Date, 
    value: number
}

export interface IProps {
    svgWidth:  number
    svgHeight: number
    data:      List<ILineSeries>
};

export interface IState {
    margin :        margin,
    drawableHeight: number,
    drawableWidth:  number,
    xScale:         ScaleTime<number, number>,
    yScale:         ScaleLinear<number, number>,
    line:           Line<ILineSeries>,
    area:           Line<ILineSeries>,
    linePath?:      Selection<BaseType, ILineSeries[], null, undefined>,
    areaPath?:      Selection<BaseType, ILineSeries[], null, undefined>,
    axisBottom?:    Selection<BaseType, {}, null, undefined>,
    axisLeft?:      Selection<BaseType, {}, null, undefined>
}
