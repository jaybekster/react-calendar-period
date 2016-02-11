import React, { Component } from 'react';
import moment from 'moment';

class MonthHeader extends Component {
    render() {
        return (
            <div className="calendar__title">
                <span className="calendar__title__month">{moment.months()[this.props.month.format('M') - 1]}</span>
                ,&nbsp;
                <span className="calendar__title__month">{this.props.month.format('YYYY')}</span>
            </div>
        );
    }
}

export default MonthHeader;
