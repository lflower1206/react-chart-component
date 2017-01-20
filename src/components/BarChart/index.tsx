import { IProps, IState, IBarData } from './model';

import * as React from 'react';
import * as d3 from 'd3';
import { BaseType } from 'd3-selection';

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

        let self = this;
        let state: IState = this.state;
        let list: IBarData[] = this.props.data.toArray();
        let xScale = state.xScale;
        let yScale = state.yScale;
        let drawableHeight = state.drawableHeight;

        let svg = d3.select(this.svg)
                    .attr('width', this.props.svgWidth)
                    .attr('height', this.props.svgHeight);
        
        let canvas = svg.append('g')
                    .attr('id', 'canvas')
                    .attr('transform', 'translate(' + state.margin.left + ',' + state.margin.top + ')');

        xScale.domain(list.map( (barData) => barData.name) );
        yScale.domain([0, d3.max<IBarData>(list, (data) => data.value )]);

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

        let bars = canvas.selectAll('.bar')
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
                })
                .on('click', function() {
                    let bar = d3.select<BaseType, IBarData>(this);

                    self._drilldown(bar.data()[0]);
                });

        state.axisBottom = axisBottom;
        state.axisLeft = axisLeft;
        state.bars = bars;
        state.canvas = canvas;
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

    _drilldown(data: IBarData) {
        let state: IState = this.state;

        state.drilldownData = data;
        state.isDrilldownMode = true;
        this.setState(state);
    }

    _drawDrilldown(drilldownData: IBarData) {
        
        let state: IState = this.state;
        let canvas = state.canvas;
        let xScale = state.xScale;
        let yScale = state.yScale;
        let axisBottom = state.axisBottom;
        let axisLeft = state.axisLeft;
        let drawableHeight = state.drawableHeight;
        let bars = state.bars;
        let list = drilldownData.subData.toArray();
        let startX = xScale(drilldownData.name);
        let startY = yScale(drilldownData.value);
        let startHeight = drawableHeight - yScale(drilldownData.value);

        xScale.domain(list.map( (barData) => barData.name) );
        yScale.domain([0, d3.max<IBarData>(list, (data) => data.value )]);

        canvas.selectAll('g.axis--x')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + state.drawableHeight + ')')
            .call(d3.axisBottom(xScale));

        canvas.selectAll('g.axis--y')
            .call(d3.axisLeft(yScale))
                .append('text')
                .attr('fill', '#000')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '0.71em')
                .style('text-anchor', 'end');

        bars.transition()
            .duration(500)
            .style('opacity', 0)
            .remove();

        canvas.selectAll('.bar-2')
            .data(list)
            .enter()
                .append('rect')
                    .attr('class', 'bar-2')
                    .attr('x',  (data) => startX )
                    .attr('width', xScale.bandwidth())
                    .attr('y', (data) => startY )
                    .attr('height', (data) => startHeight )
                    .style('opacity', .1)
                    .on('mouseover', function() {
                        d3.select(this).classed('hover', true);
                    })
                    .on('mouseout', function() {
                        d3.select(this).classed('hover', false);
                    })
                .transition()
                .duration(500)
                    .attr('x',  (data) => xScale(data.name) )
                    .attr('y', (data) => yScale(data.value) )
                    .attr('height', (data) => drawableHeight - yScale(data.value) )
                    .style('opacity', 1);

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
            this._repaint();
        }
    }

    render() {
        return (
            <svg ref={ (svg) => { this.svg = svg; } }></svg>
        );
    }
}
