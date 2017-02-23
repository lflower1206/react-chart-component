import { ScaleTime, ScaleLinear } from "d3-scale";
import { Selection } from "d3-selection";
import { Line } from "d3-shape";
import { Bisector } from "d3-array";
import { List } from "immutable";

interface SVGMargin {
    top:    number;
    right:  number;
    bottom: number;
    left:   number;
}

export interface ILineSeries {
    time:  Date;
    value: number;
}

export interface IProps {
    svgWidth:  number;
    svgHeight: number;
    data:      List<ILineSeries>;
};

export interface IState {
    margin:              SVGMargin;
    drawableHeight:      number;
    drawableWidth:       number;
    bisectDate:          Bisector<ILineSeries, Date>;
    xScale:              ScaleTime<number, number>;
    yScale:              ScaleLinear<number, number>;
    line:                Line<ILineSeries>;
    area:                Line<ILineSeries>;
    svg?:                Selection<SVGElement, {}, HTMLElement, any>;
    canvas?:             Selection<SVGGElement, {}, HTMLElement, any>;
    rectClip?:           Selection<SVGRectElement, {}, null, undefined>;
    linePath?:           Selection<SVGPathElement, ILineSeries[], null, undefined>;
    areaPath?:           Selection<SVGPathElement, ILineSeries[], null, undefined>;
    axisBottom?:         Selection<SVGGElement, {}, null, undefined>;
    axisLeft?:           Selection<SVGGElement, {}, null, undefined>;
    cover?:              Selection<SVGRectElement, {}, null, undefined>;
    isDrilldownMode?:    boolean;
    isDrilldownFinish?:  boolean;
    drilldownData?:      ILineSeries[];
}
