export interface IBaseProps {
    readonly uuid?:         string;
    readonly canvasHeight?: number;
    readonly canvasWidth?:  number;
}

export interface IBaseState {
    canvasHeight?: number;
    canvasWidth?:  number;
}
