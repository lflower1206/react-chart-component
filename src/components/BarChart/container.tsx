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

    _updateData(list: List<IBarData>): List<IBarData> {
        
        let newList = list.map<IBarData>((data) => {
            data['value'] = Math.floor(Math.random() * 10);
            return data;
        }).toList();

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
        }, 3000);
    }
    
    render() {
        return (
            <BarChart svgWidth={500} svgHeight={400} data={this.state.data} />
        );
    }
}
