import * as React from 'react';
import * as ReactDOM from 'react-dom';

import DrilldownLineChartContainer from './components/DrilldownLineChart/container';
import BarChartContainer from './components/BarChart/container';

import { ILineSeries } from './components/DrilldownLineChart/model';

ReactDOM.render(
    <div>
        <DrilldownLineChartContainer />
        <BarChartContainer />
    </div>,
    document.getElementById('root')
);
