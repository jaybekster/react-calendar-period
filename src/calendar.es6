import React, { Component } from 'react';
import MonthHeader from 'month-header';
import WeekHeader from 'week-header';
import Week from 'week';
import moment from 'moment';
import 'moment-range';

class Calendar extends Component {

    render() {
        return (
            <div className="calendar">
                <MonthHeader month={this.props.month}/>
                <WeekHeader/>
                <div>{this.renderWeeks()}</div>
            </div>
        )
    }

    generateMonthArray(month) {
        var monthArray = [],
            monthRange = moment.range(
                month.clone().startOf('month').startOf('week'),
                month.clone().endOf('month').endOf('week')
            );

        monthRange.by('days', function(momentDay) {
            var weekArray,
                day = momentDay.day();
            if (day === 1) {
                weekArray = [];
                monthArray.push(weekArray);
            } else {
                weekArray = monthArray[monthArray.length - 1];
            }
            weekArray.push(momentDay);
        });

        return monthArray;
    }

    renderWeeks() {
        return this.generateMonthArray(this.props.month).reduce((result, weekArray, weekIndex) => {
            result.push(
                <Week
                    month={this.props.month}
                    week={weekArray}
                    key={weekIndex}
                    selected={this.props.selected}
                    selectingRange={this.props.selectingRange}
                    onSelect={this.props.onSelect}
                    onStartSelect={this.props.onStartSelect}
                    onEndSelect={this.props.onEndSelect}
                    isSelecting={this.props.isSelecting}
                    action={this.props.action}
                />
            );
            return result;
        }, []);
    }

};

export default Calendar;
