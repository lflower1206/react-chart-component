import { IProps, IState, ILineSeries } from './model';

import { List } from 'immutable';
import * as React from 'react';
import * as d3 from 'd3';

export default class DrilldownLineChart extends React.PureComponent<IProps, IState> {

    svg: SVGElement
    data: List<ILineSeries>

    constructor(props: IProps) {
        super(props);
    }

    _generateData(): List<ILineSeries> {

        let list = List<ILineSeries>();

        let now = Date.now();

        for (let i = 0 ; i < 6 ; i++) {

            list = list.push({
                time: now - (i * 10), 
                value: Math.floor(Math.random() * 100)
            });
        }

        return list;
    }

    _updateData(list: List<ILineSeries>): List<ILineSeries> {
        let newList = list.shift();
        let lastData = newList.get(newList.size);
        let lastTime = lastData.time;

        newList = newList.push( {
            time: lastTime + 10,
            value: Math.floor(Math.random() * 100)
        });

        return newList;
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

        let line = d3.line<ILineSeries>()
                        .x((data:ILineSeries) => data.time)
                        .y((data:ILineSeries) => data.value);

        this.setState({
            data: this._generateData(),
            margin: margin,
            xScale: xScale,
            yScale: yScale,
            drawableHeight: drawableHeight,
            drawableWidth: drawableWidth,
            line: line
        });
    }

    _draw() {

        let list: ILineSeries[] = this.state.data.toArray();

        let xScale = this.state.xScale;
        let yScale = this.state.yScale;
        let line = this.state.line;

        let svg = d3.select(this.svg)
                    .attr('width', this.props.svgWidth)
                    .attr('height', this.props.svgHeight);
        
        let g = svg.append('g').attr('transform', 'translate(' + this.state.margin.left + ',' + this.state.margin.top + ')');

        xScale.domain(d3.extent(list, (data) => {
            console.log('xScale');
            console.log(data);
            return data.time;
        } ));
        yScale.domain(d3.extent(list, (data) => {
            console.log('yScale');
            console.log(data);
            return data.value;
        }));

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.state.drawableHeight + ')')
            .call(d3.axisBottom(xScale));

        g.append('g')
            .attr('class', 'axis axis--y')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('fill', '#000')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '0.71em')
            .style('text-anchor', 'end')
            .text('Price ($)');

        g.append('path')
            .datum(list)
            .attr('class', 'line')
            .attr('d', line);
    }

    componentWillMount() {
        this._calculate();
    }

    componentDidMount() {
        this._draw();
    }

    render() {
        return (
            <div>
                <h1>Hello Drilldown</h1>
                <svg ref={ (svg) => { this.svg = svg; } }></svg>
            </div>
        );
    }
}
