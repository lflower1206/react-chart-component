import * as React from "react";
import * as d3 from "d3";

import { IProps, IState, ILineSeries } from "./model";

export default class LineChart extends React.PureComponent<IProps, IState> {

    path: SVGPathElement;

    constructor(props: IProps) {
        super(props);
    }

    static get defaultProps() {
        return {
            fill: "none",
            stroke: "#22BAD9",
            strokeWidth: "1.5px"
        };
    }

    _init() {
        const { canvasHeight, canvasWidth } = this.props;

        const xScale = d3.scaleTime()
                        .rangeRound([0, canvasWidth]);

        const yScale = d3.scaleLinear()
                        .range([canvasHeight, 0]);

        const line = d3.line<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y( (data: ILineSeries) => yScale(data.value) );

        this.setState({
            xScale: xScale,
            yScale: yScale,
            line: line
        });
    }

    _paint(list: ILineSeries[]) {
        const { xScale, yScale, line } = this.state;

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        d3.select<SVGPathElement, ILineSeries>(this.path)
            .datum(list)
            .attr("id", "linePath-".concat(this.props.uuid))
            .style("fill", this.props.fill)
            .style("stroke", this.props.stroke)
            .style("stroke-width", this.props.strokeWidth)
            .attr("d", line);

    }

    _repaint(list: ILineSeries[]) {
        const { xScale, yScale, line } = this.state;

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        d3.select<SVGPathElement, ILineSeries>(this.path)
            .datum(list)
                .attr("transform", null)
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("d", line);

    }

    componentWillMount() {
        this._init();
    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return this.props.data !== nextProps.data;
    }

    componentDidMount() {
        this._paint(this.props.data.toArray());
    }

    componentDidUpdate() {
        this._repaint(this.props.data.toArray());
    }

    render() {
        return (
            <path ref={ (path) => { this.path = path as SVGPathElement; } }></path>
        );
    }
}
