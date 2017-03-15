import * as React from "react";
import * as d3 from "d3";
import { List } from "immutable";

import { IProps, IState, IBarData } from "./model";

export default class BarChart extends React.PureComponent<IProps, IState> {

    group: SVGGElement;

    constructor(props: IProps) {
        super(props);
    }

    static get defaultProps(): IProps {
        return {
            fill: "#22BAD9",
            data: List<IBarData>()
        };
    }

    _init() {
        const { canvasHeight, canvasWidth } = this.props;

        let xScale = d3.scaleBand()
                        .range([0, canvasWidth])
                        .padding(.2);

        let yScale = d3.scaleLinear()
                        .range([canvasHeight, 0]);

        this.setState({
            xScale: xScale,
            yScale: yScale
        });
    }

    _paint(list: IBarData[]) {
        const { canvasHeight } = this.props;
        const { xScale, yScale } = this.state;

        xScale.domain(list.map( (barData) => barData.name) );
        yScale.domain([0, d3.max<IBarData, number>(list, data => data.value )]);

        d3.select(this.group)
            .selectAll(".bar")
            .data(list)
            .enter()
                .append("rect")
                .attr("class", "bar")
                .style("fill", this.props.fill)
                .attr("x",  (data) => xScale(data.name) )
                .attr("width", xScale.bandwidth())
                .attr("y", (data) => yScale(data.value) )
                .attr("height", (data) => canvasHeight - yScale(data.value) )
                .on("mouseover", function() {
                    d3.select(this).classed("hover", true);
                })
                .on("mouseout", function() {
                    d3.select(this).classed("hover", false);
                });
    }

    _repaint(list: IBarData[]) {

        const { canvasHeight } = this.props;
        const { yScale } = this.state;

        yScale.domain([0, d3.max<IBarData, number>(list, data => data.value * 1.5 )]);

        d3.select(this.group)
            .selectAll(".bar")
            .data(list)
            .transition()
            .duration(500)
                .attr("y", (data) => yScale(data.value) )
                .attr("height", (data) => {
                    return canvasHeight - yScale(data.value);
                });
    }

    shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        return this.props.data !== nextProps.data;
    }

    componentWillMount() {
        this._init();
    }

    componentDidMount() {
        this._paint(this.props.data.toArray());
    }

    componentDidUpdate() {
        this._repaint(this.props.data.toArray());
    }

    render() {
        return (
            <g ref={ (group) => { this.group = group as SVGGElement; } }></g>
        );
    }
}
