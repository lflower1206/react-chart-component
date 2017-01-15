import { Arc, DefaultArcObject } from 'd3-shape';
import { BaseType, Selection } from 'd3-selection';

export interface IProps {
    svgWidth:  number
    svgHeight: number
    arcRadius: number
    data:      number
};

export interface IState {
    tau:       number,
    arcDatum:  DefaultArcObject
    arc:       Arc<any, DefaultArcObject>,
    arcPath?:  Selection<BaseType, {}, null, undefined>,
    label?:    Selection<BaseType, {}, null, undefined>,
    radius:    number,
    fontSize:  number,
    data?:     number
}
