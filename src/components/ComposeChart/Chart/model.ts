export interface Margin {
    top:    number
    right:  number
    bottom: number
    left:   number
}

export interface IProps {
    readonly height:  number
    readonly width:   number
    readonly margin?: Margin
}

export interface IState {
    readonly svgMargin:    Margin,
    readonly canvasID:        string
    readonly canvasHeight: number
    readonly canvasWidth:  number
}
