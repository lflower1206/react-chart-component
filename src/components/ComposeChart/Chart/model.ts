export interface SVGMargin {
    top:    number;
    right:  number;
    bottom: number;
    left:   number;
}

export interface IProps {
    readonly height:  number;
    readonly width:   number;
    readonly margin?: SVGMargin;
}

export interface IState {
    readonly svgMargin:    SVGMargin;
    readonly canvasID:     string;
    readonly canvasHeight: number;
    readonly canvasWidth:  number;
}
