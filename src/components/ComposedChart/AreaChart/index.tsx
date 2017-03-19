import * as React from "react";
import * as d3 from "d3";
import { List } from "immutable";

import { IProps, IState, ILineSeries } from "./model";

export default class AreaChart extends React.PureComponent<IProps, IState> {

    area: SVGPathElement;
    tailArea: SVGPathElement;
    previousData: List<ILineSeries>;

    constructor(props: IProps) {
        super(props);
    }

    static get defaultProps(): IProps {
        return {
            fill: "#22BAD9",
            stroke: "none",
            strokeWidth: "0",
            fillOpacity: "1",
            data: List<ILineSeries>()
        };
    }

    _init() {
        const { canvasHeight, canvasWidth, data } = this.props;

        const xScale = d3.scaleTime()
                        .rangeRound([0, canvasWidth]);

        const yScale = d3.scaleLinear()
                        .range([canvasHeight, 0]);

        const area = d3.area<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y0(canvasHeight)
                        .y1( (data: ILineSeries) => yScale(data.value) );

        this.setState({
            xScale: xScale,
            yScale: yScale,
            area: area
        });
    }

    _paint(data: List<ILineSeries>) {
        const { xScale, yScale, area } = this.state;
        const list = data.toArray();

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        d3.select<SVGPathElement, ILineSeries>(this.area)
            .datum(list)
            .attr("id", "areaPath-".concat(this.props.uuid))
            .style("fill", this.props.fill)
            .style("stroke", this.props.stroke)
            .style("stroke-width", this.props.strokeWidth)
            .style("fill-opacity", this.props.fillOpacity)
            .attr("d", area);

        d3.select<SVGPathElement, ILineSeries>(this.tailArea)
            .attr("id", "tailAreaPath-".concat(this.props.uuid))
            .style("fill", this.props.fill)
            .style("stroke", this.props.stroke)
            .style("stroke-width", this.props.strokeWidth)
            .style("fill-opacity", this.props.fillOpacity);

        this.previousData = data;

    }

    _repaint(data: List<ILineSeries>) {
        const { xScale, yScale, area } = this.state;
        const dataArray = data.toArray();
        const tailData = this._getTailData(data);
        const translateRange = this._getTranslateRange(tailData);
        const mergedData = this._mergeData(tailData);

        const areaPath = d3.select<SVGPathElement, ILineSeries>(this.area);
        const tailAreaPath = d3.select<SVGPathElement, ILineSeries>(this.tailArea);

        yScale.domain([0, d3.max<ILineSeries, number>(dataArray, data => data.value * 1.5 )]);

        tailAreaPath
            .datum(tailData.toArray())
                .attr("d", area)
                .transition()
                    .duration(500)
                    .ease(d3.easeLinear)
                    .attr("transform", "translate(" + xScale(new Date(translateRange)) + ",0)");

        areaPath
            .datum(this.previousData.toArray())
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("d", area)
                .attr("transform", "translate(" + xScale(new Date(translateRange)) + ",0)")
            .on("end", function () {

                areaPath
                    .datum(data.toArray())
                    .attr("d", area);

                tailAreaPath
                    .attr("d", "");
            });

        this.previousData = data;
    }

    _getTailData(data: List<ILineSeries>): List<ILineSeries> {
        let list = List<ILineSeries>();

        const { xScale } = this.state;
        const startIndex = data.findIndex(value => value.time.getTime() === xScale.domain()[1].getTime());

        for (let index = startIndex ; index < data.size ; index++) {
            list = list.push(data.get(index));
        }

        return list;
    }

    _getTranslateRange(tailData: List<ILineSeries>): number {
        const { xScale } = this.state;
        const timeRange = tailData.last().time.getTime() - xScale.domain()[1].getTime();

        return xScale.domain()[0].getTime() - timeRange;
    }

    _mergeData(tailData: List<ILineSeries>): List<ILineSeries> {
        let list = this.previousData;

        tailData.slice(1).forEach( data => {
            list = list.push(data);
        });

        return list;
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
                <path ref={ (area) => { this.area = area as SVGPathElement; } }></path>
                <path ref={ (tailArea) => { this.tailArea = tailArea as SVGPathElement; } }></path>
            </g>
        );
    }
}
