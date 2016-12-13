import * as React from 'react';
import { List } from 'immutable';

import DrilldownLineChart from './';
import { ILineSeries } from './model';

export default class DrilldownLineChartContainer extends React.PureComponent<any, any> {

    _generateData(): List<ILineSeries> {

        let list = List<ILineSeries>();

        let now = Date.now();

        for (let i = 0 ; i < 12 ; i++) {
            list = list.push({
                time: new Date(now - (i * 5000)), 
                value: Math.floor(Math.random() * 100)
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
            value: Math.floor(Math.random() * 100)
        });

        return newList;
    }

    componentWillMount() {
        this.setState({
            data: this._generateData()
        });
    }

    componentDidMount() {
        // setTimeout(() => {
        //     let state = this._updateData(this.state.data);
        //     this.setState({
        //         data: state
        //     });
        // }, 1000);
    }

    render() {
        return (
            <DrilldownLineChart svgWidth={500} svgHeight={400} data={this.state.data} />
        );
    }
}