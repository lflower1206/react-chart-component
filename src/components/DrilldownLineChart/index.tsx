import { IProps, IState, ILineSeries } from './model';

import * as React from 'react';
import * as d3 from 'd3';

export default class DrilldownLineChart extends React.PureComponent<IProps, IState> {

    svg: SVGElement

    constructor(props: IProps) {
        super(props);
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
                        .y1( (data: ILineSeries) => yScale(data.value) )
                        .curve(d3.curveBasis);

        let line = d3.line<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y( (data: ILineSeries) => yScale(data.value) )
                        .curve(d3.curveBasis);

        this.setState({
            margin: margin,
            xScale: xScale,
            yScale: yScale,
            drawableHeight: drawableHeight,
            drawableWidth: drawableWidth,
            line: line,
            area: area
        });
    }

    _draw() {

        let state: IState = this.state;
        let list: ILineSeries[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let line = state.line;
        let area = state.area;

        let svg = d3.select(this.svg)
                    .attr('width', this.props.svgWidth)
                    .attr('height', this.props.svgHeight);
        
        let g = svg.append('g')
                    .attr('transform', 'translate(' + state.margin.left + ',' + state.margin.top + ')');

        xScale.domain([list[0].time, list[list.length -1].time]);

        // yScale.domain(d3.extent(list, (data) => {
        //     return data.value;
        // }));
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        let axisBottom = g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + state.drawableHeight + ')')
            .call(d3.axisBottom(xScale));

        let axisLeft = g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end');
            
        let areaPath = g.append('path')
            .datum(list)
            .attr('class', 'area')
            .attr('d', area);

        let linePath = g.append('path')
            .datum(list)
            .attr('class', 'line')
            .attr('d', line);

        state.axisBottom = axisBottom;
        state.axisLeft = axisLeft;
        state.areaPath = areaPath;
        state.linePath = linePath;
        this.setState(state);
    }

    _repaint() {
        let state: IState = this.state;
        let list: ILineSeries[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let axisBottom = state.axisBottom;
        let axisLeft = state.axisLeft;
        let area = state.area;
        let line = state.line;
        let areaPath = state.areaPath;
        let linePath = state.linePath;

        xScale.domain([list[0].time, list[list.length -1].time]);
        yScale.domain([0, d3.max<ILineSeries>(list, (data) => data.value * 1.5 )]);

        axisBottom.call(d3.axisBottom(xScale));
        axisLeft.call(d3.axisLeft(yScale))

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
    }

    componentWillMount() {
        this._calculate();
    }

    componentDidMount() {
        this._draw();
    }

    componentDidUpdate() {
        this._repaint();
    }

    render() {
        return (
            <svg ref={ (svg) => { this.svg = svg; } }></svg>
        );
    }
}
