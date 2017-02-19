import * as React from 'react';
import * as d3 from 'd3';

import { IProps, IState, ILineSeries } from './model';

export default class LineChart extends React.PureComponent<IProps, IState> {
    

    constructor(props: IProps) {
        super(props);
    }

    _init() {
        const { canvasHeight, canvasWidth } = this.props;
        

        const xScale = d3.scaleTime()
                        .rangeRound([0, canvasWidth]);
    
        const yScale = d3.scaleLinear()
                        .range([canvasHeight, 0]);
        
        const line = d3.line<ILineSeries>()
                        .x( (data: ILineSeries) => xScale(data.time) )
                        .y( (data: ILineSeries) => yScale(data.value) );
        
        this.setState({
            xScale: xScale,
            yScale: yScale,
            line: line
        });
    }

    componentWillMount() {
        this._init();
    }
    
    render() {

        console.log(this.props);

        return (
            <text>Line Chart</text>
        );
    }
}
