import * as React from "react";
import * as d3 from "d3";
import { ScaleTime, ScaleBand } from "d3-scale";
import { Axis } from "d3-axis";

import { List } from "immutable";

import { PropsDataType } from "./model";
import { ScaleType } from "./model";
import { ILineSeries } from "../LineChart/model";
import { IBarData } from "../BarChart/model";


interface IProps {
    readonly canvasHeight?: number;
    readonly canvasWidth?:  number;
    readonly data:          PropsDataType;
    readonly scaleType:     ScaleType;
};

interface IState {
    xScale: ScaleTime<number, number> | ScaleBand<string>;
};

export default class AxisBottom extends React.PureComponent<IProps, IState> {

    group: SVGGElement;

    constructor(props: IProps) {
        super(props);
    }

    _init() {

        const { canvasWidth } = this.props;
        let xScale;

        switch (this.props.scaleType) {
            case ScaleType.Band:
                xScale = d3.scaleBand<string>()
                         .range([0, canvasWidth])
                         .paddingInner(.2);
                break;
            case ScaleType.Time:
                xScale = d3.scaleTime()
                         .rangeRound([0, canvasWidth]);
                break;
        }

        this.setState({
            xScale: xScale
        });

    }

    _paint(list: ILineSeries[] | IBarData[]) {

        const { canvasHeight } = this.props;
        const { xScale } = this.state;
        const axisBottom = d3.select<SVGGElement, any>(this.group);
        let domain: Date[] | string[];
        let axis;

        switch (this.props.scaleType) {
            case ScaleType.Band:
                domain = (list as IBarData[]).map<string>(data => data.name);
                (xScale as ScaleBand<string>).domain(domain);
                axis = d3.axisBottom<string>((xScale as ScaleBand<string>));
                break;
            case ScaleType.Time:
                domain = [(list[0] as ILineSeries).time, (list[list.length - 1]  as ILineSeries).time];
                (xScale as ScaleTime<number, number>).domain(domain);
                axis = d3.axisBottom<Date>((xScale as ScaleTime<number, number>));
                break;
        }

        axisBottom.attr("transform", "translate(0," + canvasHeight + ")")
                    .transition()
                        .duration(500)
                        .call(axis);
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
