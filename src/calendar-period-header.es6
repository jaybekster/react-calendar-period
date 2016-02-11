import React, { Component } from 'react';

class CalendarPeriodHeader extends Component {
    render() {
        return (
            <div className="calendar-period__navigation">
                <div className="calendar-period__arrow calendar-period__arrow_prev" onClick={this.props.prevMonth}></div>
                <div className="calendar-period__arrow calendar-period__arrow_next" onClick={this.props.nextMonth}></div>
            </div>
        );
    }
}

export default CalendarPeriodHeader;
