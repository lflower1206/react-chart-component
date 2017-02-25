import { ScaleTime, ScaleLinear } from "d3-scale";
import { Line } from "d3-shape";
import { List } from "immutable";

import { IBaseProps, IBaseState } from "../Base/model";

export interface IProps extends IBaseProps {
    readonly data:         List<ILineSeries>;

    // styles
    readonly fill?:        string;
    readonly stroke?:      string;
    readonly strokeWidth?: string;
}

export interface IState extends IBaseState {
    xScale: ScaleTime<number, number>;
    yScale: ScaleLinear<number, number>;
    line:   Line<ILineSeries>;
}

export interface ILineSeries {
    time:  Date;
    value: number;
}
