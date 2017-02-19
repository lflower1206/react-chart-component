import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LineChartContainer from './components/LineChart/container';
import BarChartContainer from './components/BarChart/container';
import ArcChartContainer from './components/ArcChart/container';

import { ILineSeries } from './components/LineChart/model';

import Chart from './components/ComposeChart/Chart';
import LineChart from './components/ComposeChart/LineChart';


ReactDOM.render(
    <div>
        <div>
            <LineChartContainer />
        </div>
        <div>
            <BarChartContainer />
        </div>
        <div>
            <ArcChartContainer />
        </div>
        <div>
            <Chart height={500} width={400}>
                <LineChart />
            </Chart>
        </div>
    </div>,
    document.getElementById('root')
);
