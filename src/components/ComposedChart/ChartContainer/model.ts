import { IBaseProps, IBaseState } from "../Base/model";

export interface SVGMargin {
    top:    number;
    right:  number;
    bottom: number;
    left:   number;
}

export interface IProps {
    readonly svgHeight:  number;
    readonly svgWidth:   number;
    readonly svgMargin?: SVGMargin;
}

export interface IState extends IBaseState {
    readonly svgMargin:    SVGMargin;
}
