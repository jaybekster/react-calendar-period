import React, { Component, PropTypes } from 'react';
import WeekDay from 'week-day';
import moment from './moment';

const firstWeekDayNumber = moment.localeData()._week.dow;

class Calendar extends Component {
    static propTypes = {
        month: PropTypes.instanceOf(moment)
    }

    renderWeeks(month) {
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

        return monthArray.reduce(function(result, weekArray, weekIndex) {
            result.push(
                <div key={weekIndex}>
                    {weekArray.map(function(weekDayObj, weekDayIndex) {
                        var isPast = weekDayObj < moment(),
                            isOuter = weekDayObj < month.startOf('month') || weekDayObj > month.endOf('month');

                        return (
                            <WeekDay
                                month={month}
                                key={weekDayIndex}
                                date={weekDayObj}
                                isPast={isPast}
                                isOuter={isOuter}
                            />
                        );
                    })}
                </div>
            );
            return result;
        }, []);
    }

    render() {
        return (
            <div className="calendar">
                <div className="calendar__title">
                    <span className="calendar__title__month">{moment.months()[this.props.month.format('M') - 1]}</span>
                    ,&nbsp;
                    <span className="calendar__title__month">{this.props.month.format('YYYY')}</span>
                </div>
                <div>
                    {moment.weekdaysMin().map(function(title, index, array) {
                        return <span className="calendar__dayname" key={index}>{array[(index + firstWeekDayNumber) % 7]}</span>
                    })}
                </div>
                <div>{this.renderWeeks(this.props.month)}</div>
            </div>
        )
    }
};

export default Calendar;
