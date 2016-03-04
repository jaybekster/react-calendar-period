import React, { Component, PropTypes } from 'react';
import WeekDay from 'week-day';
import moment from './moment';

class Week extends Component {
    render() {
        var days = this.props.week.map((weekDayObj, weekDayIndex) => {
            return (
                <WeekDay
                    month={this.props.month}
                    key={weekDayIndex}
                    date={weekDayObj}
                />
            )
        });

        return <div>{days}</div>
    }
};

export default Week;
