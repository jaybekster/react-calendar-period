import React, { Component, PropTypes } from 'react';
import MonthHeader from 'month-header';
import WeekHeader from 'week-header';
import Week from 'week';
import moment from './moment';

const firstWeekDayNumber = moment.localeData()._week.dow;

class Calendar extends Component {
    static propTypes = {
        month: PropTypes.instanceOf(moment),
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
            if (day === firstWeekDayNumber) {
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
                    {...this.props}
                    week={weekArray}
                    key={weekIndex}
                />
            );
            return result;
        }, []);
    }

    render() {
        return (
            <div className="calendar">
                <MonthHeader month={this.props.month}/>
                <WeekHeader/>
                <div>{this.renderWeeks()}</div>
            </div>
        )
    }
};

export default Calendar;
