import * as React from "react";
import { List } from "immutable";

import AxisLeft from "./Axis/axisLeft";
import AxisBottom from "./Axis/axisBottom";
import { ScaleType } from "./Axis/model";

import ChartContainer from "./ChartContainer/";
import AreaChart from "./AreaChart/";

import { ILineSeries } from "./LineChart/model";

interface LineChartDemoContainerState {
    areaChartData1: List<ILineSeries>;
    areaChartData2: List<ILineSeries>;
}

export default class AreaChartDemoContainer extends React.PureComponent<any, LineChartDemoContainerState> {

    _generateData(): List<ILineSeries> {

        let list = List<ILineSeries>();
        let now = Date.now();

        for (let i = 0 ; i < 50 ; i++) {
            list = list.push({
                time: new Date(now + (i * 5000)),
                value: Math.floor(Math.random() * 10) + 10
            });
        }

        return list;
    }

    _updateData(list: List<ILineSeries>): List<ILineSeries> {
        let newList = list.shift();
        let lastData = newList.get(newList.size - 1);
        let lastTime = lastData.time.getTime();
        let count = Math.random();

        newList = newList.push( {
            time: new Date(lastTime + 5000),
            value: Math.floor(Math.random() * 100 * count) + 10
        });

        return newList;
    }

    componentWillMount() {
        this.setState({
            areaChartData1: this._generateData(),
            areaChartData2: this._generateData()
        });
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                areaChartData1: this._updateData(this.state.areaChartData1),
                areaChartData2: this._updateData(this.state.areaChartData2)
            });
        }, 1000);
    }

    render() {

        const state = this.state;

        return (
            <ChartContainer svgHeight={300} svgWidth={800}>
                <AxisLeft data={state.areaChartData1} />
                <AxisBottom data={state.areaChartData1} scaleType={ ScaleType.Time } />
                <AreaChart data={state.areaChartData1} fill="#E59FA1" fillOpacity="1" />
                <AreaChart data={state.areaChartData2} fill="#8CC09D" fillOpacity="1" />
            </ChartContainer>
        );
    }
}
