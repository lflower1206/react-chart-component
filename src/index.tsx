import * as React from "react";
import * as ReactDOM from "react-dom";

import LineChartContainer from "./components/LineChart/container";
import BarChartContainer from "./components/BarChart/container";
import ArcChartContainer from "./components/ArcChart/container";

import { ILineSeries } from "./components/LineChart/model";

import LineChartDemoContainer from "./components/ComposedChart/LineChartDemoContainer";
import BarChartDemoContainer from "./components/ComposedChart/BarChartDemoContainer";

ReactDOM.render(
    <div>
        <div>
            <LineChartDemoContainer />
        </div>
        {/*<div>
            <BarChartDemoContainer />
        </div>
        <div>
            <ArcChartContainer />
        </div>
        <div>
            <LineChartContainer />
        </div>
        <div>
            <BarChartContainer />
        </div>*/}
    </div>,
    document.getElementById("root")
);
