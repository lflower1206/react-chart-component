import * as React from "react";

import * as d3 from "d3";
import { ScaleLinear } from "d3-scale";

import { List } from "immutable";

import { PropsDataType } from "./model";
import { ILineSeries } from "../LineChart/model";
import { IBarData } from "../BarChart/model";

interface IProps {
    readonly canvasHeight?: number;
    readonly data:          PropsDataType;
    readonly ticks?:        number;
};

interface IState {
    yScale: ScaleLinear<number, number>;
};

export default class AxisLeft extends React.PureComponent<IProps, IState> {

    group: SVGGElement;

    constructor(props: IProps) {
        super(props);
    }

    static get defaultProps(): IProps {
        return {
            data: List<ILineSeries>(),
            ticks: 4
        };
    }

    _init() {

        const { canvasHeight } = this.props;
        const yScale = d3.scaleLinear()
                        .range([canvasHeight, 0]);

        this.setState({
            yScale: yScale
        });
    }

    _paint(list: ILineSeries[] | IBarData[]) {
        const { yScale } = this.state;
        const axisLeft = d3.select<SVGGElement, number>(this.group);

        yScale.domain([0, d3.max<any, number>(list, data => data.value * 1.5 )]);

        axisLeft.transition()
                    .duration(500)
                    .call(d3.axisLeft(yScale).ticks(this.props.ticks));
    }

    componentWillMount() {
        this._init();
    }

    componentDidMount() {
        this._paint(this.props.data.toArray());
    }

    componentDidUpdate() {
        this._paint(this.props.data.toArray());
    }

    render() {
        return (
            <g ref={ (group) => { this.group = group as SVGGElement; } }></g>
        );
    }
}
