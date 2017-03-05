import * as React from "react";
import * as d3 from "d3";

import { IBaseProps } from "../Base/model";
import { IProps, IState, SVGMargin } from "./model";
import { IProps as LineChartIProps } from "../LineChart/model";

import componentUtil from "../../../util/component-util";

export default class ChartContainer extends React.PureComponent<IProps, IState> {

    svg:      SVGElement;
    canvas:   SVGGElement;
    uuid:     string;
    canvasID: string;

    defaultMargin: SVGMargin = {
        top: 20,
        right: 0,
        bottom: 20,
        left: 25
    };

    constructor(props: IProps) {
        super(props);
        this.uuid = componentUtil.getComponentUUID();
        this.canvasID = "canvas-".concat(this.uuid);
    }

    _init() {
        const svgMargin    = this.props.svgMargin || this.defaultMargin;
        const canvasHeight = this.props.svgHeight - svgMargin.top - svgMargin.bottom;
        const canvasWidth  = this.props.svgWidth - svgMargin.left - svgMargin.right;

        this.setState({
            svgMargin:    svgMargin,
            canvasHeight: canvasHeight,
            canvasWidth:  canvasWidth
        });
    }

    _draw() {

        const svgMargin = this.state.svgMargin;

        d3.select(this.canvas).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
    }

    componentWillMount() {
        this._init();
    }

    componentDidMount() {
        this._draw();
    }

    render() {

        const {
            canvasHeight,
            canvasWidth
        } = this.state;

        const {
            svgHeight,
            svgWidth
        } = this.props;

        const uuid = this.uuid;

        const childrenWithCustomProps = React.Children.map<React.ReactElement<IBaseProps>>(this.props.children, child => {

            return React.cloneElement<IBaseProps, IBaseProps>(child as React.ReactElement<IBaseProps>, {
                uuid,
                canvasHeight,
                canvasWidth
            });

        });

        return (
            <svg height={svgHeight} width={svgWidth} ref={ svg => { this.svg = svg; } }>
                <g id={ this.canvasID } ref={ canvas => { this.canvas = canvas as SVGGElement; }} >
                    { childrenWithCustomProps }
                </g>
            </svg>
        );
    }
}
