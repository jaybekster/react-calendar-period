import 'styles.styl'

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import moment from 'moment';
import 'moment-range'

class CalendarPeriod extends Component {
    state = {
        date: moment(),
        selected: new Set(),
        period: {},
        selectingRange: new Set(),
        action: true
    };

    componentDidMount() {
        this.setState({
            date: this.props.now,
            selected: new Set(this.props.selected)
        });
    }
    changeSelected(datesArray, addition) {
        debugger;
        this.setState({
            selected: new Set(
                addition
                ? [...this.state.selected, ...datesArray]
                : Array.from(this.state.selected).filter((value) => !datesArray.has(value))
            )
        });
    }
    prevMonth() {
        this.setState({
            date: this.state.date.subtract(1, 'months')
        });
    }
    nextMonth() {
        this.setState({
            date: this.state.date.add(1, 'months')
        });
    }

    onSelect(date) {
        const period = {
            start: this.state.period.start,
            end: date
        };
        const range = moment.range(Math.min(period.start, period.end), Math.max(period.start, period.end));
        const selectingRange = new Set();

        if (period.start.isSame(period.end)) {
            let dateString = date.format('YYYY-MM-DD');
            selectingRange.add(dateString);
        } else {
            range.by('days', (moment) => {
                var dateString = moment.format('YYYY-MM-DD');
                selectingRange.add(dateString);
            })
        }

        this.setState({
            selectingRange,
            period: period
        });
    }
    onStartSelect(date) {
        this.setState({
            isSelecting: true,
            period: {
                start: date,
                end: date
            },
            selectingRange: new Set([date.format('YYYY-MM-DD')]),
            action: !this.state.selected.has(date.format('YYYY-MM-DD'))
        });
    }
    onEndSelect() {
        this.setState({
            selected: new Set(
                this.state.action
                ? [...this.state.selected, ...this.state.selectingRange]
                : Array.from(this.state.selected).filter((value) => !this.state.selectingRange.has(value))
            ),
            isSelecting: false,
            selectingRange: new Set()
        });
    }


    render() {
        var monthNodes = [];
        for (let i = 0; i < this.props.count; i += 1) {
            monthNodes.push(
                <Calendar
                    key={i}
                    month={this.state.date.clone().add(i, 'month')}
                    selected={this.state.selected}
                    onSelect={this.onSelect}
                    onStartSelect={this.onStartSelect}
                    onEndSelect={this.onEndSelect}
                    isSelecting={this.state.isSelecting}
                    action={this.state.action}
                    selectingRange={this.state.selectingRange}
                />
            );
        }
        return (
            <div className="calendar-period">
                <CalendarPeriodHeader nextMonth={this.nextMonth} prevMonth={this.prevMonth}/>
                {monthNodes}
            </div>
        )
    }
};

autobind(CalendarPeriod);

class CalendarPeriodHeader extends Component {
    render() {
        return (
            <div className="calendar-period__navigation">
                <div className="calendar-period__arrow calendar-period__arrow_prev" onClick={this.props.prevMonth}>Prev</div>
                <div className="calendar-period__arrow calendar-period__arrow_next" onClick={this.props.nextMonth}>Next</div>
            </div>
        );
    }
}

class Calendar extends Component {
    state = {
        monthArray: []
    };

    render() {
        return (
            <div className="calendar">
                <MonthHeader month={this.props.month}/>
                <WeekHeader/>
                <div>{this.renderWeeks()}</div>
            </div>
        )
    }

    componentWillReceiveProps(nextProps) {
        var monthArray = [],
            monthRange = moment.range(
                nextProps.month.clone().startOf('month').startOf('week'),
                nextProps.month.clone().endOf('month').endOf('week')
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

        this.setState({
            monthArray: monthArray
        });
    }
    renderWeeks() {
        return this.state.monthArray.reduce((result, weekArray, weekIndex) => {
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

class Week extends Component {
    render() {
        var days = this.props.week.map((weekDayObj, weekDayIndex) => {
            return (
                <WeekDay
                    key={weekDayIndex}
                    date={weekDayObj}
                    onSelect={this.props.onSelect.bind(this, weekDayObj)}
                    onStartSelect={this.props.onStartSelect.bind(this, weekDayObj)}
                    isSelected={this.props.selected.has(weekDayObj.format('YYYY-MM-DD'))}
                    isSelecting={this.props.isSelecting}
                    onEndSelect={this.props.onEndSelect}
                    selected={this.props.selected}
                    selectingRange={this.props.selectingRange}
                    action={this.props.action}
                />
            )
        });

        return <div>{days}</div>
    }
};

class WeekDay extends Component {
    getClassNames() {
        var classList = ['calendar__date'];
        if (this.props.selectingRange.has(this.props.date.format('YYYY-MM-DD'))) {
            if (this.props.action) {
               classList.push('calendar__date_selecting');
           } else {
                classList.push('calendar__date_removing');
           }
        } else if (this.props.selected.has(this.props.date.format('YYYY-MM-DD'))) {
            classList.push('calendar__date_selected');
        }
        return classList;
    }

    handleMouseEvent(event) {
        if (this.props.isPassive) {
            return;
        }

        switch (event.type) {
            case 'mouseup':
                this.props.onEndSelect();
                break;
            case 'mouseenter':
                if (this.props.isSelecting) {
                    this.props.onSelect();
                }
                break;
            case 'mousedown':
                this.props.onStartSelect();
                break;
        }
    }

    render() {
        return (
            <span
                className={this.getClassNames().join(' ')}
                onMouseEnter={this.handleMouseEvent}
                onMouseLeave={this.handleMouseEvent}
                onMouseDown={this.handleMouseEvent}
                onMouseUp={this.handleMouseEvent}
            >{this.props.date.format('DD')}</span>
        )
    }
}

autobind(WeekDay);

moment.locale('ru');

ReactDOM.render(
    <CalendarPeriod now={moment()} count={3} selected={['2016-01-04','2016-02-12', '2016-01-02']}/>,
    document.querySelector('#content')
);
