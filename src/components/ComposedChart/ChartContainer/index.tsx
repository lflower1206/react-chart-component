import * as React from "react";
import * as d3 from "d3";

import { IBaseProps } from "../Base/model";
import { IProps, IState, SVGMargin } from "./model";
import { IProps as LineChartIProps } from "../LineChart/model";

import componentUtil from "../../../util/component-util";

export default class ChartContainer extends React.PureComponent<IProps, IState> {

    svg:        SVGElement;
    canvas:     SVGGElement;
    clipPath:   SVGClipPathElement;
    rectClip:   SVGRectElement;
    uuid:       string;
    canvasID:   string;
    clipPathID: string;

    defaultMargin: SVGMargin = {
        top: 20,
        right: 0,
        bottom: 20,
        left: 25
    };

    constructor(props: IProps) {
        super(props);
        this.uuid = componentUtil.getComponentUUID();
        this.canvasID = `canvas-${this.uuid}`;
        this.clipPathID = `clipPath-${this.uuid}`;
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

        const { canvasWidth, svgMargin } = this.state;

        d3.select(this.canvas).attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
        d3.select(this.rectClip)
            .transition()
            .duration(500)
            .attr("width", canvasWidth);
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
        const clipPathID = this.clipPathID;

        const childrenWithCustomProps = React.Children.map<React.ReactElement<IBaseProps>>(this.props.children, child => {

            return React.cloneElement<IBaseProps, IBaseProps>(child as React.ReactElement<IBaseProps>, {
                uuid,
                clipPathID,
                canvasHeight,
                canvasWidth
            });

        });

        return (
            <svg height={svgHeight} width={svgWidth} ref={ svg => { this.svg = svg; } }>
                <g id={ this.canvasID } ref={ canvas => { this.canvas = canvas as SVGGElement; }} >
                    <defs>
                        <clipPath id={ this.clipPathID } ref={ clipPath => { this.clipPath = clipPath as SVGClipPathElement; } }>
                            <rect width="0" height={canvasHeight} ref={ rectClip => { this.rectClip = rectClip as SVGRectElement; } }></rect>
                        </clipPath>
                    </defs>
                    { childrenWithCustomProps }
                </g>
            </svg>
        );
    }
}
