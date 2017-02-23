import * as React from "react";
import { List } from "immutable";

import ArcChart from "./";


export default class ArcChartContainer extends React.PureComponent<any, any> {

    _generateData(): number {

        return Math.random();
    }

    componentWillMount() {
        this.setState({
            data: this._generateData()
        });
    }

    componentDidMount() {
        setInterval(() => {
            let data = this._generateData();
            this.setState({
                data: data
            });
        }, 3000);
    }

    render() {
        return (
            <ArcChart svgWidth={150} svgHeight={150} arcRadius={10} data={this.state.data} />
        );
    }
}
