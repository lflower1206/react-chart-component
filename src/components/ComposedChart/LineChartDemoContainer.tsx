import * as React from "react";
import { List } from "immutable";

import AxisLeft from "./Axis/axisLeft";
import AxisBottom from "./Axis/axisBottom";
import { ScaleType } from "./Axis/model";

import ChartContainer from "./ChartContainer/";
import LineChart from "./LineChart/";
import AreaChart from "./AreaChart/";

import { ILineSeries } from "./LineChart/model";

interface LineChartDemoContainerState {
    lineChartData1: List<ILineSeries>;
    lineChartData2: List<ILineSeries>;
}

export default class LineChartDemoContainer extends React.PureComponent<any, LineChartDemoContainerState> {

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
            lineChartData1: this._generateData(),
            lineChartData2: this._generateData()
        });
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                lineChartData1: this._updateData(this.state.lineChartData1),
                lineChartData2: this._updateData(this.state.lineChartData2)
            });
        }, 1000);
    }

    render() {

        const state = this.state;

        return (
            <ChartContainer svgHeight={300} svgWidth={800}>
                <AxisLeft data={state.lineChartData1} />
                <AxisBottom data={state.lineChartData1} scaleType={ ScaleType.Time } />
                <AreaChart data={state.lineChartData1} fill="#E59FA1" fillOpacity="1" />
                <LineChart data={state.lineChartData1} stroke="#CB4042" />
                <AreaChart data={state.lineChartData2} fill="#8CC09D" fillOpacity="1" />
                <LineChart data={state.lineChartData2} stroke="#1B813E"/>
            </ChartContainer>
        );
    }
}
