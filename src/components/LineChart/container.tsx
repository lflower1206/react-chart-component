import * as React from "react";
import { List } from "immutable";

import LineChart from "./";
import { ILineSeries } from "./model";

export default class LineChartContainer extends React.PureComponent<any, any> {

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
            data: this._generateData()
        });
    }

    componentDidMount() {
        setInterval(() => {
            let data = this._updateData(this.state.data);
            this.setState({
                data: data
            });
        }, 5000);
    }

    render() {
        return (
            <LineChart svgWidth={500} svgHeight={400} drilldownRange={5} data={this.state.data} />
        );
    }
}
