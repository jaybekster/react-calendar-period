import React, { Component } from 'react';
import moment from './moment';

const firstWeekDayNumber = moment.localeData()._week.dow;

class WeekHeader extends Component {
    render() {
        return (
            <div>
                {moment.weekdaysMin().map(function(title, index, array) {
                    return <span className="calendar__dayname" key={index}>{array[(index + firstWeekDayNumber) % 7]}</span>
                })}
            </div>
        );
    }
}

export default WeekHeader;
