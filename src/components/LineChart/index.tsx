import { IProps, IState, ILineSeries } from './model';

import { List } from 'immutable';

import * as React from 'react';
import * as d3 from 'd3';

export default class LineChart extends React.PureComponent<IProps, IState> {

    svg: SVGElement

    constructor(props: IProps) {
        super(props);
    }

    static formatTime(date: Date):string {
        return d3.timeFormat('%H:%M:%S')(date);
    }

    getDots(list: ILineSeries[]) {
        return d3.select('#canvas').selectAll('circle').data(list);
    }

    _calculate() {

        let margin = {
            top: 20, right: 0, bottom: 20, left: 25
        };
        let drawableHeight = this.props.svgHeight - margin.top - margin.bottom;
        let drawableWidth = this.props.svgWidth - margin.left - margin.right;

        let xScale = d3.scaleTime()
                        .rangeRound([0, drawableWidth]);
    
        let yScale = d3.scaleLinear()
                        .range([drawableHeight, 0]);
                        
        var area = d3.area<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y0(drawableHeight)
                        .y1( (data: ILineSeries) => yScale(data.value) );
                        // .curve(d3.curveBasis);

        let line = d3.line<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y( (data: ILineSeries) => yScale(data.value) );
                        // .curve(d3.curveBasis);
        
        let tooltips = d3.select('body').append('div').attr('class', 'line-tooltip');
        

        this.setState({
            margin: margin,
            xScale: xScale,
            yScale: yScale,
            drawableHeight: drawableHeight,
            drawableWidth: drawableWidth,
            line: line,
            area: area,
            tooltips: tooltips,
            isDrilldownMode: false
        });
    }

    _draw() {

        let state: IState = this.state;
        let list: ILineSeries[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let line = state.line;
        let area = state.area;
        let tooltips = state.tooltips;
        let drawableHeight = state.drawableHeight;
        let drawableWidth = state.drawableWidth;

        let svg = d3.select(this.svg)
                    .attr('width', this.props.svgWidth)
                    .attr('height', this.props.svgHeight);

        let canvas = svg.append('g')
                    .attr('id', 'canvas')
                    .attr('transform', 'translate(' + state.margin.left + ',' + state.margin.top + ')');

        let rectClip = svg.append('clipPath')
                    .attr('id', 'rect-clip')
                    .append('rect')
                    .attr('width', 0)
                    .attr('height', drawableHeight);

        xScale.domain([list[0].time, list[list.length -1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        let axisBottom = canvas.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + state.drawableHeight + ')')
            .call(d3.axisBottom(xScale));

        let axisLeft = canvas.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(yScale))
            .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .style('text-anchor', 'end');
            
        let areaPath = canvas.append('path')
            .datum(list)
            .attr('class', 'area')
            .attr('d', area)
            .attr('clip-path', 'url(#rect-clip)');

        let linePath = canvas.append('path')
            .datum(list)
            .attr('class', 'line')
            .attr('d', line)
            .attr('clip-path', 'url(#rect-clip)');

        let dots = this.getDots(list);

        dots.enter().append('circle')
            .attr('class', 'dot')
            .attr('r', 10)
            .attr('cx', data => xScale(data.time))
            .attr('cy', data => yScale(data.value))
            .style('opacity', 0)
            .on('mouseover', function(data) {
                
                d3.select(this).style('opacity', 1);

                tooltips.transition()
                    .duration(200)
                    .style('opacity', .9);

                tooltips.html(LineChart.formatTime(data.time) + '<br/>' + data.value)
                    .style('left', (d3.event.pageX) + 'px')
                    .style('top', (d3.event.pageY - 28) + 'px');
            })
            .on("mouseout", function (data) {
                d3.select(this).style('opacity', 0);

                tooltips.transition()
                    .duration(200)
                    .style('opacity', 0);
            })
            .on('click', (data) => {
                this._drilldown(data);
                tooltips.transition()
                    .duration(200)
                    .style('opacity', 0);
            });

        rectClip.transition()
                .duration(1000)
                .attr('width', drawableWidth);

        state.axisBottom = axisBottom;
        state.axisLeft = axisLeft;
        state.areaPath = areaPath;
        state.linePath = linePath;
        state.rectClip = rectClip;

        this.setState(state);
    }

    _repaint(list: ILineSeries[]) {
        let state: IState = this.state;
        let xScale = state.xScale;
        let yScale = state.yScale;
        let axisBottom = state.axisBottom;
        let axisLeft = state.axisLeft;
        let area = state.area;
        let line = state.line;
        let areaPath = state.areaPath;
        let linePath = state.linePath;
        let tooltips = state.tooltips;
        let dots = this.getDots(list);

        xScale.domain([list[0].time, list[list.length -1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        axisBottom.call(d3.axisBottom(xScale));
        axisLeft.call(d3.axisLeft(yScale));

        areaPath
            .datum(list)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('d', area);

        linePath
            .datum(list)
            .transition()
            .duration(500)
            .ease(d3.easeLinear)
            .attr('d', line);

        dots.transition()
            .duration(500)
            .attr('cy', data => yScale(data.value));
        
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
        let dots = this.getDots(list);

        xScale.domain([list[0].time, list[list.length -1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        rectClip.attr('width', 0);

        axisBottom.call(d3.axisBottom(xScale));
        axisLeft.call(d3.axisLeft(yScale));
        

        areaPath
            .datum(list)
            // .transition()
            // .duration(500)
            // .ease(d3.easeLinear)
            .attr('d', area);

        linePath
            .datum(list)
            // .transition()
            // .duration(500)
            // .ease(d3.easeLinear)
            .attr('d', line);

        dots.transition()
            .duration(500)
            .attr('cx', data => xScale(data.time))
            .attr('cy', data => yScale(data.value));
        
        dots.exit().remove();

        rectClip.transition()
                .duration(1000)
                .attr('width', drawableWidth);

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
