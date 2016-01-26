import 'styles.styl'

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import moment from 'moment';
import 'moment-range'

class CalendarPeriod extends Component {
    state = {
        date: moment(),
        selected: new Set()
    };

    componentDidMount() {
        this.setState({
            date: this.props.now,
            selected: new Set(this.props.selected)
        });
    }
    changeSelected(date, del) {
        var selected = this.state.selected;
        if (del) {
            let index = selected.indexOf(date);
            if (index > -1) {
                selected.splice(index, 1);
            }
        } else {
            selected.push(date);
            this.setState({
                selected: selected
            })
        }
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
    render() {
        var monthNodes = [];
        for (let i = 0; i < this.props.count; i += 1) {
            let monthDate = this.state.date.clone().add(i, 'month'),
                range = moment.range(monthDate.clone().startOf('month'), monthDate.clone().endOf('month')),
                selected = new Set(Array.from(this.state.selected).filter(function(date) {
                    return moment(date).within(range);
                }));
            monthNodes.push(
                <Calendar key={i} month={monthDate.clone()} selected={selected} onSelect={this.changeSelected}/>
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
        month: moment().clone(),
        selected: new Set(this.props.selected),
        period: {},
        selectingRange: new Set(),
        action: 1,
        monthArray: []
    };

    render() {
        return (
            <div className="calendar">
                <MonthHeader month={this.state.month}/>
                <WeekHeader/>
                <div>{this.renderWeeks()}</div>
            </div>
        )
    }
    onSelect(date) {
        const period = {
            start: moment(Math.min(this.state.period.start, date)),
            end: moment(Math.max(this.state.period.start, date))
        };
        const range = moment.range(period.start, period.end);
        const selectingRange = new Set();

        if (period.start.isSame(period.end)) {
            let dateString = date.format('YYYY-MM-DD');
            if (this.state.action) {
                selectingRange.add(dateString);
            } else {
                selectingRange.delete(dateString);
            }
        } else {
            range.by('days', (moment) => {
                var dateString = moment.format('YYYY-MM-DD');
                if (this.state.action) {
                    selectingRange.add(dateString);
                } else {
                    selectingRange.delete(dateString);
                }
            })
        }

        this.setState({
            selectingRange,
            period: period
        });
    }
    onStartSelect(date) {
        var isExist = this.state.selected.has(date.format('YYYY-MM-DD'));
        this.setState({
            isSelecting: true,
            period: {
                start: date,
                end: date
            },
            selectingRange: new Set([date.format('YYYY-MM-DD')]),
            action: !isExist
        });
    }
    onEndSelect() {
        this.setState({
            isSelecting: false,
            selected: new Set([...this.state.selectingRange]),
            selectingRange: new Set()
        });
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
            month: nextProps.month.clone(),
            selected: new Set(nextProps.selected),
            monthArray: monthArray
        });
    }
    renderWeeks() {
        return this.state.monthArray.reduce((result, weekArray, weekIndex) => {
            result.push(
                <Week
                    month={this.state.month}
                    week={weekArray}
                    key={weekIndex}
                    selected={this.state.selected}
                    selectingRange={this.state.selectingRange}
                    onSelect={this.onSelect}
                    onStartSelect={this.onStartSelect}
                    onEndSelect={this.onEndSelect}
                    isSelecting={this.state.isSelecting}
                    action={this.state.action}
                />
            );
            return result;
        }, []);
    }
};

autobind(Calendar);

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

autobind(Week);

class WeekDay extends Component {
    getClassNames() {
        var classList = ['calendar__date'];
        if (this.props.date.format('YYYY-MM-DD') === '2016-02-14') {
            // debugger;
        }
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
        const newState = {};

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

        this.setState(newState);
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
