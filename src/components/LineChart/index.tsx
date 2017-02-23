import { Selection } from "d3-selection";
import { ScaleTime, ScaleLinear } from "d3-scale";
import { Bisector } from "d3-array";

import { List } from "immutable";

import * as React from "react";
import * as d3 from "d3";

import { IProps, IState, ILineSeries } from "./model";

export default class LineChart extends React.PureComponent<IProps, IState> {

    svg: SVGElement;

    constructor(props: IProps) {
        super(props);
    }

    static formatTime(date: Date): string {
        return d3.timeFormat("%H:%M:%S")(date);
    }

    _calculate() {

        let margin = {
            top: 20, right: 0, bottom: 20, left: 25
        };
        let drawableHeight = this.props.svgHeight - margin.top - margin.bottom;
        let drawableWidth = this.props.svgWidth - margin.left - margin.right;
        let bisectDate = d3.bisector<ILineSeries, Date>( data => data.time );

        let xScale = d3.scaleTime()
                        .rangeRound([0, drawableWidth]);

        let yScale = d3.scaleLinear()
                        .range([drawableHeight, 0]);

        let area = d3.area<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y0(drawableHeight)
                        .y1( (data: ILineSeries) => yScale(data.value) );

        let line = d3.line<ILineSeries>()
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
            isDrilldownMode: false
        });
    }

    _handleCoverMouseEvent(data: ILineSeries[],
                            xScale: ScaleTime<number, number>,
                            yScale: ScaleLinear<number, number>,
                            bisectDate: Bisector<ILineSeries, Date>) {

        let self = this;
        let canvas = d3.select(this.svg).select<SVGGElement>("#canvas");
        let dot = canvas.select<SVGCircleElement>("#dot");
        let cover = canvas.select<SVGRectElement>("#cover");

        // Remove handler before adding, to avoid superfluous handlers on elements.
        cover.on("mouseover", null)
                .on("mouseout", null)
                .on("mousemove", null);

        cover.on("mouseover", () => {
            dot.style("display", null);
        })
        .on("mouseout", () => {
            dot.style("display", "none");
        })
        .on("mousemove", function() {
            let x0 = xScale.invert(d3.mouse(this)[0]);
            let i = bisectDate.left(data, x0, 1);
            let d0 = data[i - 1];
            let d1 = data[i];
            let d = x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime() ? d1 : d0;

            dot.attr("cx", () => xScale(d.time))
                .attr("cy", () => yScale(d.value));
        })
        .on("click", function() {
            let x0 = xScale.invert(d3.mouse(this)[0]);
            let i = bisectDate.left(data, x0, 1);
            let d0 = data[i - 1];
            let d1 = data[i];
            let d = x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime() ? d1 : d0;

            self._drilldown(d);
        });
    }

    _draw() {

        let state: IState = this.state;
        let list: ILineSeries[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let line = state.line;
        let area = state.area;
        let drawableHeight = state.drawableHeight;
        let drawableWidth = state.drawableWidth;

        let svg = d3.select(this.svg)
                    .attr("width", this.props.svgWidth)
                    .attr("height", this.props.svgHeight);

        let canvas = svg.append<SVGGElement>("g")
                        .attr("id", "canvas")
                        .attr("transform", "translate(" + state.margin.left + "," + state.margin.top + ")");

        let clipPath = svg.append<SVGClipPathElement>("clipPath")
                            .attr("id", "rect-clip");

        let rectClip = clipPath.append<SVGRectElement>("rect")
                                .attr("width", 0)
                                .attr("height", drawableHeight);

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        let axisBottom = canvas.append<SVGGElement>("g")
                                .attr("class", "axis axis--x")
                                .attr("transform", "translate(0," + state.drawableHeight + ")")
                                .call(d3.axisBottom(xScale));

        let axisLeft = canvas.append<SVGGElement>("g")
                                .attr("class", "axis axis--y")
                                .call(d3.axisLeft(yScale));

        axisLeft.append<SVGTextElement>("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .style("text-anchor", "end");

        let areaPath = canvas.append<SVGPathElement>("path")
                                .datum(list)
                                .attr("class", "area")
                                .attr("d", area)
                                .attr("clip-path", "url(#rect-clip)");

        let linePath = canvas.append<SVGPathElement>("path")
                                .datum(list)
                                .attr("class", "line")
                                .attr("d", line)
                                .attr("clip-path", "url(#rect-clip)");

        canvas.append<SVGCircleElement>("circle")
                        .style("display", "none")
                        .attr("id", "dot")
                        .attr("class", "dot")
                        .attr("r", 10);

        canvas.append<SVGRectElement>("rect")
                .attr("id", "cover")
                .style("pointer-events", "all")
                .attr("width", drawableWidth)
                .attr("height", drawableHeight)
                .style("fill", "none");

        this._handleCoverMouseEvent(list, xScale, yScale, state.bisectDate);

        rectClip.transition()
                .duration(1000)
                .attr("width", drawableWidth);

        state.svg = svg;
        state.canvas = canvas;
        state.axisBottom = axisBottom;
        state.axisLeft = axisLeft;
        state.areaPath = areaPath;
        state.linePath = linePath;
        state.rectClip = rectClip;

        this.setState(state);
    }

    _repaint(list: ILineSeries[]) {
        let state: IState = this.state;
        let canvas = state.canvas;
        let xScale = state.xScale;
        let yScale = state.yScale;
        let axisBottom = state.axisBottom;
        let axisLeft = state.axisLeft;
        let area = state.area;
        let line = state.line;
        let areaPath = state.areaPath;
        let linePath = state.linePath;

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        axisBottom.call(d3.axisBottom(xScale));
        axisLeft.call(d3.axisLeft(yScale))
                .append("text")
                    .attr("fill", "#000")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end");

        areaPath
            .datum(list)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("d", area);

        linePath
            .datum(list)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr("d", line);

        this._handleCoverMouseEvent(list, xScale, yScale, state.bisectDate);

    }

    _drilldown(data: ILineSeries) {
        let state: IState = this.state;
        let index = this.props.data.indexOf(data);
        let start = index - 1 <= 0 ? index : index - 1;
        let end = index >= this.props.data.size - 2 ? index : index + 2;

        state.drilldownData = this.props.data.slice(start, end).toArray();
        state.isDrilldownMode = true;
        this.setState(state);
    }

    _drawDrilldown(list: ILineSeries[]) {

        let state: IState = this.state;
        let canvas = state.canvas;
        let drawableWidth = state.drawableWidth;
        let xScale = state.xScale;
        let yScale = state.yScale;
        let axisBottom = state.axisBottom;
        let axisLeft = state.axisLeft;
        let area = state.area;
        let line = state.line;
        let areaPath = state.areaPath;
        let linePath = state.linePath;
        let rectClip = state.rectClip;

        xScale.domain([list[0].time, list[list.length - 1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        rectClip.attr("width", 0);

        axisBottom.call(d3.axisBottom(xScale));
        axisLeft.call(d3.axisLeft(yScale));

        areaPath
            .datum(list)
            .attr("d", area);

        linePath
            .datum(list)
            .attr("d", line);

        rectClip.transition()
                .duration(1000)
                .attr("width", drawableWidth);

        state.drilldownData = undefined;
        state.isDrilldownFinish = true;
        this.setState(state);
    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {

        let shouldUpdate = true;

        if (this.state.isDrilldownMode && this.state.isDrilldownFinish) {
            return false;
        }

        return shouldUpdate;
    }

    componentWillMount() {
        this._calculate();
    }

    componentDidMount() {
        this._draw();
    }

    componentDidUpdate() {

        if (this.state.isDrilldownMode) {
            this._drawDrilldown(this.state.drilldownData);
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
