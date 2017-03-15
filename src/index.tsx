import * as React from "react";
import * as ReactDOM from "react-dom";

import LineChartContainer from "./components/LineChart/container";
import BarChartContainer from "./components/BarChart/container";
import ArcChartContainer from "./components/ArcChart/container";

import { ILineSeries } from "./components/LineChart/model";

import LineChartDemoContainer from "./components/ComposedChart/LineChartDemoContainer";
import BarChartDemoContainer from "./components/ComposedChart/BarChartDemoContainer";
import AreaChartDemoContainer from "./components/ComposedChart/AreaChartDemoContainer";

ReactDOM.render(
    <div>
        <div>
            <LineChartDemoContainer />
        </div>
        <div>
            <AreaChartDemoContainer />
        </div>
        <div>
            <LineChartContainer />
        </div>
        <div>
            <BarChartContainer />
        </div>
        <div>
            <ArcChartContainer />
        </div><div>
            <BarChartDemoContainer />
        </div>
    </div>,
    document.getElementById("root")
);
