import React, { Component } from 'react';
import moment from 'moment';

class WeekHeader extends Component {
    render() {
        return (
            <div>
                {moment.weekdaysMin().map(function(title, index, array) {
                    return <span className="calendar__dayname" key={index}>{array[(index + 1) % 7]}</span>
                })}
            </div>
        );
    }
}

export default WeekHeader;
