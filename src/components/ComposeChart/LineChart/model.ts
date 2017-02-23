import { ScaleTime, ScaleLinear } from "d3-scale";
import { Line } from "d3-shape";

export interface IProps {
    readonly canvasHeight?:  number;
    readonly canvasWidth?:   number;
}

export interface IState {
    xScale:              ScaleTime<number, number>;
    yScale:              ScaleLinear<number, number>;
    line:                Line<ILineSeries>;
}

export interface ILineSeries {
    time:  Date;
    value: number;
}
