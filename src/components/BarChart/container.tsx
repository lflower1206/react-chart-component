import * as React from 'react';
import { List } from 'immutable';

import BarChart from './';
import { IBarData } from './model';

export default class DrilldownLineChartContainer extends React.PureComponent<any, any> {

    _generateData(): List<IBarData> {

        let list = List<IBarData>();

        for (let i = 97 ; i < 107 ; i++) {
            list = list.push({
                name: String.fromCharCode(i),
                value: Math.floor(Math.random() * 10)
            });
        }

        return list;
    }

    componentWillMount() {
        this.setState({
            data: this._generateData()
        });
    }
    
    render() {
        return (
            <BarChart svgWidth={500} svgHeight={400} data={this.state.data} />
        );
    }
}
