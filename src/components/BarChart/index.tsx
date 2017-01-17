import { IProps, IState, IBarData } from './model';

import * as React from 'react';
import * as d3 from 'd3';

export default class BarChart extends React.PureComponent<IProps, IState> {

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

        let xScale = d3.scaleBand()
                        .range([0, drawableWidth])
                        .paddingInner(.2);
    
        let yScale = d3.scaleLinear()
                        .range([drawableHeight, 0]);

        this.setState({
            margin: margin,
            xScale: xScale,
            yScale: yScale,
            drawableHeight: drawableHeight,
            drawableWidth: drawableWidth
        });
    }

    _draw() {

        let state: IState = this.state;
        let list: IBarData[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let drawableHeight = state.drawableHeight;

        let svg = d3.select(this.svg)
                    .attr('width', this.props.svgWidth)
                    .attr('height', this.props.svgHeight);
        
        let g = svg.append('g')
                    .attr('transform', 'translate(' + state.margin.left + ',' + state.margin.top + ')');

        xScale.domain(list.map( (barData) => barData.name) );
        yScale.domain([0, d3.max<IBarData>(list, (data) => data.value )]);

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

        let bars = g.selectAll('.bar')
            .data(list)
            .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x',  (data) => xScale(data.name) )
                .attr('width', xScale.bandwidth())
                .attr('y', (data) => yScale(data.value) )
                .attr('height', (data) => drawableHeight - yScale(data.value) )
                .on('mouseover', function() {
                    d3.select(this).classed('hover', true);
                })
                .on('mouseout', function() {
                    d3.select(this).classed('hover', false);
                });

        state.axisBottom = axisBottom;
        state.axisLeft = axisLeft;
        state.bars = bars;
        this.setState(state);
        
    }

    _repaint() {
        let state: IState = this.state;
        let list: IBarData[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let drawableHeight = state.drawableHeight;
        let axisLeft = state.axisLeft;
        let bars = state.bars;

        yScale.domain([0, d3.max<IBarData>(list, (data) => data.value * 1.5 )]);

        axisLeft.call(d3.axisLeft(yScale));

        bars.data(list)
            .transition()
            .duration(500)
                .attr('y', (data) => yScale(data.value) )
                .attr('height', (data) => {
                    return drawableHeight - yScale(data.value) 
                });
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
