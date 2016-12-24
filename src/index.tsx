import * as React from 'react';
import * as ReactDOM from 'react-dom';

import LineChartContainer from './components/LineChart/container';
import BarChartContainer from './components/BarChart/container';

import { ILineSeries } from './components/LineChart/model';

ReactDOM.render(
    <div>
        <LineChartContainer />
        <BarChartContainer />
    </div>,
    document.getElementById('root')
);
