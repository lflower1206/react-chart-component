import * as React from "react";
import { List } from "immutable";

import ChartContainer from "./ChartContainer/";
import BarChart from "./BarChart/";
import { IBarData } from "./BarChart/model";

interface LineChartDemoContainerState {
    BarChartData: List<IBarData>;
}

export default class BarChartDemoContainer extends React.PureComponent<any, LineChartDemoContainerState> {

    static getDataList(): List<IBarData> {

        let list = List<IBarData>();

        for (let i = 97 ; i < 107 ; i++) {
            list = list.push({
                name: String.fromCharCode(i),
                value: Math.floor(Math.random() * 100)
            });
        }

        return list;
    }

    _generateData(): List<IBarData> {

        let list = BarChartDemoContainer.getDataList();

        return list;
    }

    _updateData(list: List<IBarData>): List<IBarData> {

        let newList = list.map<IBarData>((data) => {
            data["value"] = Math.floor(Math.random() * 100);
            return data;
        }).toList();

        return newList;
    }

    componentWillMount() {
        this.setState({
            BarChartData: this._generateData()
        });
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                BarChartData: this._updateData(this.state.BarChartData)
            });
        }, 5000);
    }

    render() {

        const state = this.state;

        return (
            <ChartContainer svgHeight={500} svgWidth={400}>
                <BarChart data={state.BarChartData} fill="#1B813E" />
            </ChartContainer>
        );
    }
}
