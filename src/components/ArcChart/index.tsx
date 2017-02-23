import { IProps, IState } from "./model";

import * as React from "react";
import * as d3 from "d3";
import { DefaultArcObject } from "d3-shape";
import { BaseType, Selection } from "d3-selection";

export default class ArcChart extends React.PureComponent<IProps, IState> {

    svg: SVGElement;

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
            };
        };
    }

     _labelTween(data: number, label: Selection<BaseType, {}, null, undefined>) {
         return (datum: number) => {
             let interpolate = d3.interpolate(datum, data);

            return (t: number) => {
                label.text(Math.round(interpolate(t) * 100) + "%");
            };
         };
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
                    .innerRadius(arcDatum["innerRadius"])
                    .outerRadius(arcDatum["outerRadius"])
                    .startAngle(arcDatum["startAngle"]);

        this.setState({
            arcDatum: arcDatum,
            tau: tau,
            arc: arc,
            radius: radius,
            fontSize: 48
        });

    }

    _draw() {

        let state: IState = this.state;
        let svgWidth = this.props.svgWidth;
        let svgHeight = this.props.svgHeight;
        let data = this.props.data;
        let fontSize = state.fontSize;
        let transform = state.radius;
        let arcDatum = state.arcDatum;
        let arc = state.arc;
        let svg = d3.select(this.svg)
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

        let canvas = svg.append("g")
                      .attr("transform", "translate(" + transform + "," + transform + ")");

        let arcPath = canvas.append("path")
                        .datum<DefaultArcObject>(arcDatum)
                        .attr("class", "arc")
                        .attr("d", arc);

        let label = svg.append("text");

        arcPath.transition()
            .duration(750)
            .attrTween("d", this._arcTween(data));

        label.datum(0)
                .attr("class", "label")
                .attr("y", svgWidth / 2 + fontSize / 3)
                .attr("x", svgWidth / 4)
                .attr("width", svgWidth)
                .text("0%")
                .style("font-size", fontSize + "px")
                .transition()
                    .duration(1000)
                    .tween("text", this._labelTween(data, label));

        state.arcPath = arcPath;
        state.label = label;
        state.data = data;
        this.setState(state);
    }

    _repaint() {

        let state: IState = this.state;
        let oldData = state.data;
        let arcPath = state.arcPath;
        let label = state.label;
        let data = this.props.data;

        arcPath.transition()
            .duration(750)
            .attrTween("d", this._arcTween(data));

        label.datum(oldData)
            .transition()
                .duration(1000)
                .tween("text", this._labelTween(data, label));

        state.data = data;
        this.setState(state);
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
