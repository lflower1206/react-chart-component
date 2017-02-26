import { List } from "immutable";
import { Line } from "d3-shape";
import { ScaleBand, ScaleLinear } from "d3-scale";

import { IBaseProps, IBaseState } from "../Base/model";

export interface IProps extends IBaseProps {
    readonly data:  List<IBarData>;

    // style
    readonly fill?: string;
}

export interface IState extends IBaseState {
    xScale: ScaleBand<string>;
    yScale: ScaleLinear<number, number>;
}

export interface IBarData {
    name:  string;
    value: number;
}
