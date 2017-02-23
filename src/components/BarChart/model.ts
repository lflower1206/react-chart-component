import { ScaleBand, ScaleLinear } from "d3-scale";
import { BaseType, Selection } from "d3-selection";
import { List } from "immutable";

interface SVGMargin {
    top:    number;
    right:  number;
    bottom: number;
    left:   number;
}

export interface IBarData {
    name:  string;
    value: number;
    subData?: List<IBarData>;
}

export interface IProps {
    svgWidth:  number;
    svgHeight: number;
    data:      List<IBarData>;
};

export interface IState {
    margin:              SVGMargin;
    drawableHeight:      number;
    drawableWidth:       number;
    xScale:              ScaleBand<string>;
    yScale:              ScaleLinear<number, number>;
    canvas?:             Selection<BaseType, {}, null, undefined>;
    axisBottom?:         Selection<BaseType, {}, null, undefined>;
    axisLeft?:           Selection<BaseType, {}, null, undefined>;
    bars?:               Selection<BaseType, {}, null, undefined>;
    isDrilldownMode?:    boolean;
    isDrilldownFinish ?: boolean;
    drilldownData?:      IBarData;
}
