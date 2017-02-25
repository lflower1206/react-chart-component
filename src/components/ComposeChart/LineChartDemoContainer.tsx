import * as React from "react";
import { List } from "immutable";

import ChartContainer from "./ChartContainer/";
import LineChart from "./LineChart/";
import { ILineSeries } from "./LineChart/model";

interface LineChartDemoContainerState {
    lineChartData: List<ILineSeries>;
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

        newList = newList.push( {
            time: new Date(lastTime + 5000),
            value: Math.floor(Math.random() * 10) + 10
        });

        return newList;
    }

    componentWillMount() {
        this.setState({
            lineChartData: this._generateData()
        });
    }

    componentDidMount() {
        setInterval(() => {
            let data = this._updateData(this.state.lineChartData);
            this.setState({
                lineChartData: data
            });
        }, 5000);
    }

    render() {

        const state = this.state;

        return (
            <ChartContainer svgHeight={500} svgWidth={400}>
                <LineChart data={state.lineChartData}/>
            </ChartContainer>
        );
    }
}
