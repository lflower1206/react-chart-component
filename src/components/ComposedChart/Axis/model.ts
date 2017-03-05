import { List } from "immutable";

import { ILineSeries } from "../LineChart/model";
import { IBarData } from "../BarChart/model";

export type PropsDataType = List<ILineSeries> | List<IBarData>;

export enum ScaleType {
    Time,
    Band
};
