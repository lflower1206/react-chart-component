import * as React from "react";
import * as d3 from "d3";
import { List } from "immutable";

import { IProps, IState, ILineSeries } from "./model";

export default class LineChart extends React.PureComponent<IProps, IState> {

    path: SVGPathElement;
    previousData: List<ILineSeries>;

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
        const { canvasHeight, canvasWidth, data } = this.props;

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

    _paint(data: List<ILineSeries>) {
        const { xScale, yScale, line } = this.state;
        const list = data.toArray();

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        d3.select<SVGPathElement, ILineSeries>(this.path)
            .datum(list)
            .attr("id", "linePath-".concat(this.props.uuid))
            .style("fill", this.props.fill)
            .style("stroke", this.props.stroke)
            .style("stroke-width", this.props.strokeWidth)
            .attr("d", line);

        this.previousData = data;

    }

    _repaint(data: List<ILineSeries>) {
        const { xScale, yScale, line } = this.state;
        const lastPreviousData = this.previousData.last();
        const startIndex = data.findIndex(value => value.time.getTime() === lastPreviousData.time.getTime());
        const list = this._appendTail(this.previousData, data, startIndex).toArray();
        const range = list[list.length - 1].time.getTime() - xScale.domain()[1].getTime();
        const tranlsateRange = xScale.domain()[0].getTime() - range;
        const d3Path = d3.select<SVGPathElement, ILineSeries>(this.path);

        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        d3Path.datum(list)
            .attr("transform", null)
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("d", line)
                .attr("transform", "translate(" + xScale(new Date(tranlsateRange)) + ",0)")
            .on("end", function () {
                const list = data.toArray();
                xScale.domain([list[0].time, list[list.length - 1].time]);
                d3Path
                    .datum(data.toArray())
                    .attr("transform", null)
                    .attr("d", line);
            });

        this.previousData = data;
    }

    _appendTail(sourceList: List<ILineSeries>, targetList: List<ILineSeries>, startIndex: number): List<ILineSeries> {

        for (let index = startIndex + 1 ; index < targetList.size ; index++) {
            sourceList = sourceList.push(targetList.get(index));
        }

        return sourceList;
    }

    componentWillMount() {
        this._init();
    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return this.props.data !== nextProps.data;
    }

    componentDidMount() {
        this._paint(this.props.data);
    }

    componentDidUpdate() {
        this._repaint(this.props.data);
    }

    render() {
        return (
            <g clipPath={`url(#${this.props.clipPathID})`}>
                <path ref={ (path) => { this.path = path as SVGPathElement; } }></path>
            </g>
        );
    }
}
