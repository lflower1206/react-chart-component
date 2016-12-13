import * as React from 'react'
import * as ReactDOM from 'react-dom'

import DrilldownLineChartContainer from './components/DrilldownLineChart/container'
import { ILineSeries } from './components/DrilldownLineChart/model';

ReactDOM.render(
    <DrilldownLineChartContainer />,
    document.getElementById('root')
);
