import * as React from 'react';

import { IProps, IState, Margin } from './model';
import { IProps as LineChartIProps } from '../LineChart/model';

export default class ComposeChart extends React.PureComponent<IProps, IState> {
    
    svg: SVGElement
    defaultMargin: Margin = {
        top: 20,
        right: 0,
        bottom: 20,
        left: 25
    }

    constructor(props: IProps) {
        super(props);
    }

    _init() {
        const svgMargin    = this.props.margin || this.defaultMargin;
        const canvasHeight = this.props.height - svgMargin.top - svgMargin.bottom;
        const canvasWidth  = this.props.width - svgMargin.left - svgMargin.right;
        const canvasID     = 'compose-'.concat(Date.now().toString());

        this.setState({
            svgMargin:    svgMargin,
            canvasID:     canvasID,
            canvasHeight: canvasHeight,
            canvasWidth:  canvasWidth
        });
    }

    componentWillMount() {
        this._init();
    }

    render() {
        
        const { 
            canvasID,
            canvasHeight,
            canvasWidth 
        } = this.state;

        const childrenWithCustomProps: React.ReactChild[] = React.Children.map(this.props.children, child => {
            return React.cloneElement(child as React.ReactElement<any>, {
                canvasID,
                canvasHeight,
                canvasWidth
            });
        });

        return (
            <svg ref={ svg => { this.svg = svg; } }>
                <g id={ canvasID }>
                    { childrenWithCustomProps }
                </g>
            </svg>
        );
    }
}
