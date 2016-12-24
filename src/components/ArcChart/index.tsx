import { IProps, IState } from './model';

import * as React from 'react';
import * as d3 from 'd3';
import { DefaultArcObject } from 'd3-shape';

export default class ArcChart extends React.PureComponent<IProps, IState> {

    svg: SVGElement

    constructor(props: IProps) {
        super(props);
    }

    _arcTween(data: number) {

        let newAngle = data * this.state.tau;
        let arc = this.state.arc;

        return (datum: DefaultArcObject) => {

            let interpolate = d3.interpolate(datum.endAngle, newAngle);

            return (t: number) => {
                datum.endAngle = interpolate(t);
                return arc(datum);
            }
        }
    }

    _initial() {

        let tau = 2 * Math.PI;
        let arcRadius = this.props.arcRadius;
        let svgWidth = this.props.svgWidth;
        let svgHeight = this.props.svgHeight;
        let radius = (svgWidth > svgHeight ? svgWidth : svgHeight) / 2;
        let arcDatum: DefaultArcObject = {
            innerRadius: radius - arcRadius,
            outerRadius: radius,
            startAngle: 0,
            endAngle: 0,
            padAngle: 0
        };
        let arc = d3.arc()
                    .innerRadius(arcDatum['innerRadius'])
                    .outerRadius(arcDatum['outerRadius'])
                    .startAngle(arcDatum['startAngle']);

        this.setState({
            arcDatum: arcDatum,
            tau: tau,
            arc: arc,
            radius: radius
        });

    }

    _draw() {

        let state: IState = this.state;
        let svgWidth = this.props.svgWidth;
        let svgHeight = this.props.svgHeight;
        let data = this.props.data;
        let transform = state.radius;
        let arcDatum = state.arcDatum;
        let arc = state.arc;
        let svg = d3.select(this.svg)
                    .attr('width', svgWidth)
                    .attr('height', svgHeight);

        let g = svg.append('g')
                      .attr('transform', 'translate(' + transform + ',' + transform + ')');

        let arcPath = g.append('path')
                        .datum<DefaultArcObject>(arcDatum)
                        .attr('class', 'arc')
                        .attr('d', arc);

        arcPath.transition()
            .duration(750)
            .attrTween('d', this._arcTween(data));


        state.arcPath = arcPath;
        this.setState(state);
    }

    _repaint() {

        let state: IState = this.state;
        let arcPath = state.arcPath;
        let data = this.props.data;

        arcPath.transition()
            .duration(750)
            .attrTween('d', this._arcTween(data));
    }

    componentWillMount() {
        this._initial();
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
