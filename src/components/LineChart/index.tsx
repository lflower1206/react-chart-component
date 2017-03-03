import { Selection } from "d3-selection";
import { ScaleTime, ScaleLinear } from "d3-scale";
import { Bisector } from "d3-array";

import { List } from "immutable";

import * as React from "react";
import * as d3 from "d3";

import { IProps, IState, ILineSeries } from "./model";
import componentUtil from "../../util/component-util";

export default class LineChart extends React.PureComponent<IProps, IState> {

    uuid:           string;
    svg:            SVGElement;
    canvas:         Selection<SVGGElement, {}, HTMLElement, any>;
    axisBottom:     Selection<SVGGElement, {}, HTMLElement, any>;
    axisLeft:       Selection<SVGGElement, {}, HTMLElement, any>;
    areaPath:       Selection<SVGGElement, ILineSeries[], HTMLElement, any>;
    linePath:       Selection<SVGGElement, ILineSeries[], HTMLElement, any>;
    clipPath:       Selection<SVGClipPathElement, {}, null, undefined>;
    rectClip:       Selection<SVGRectElement, {}, null, undefined>;
    dot:            Selection<SVGCircleElement, {}, null, undefined>;
    cover:          Selection<SVGRectElement, {}, null, undefined>;

    constructor(props: IProps) {
        super(props);
        this.uuid = componentUtil.getComponentUUID();
    }

    static formatTime(date: Date): string {
        return d3.timeFormat("%H:%M:%S")(date);
    }

    _calculate() {

        const margin = {
            top: 20, right: 0, bottom: 20, left: 25
        };
        const drawableHeight = this.props.svgHeight - margin.top - margin.bottom;
        const drawableWidth = this.props.svgWidth - margin.left - margin.right;
        const bisectDate = d3.bisector<ILineSeries, Date>( data => data.time );

        const xScale = d3.scaleTime()
                        .rangeRound([0, drawableWidth]);

        const yScale = d3.scaleLinear()
                        .range([drawableHeight, 0]);

        const area = d3.area<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y0(drawableHeight)
                        .y1( (data: ILineSeries) => yScale(data.value) );

        const line = d3.line<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y( (data: ILineSeries) => yScale(data.value) );

        this.setState({
            margin: margin,
            xScale: xScale,
            yScale: yScale,
            drawableHeight: drawableHeight,
            drawableWidth: drawableWidth,
            bisectDate: bisectDate,
            line: line,
            area: area,
            isDrilldownMode: false,
            drilldownRange: this.props.drilldownRange || 3
        });
    }

    _handleCoverMouseEvent(data: ILineSeries[],
                            xScale: ScaleTime<number, number>,
                            yScale: ScaleLinear<number, number>,
                            bisectDate: Bisector<ILineSeries, Date>) {

        const self = this;
        const canvas = this.canvas;

        // Remove handler before adding, to avoid superfluous handlers on elements.
        this.cover.on("mouseover", null)
                .on("mouseout", null)
                .on("mousemove", null);

        this.cover.on("mouseover", () => {
            this.dot.style("display", null);
        })
        .on("mouseout", () => {
            this.dot.style("display", "none");
        })
        .on("mousemove", function() {
            let x0 = xScale.invert(d3.mouse(this)[0]);
            let i = bisectDate.left(data, x0, 1);
            let d0 = data[i - 1];
            let d1 = data[i];
            let d = x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime() ? d1 : d0;

            self.dot.attr("cx", () => xScale(d.time))
                    .attr("cy", () => yScale(d.value));
        })
        .on("click", function() {
            let x0 = xScale.invert(d3.mouse(this)[0]);
            let index = bisectDate.left(data, x0, 1);
            let d0 = data[index - 1];
            let d1 = data[index];
            let d = x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime() ? d1 : d0;

            self._drilldown(index);
        });
    }

    _draw(list: ILineSeries[]) {

        const clipPathId = "clipPath-".concat(this.uuid);
        const clipPathURL = "url(#".concat(clipPathId).concat(")");
        const state = this.state;
        const xScale = state.xScale;
        const yScale = state.yScale;
        const line = state.line;
        const area = state.area;
        const drawableHeight = state.drawableHeight;
        const drawableWidth = state.drawableWidth;
        const selectionSVG = d3.select(this.svg)
                                .attr("width", this.props.svgWidth)
                                .attr("height", this.props.svgHeight);

        this.canvas = selectionSVG.append<SVGGElement>("g")
                                    .attr("id", "canvas-".concat(this.uuid))
                                    .attr("transform", "translate(" + state.margin.left + "," + state.margin.top + ")");

        this.clipPath = selectionSVG.append<SVGClipPathElement>("clipPath")
                                    .attr("id", clipPathId);

        this.rectClip = this.clipPath.append<SVGRectElement>("rect")
                                    .attr("id", "rectClip-".concat(this.uuid))
                                    .attr("width", 0)
                                    .attr("height", drawableHeight);

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        this.axisBottom = this.canvas.append<SVGGElement>("g")
                                    .attr("id", "axisX-".concat(this.uuid))
                                    .attr("class", "axis axis--x")
                                    .attr("transform", "translate(0," + state.drawableHeight + ")")
                                    .call(d3.axisBottom(xScale));

        this.axisLeft = this.canvas.append<SVGGElement>("g")
                                    .attr("id", "axisY-".concat(this.uuid))
                                    .attr("class", "axis axis--y")
                                    .call(d3.axisLeft(yScale));

        this.axisLeft.append<SVGTextElement>("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end");

        this.areaPath = this.canvas.append<SVGPathElement>("path")
                                .datum(list)
                                .attr("id", "areaPath-".concat(this.uuid))
                                .attr("class", "area")
                                .attr("d", area)
                                .attr("clip-path", clipPathURL);

        this.linePath = this.canvas.append<SVGPathElement>("path")
                                .datum(list)
                                .attr("id", "linePath-".concat(this.uuid))
                                .attr("class", "line")
                                .attr("d", line)
                                .attr("clip-path", clipPathURL);

        this.dot = this.canvas.append<SVGCircleElement>("circle")
                                .style("display", "none")
                                .attr("id", "dot")
                                .attr("class", "dot")
                                .attr("r", 5);

        this.cover = this.canvas.append<SVGRectElement>("rect")
                                .attr("id", "cover")
                                .style("pointer-events", "all")
                                .attr("width", drawableWidth)
                                .attr("height", drawableHeight)
                                .style("fill", "none");

        this.rectClip.transition()
                    .duration(1000)
                    .attr("width", drawableWidth);

        this._handleCoverMouseEvent(list, xScale, yScale, state.bisectDate);
    }

    _repaint(list: ILineSeries[]) {

        const state: IState = this.state;
        const xScale = state.xScale;
        const yScale = state.yScale;
        const area = state.area;
        const line = state.line;

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        this.axisBottom.call(d3.axisBottom(xScale));
        this.axisLeft.call(d3.axisLeft(yScale))
                .append("text")
                    .attr("fill", "#000")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end");

        this.areaPath
            .datum(list)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("d", area);

        this.linePath
            .datum(list)
                .attr("transform", null)
            .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("d", line);

        this._handleCoverMouseEvent(list, xScale, yScale, state.bisectDate);
    }

    _drilldown(dataIndex: number) {
        let state = Object.assign<object, IState>({}, this.state);
        let startIndex = 0;
        let endIndex = 0;
        let range = 0;
        const dataSize = this.props.data.size - 1;

        if (state.drilldownRange >= dataSize) {
            return;
        }

        range = Math.floor(state.drilldownRange / 2);

        if (state.drilldownRange % 2 > 0) {
            startIndex = dataIndex - range;
            endIndex = dataIndex + range + 1;
        } else {
            startIndex = dataIndex - range;
            endIndex = dataIndex + range;
        }

        while (startIndex < 0) {
            startIndex -= 1;
            endIndex += 1;
        }

        while (endIndex > dataSize) {
            startIndex += 1;
            endIndex -= 1;
        }

        state.drilldownData = this.props.data.slice(startIndex, endIndex).toList();
        state.isDrilldownMode = true;
        this.setState(state);
    }

    _drawDrilldown(list: ILineSeries[]) {

        let state: IState = this.state;
        let drawableWidth = state.drawableWidth;
        let xScale = state.xScale;
        let yScale = state.yScale;
        let area = state.area;
        let line = state.line;

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries, number>(list, data => data.value * 1.5 )]);

        this.rectClip.attr("width", 0);

        this.axisBottom.call(d3.axisBottom(xScale));
        this.axisLeft.call(d3.axisLeft(yScale));

        this.areaPath.datum(list)
                    .attr("d", area);

        this.linePath.datum(list)
                    .attr("d", line);

        this.rectClip.transition()
                    .duration(1000)
                    .attr("width", drawableWidth);

        state.drilldownData = undefined;
        this.setState(state);
    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {

        let shouldUpdate = true;

        if (this.state.isDrilldownMode && ! this.state.drilldownData) {
            shouldUpdate = false;
        }

        return shouldUpdate;
    }

    componentWillMount() {
        this._calculate();
    }

    componentDidMount() {
        this._draw(this.props.data.toArray());
    }

    componentDidUpdate() {

        // this._repaint(this.props.data.toArray());

        if (this.state.isDrilldownMode) {
            this._drawDrilldown(this.state.drilldownData.toArray());
        } else {
            this._repaint(this.props.data.toArray());
        }

    }

    render() {
        return (
            <svg ref={ (svg) => { this.svg = svg; } }></svg>
        );
    }
}
