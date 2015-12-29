import 'styles.styl'

import React from 'react';
import ReactDOM from 'react-dom';
import autobind from 'autobind-decorator';
import moment from 'moment';

moment.locale('ru');

class Calendar extends React.Component {
    constructor() {
        super();
        this.state = {
            month: moment(),
            isActive: false
        }
    }
    render() {
        return (
            <div className="calendar">
                <div>{this.renderMonthLabel()}</div>
                <div>{this.renderDayNames()}</div>
                <div onMouseDown={this.startSelect} onMouseUp={this.endSelect}>{this.renderWeeks()}</div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            month: nextProps.month,
            isActive: nextProps.isActive
        });
    }
    componentDidMount() {
        this.setState({
            month: this.props.month
        });
    }
    renderMonthLabel() {
        return (
            <div className="calendar__title">
                <span className="calendar__title__month">{this.state.month.format('MMMM')}</span>
                ,&nbsp;
                <span className="calendar__title__month">{this.state.month.year()}</span>
            </div>
        )
    }
    renderDayNames() {
        return (
            <div>
                {moment.weekdaysMin().map(function(title, index, array) {
                    return <span className="calendar__dayname" key={index}>{array[(index + 1) % 7]}</span>
                })}
            </div>
        );
    }
    renderWeeks() {
        var weeks = [],
            monthIndex = this.state.month.month(),
            date = this.state.month.clone().startOf('month').startOf('week'),
            done = false;

        while (!done) {
            weeks.push(
                <Week isActive={this.state.isActive} week={date.clone()} key={date.toString()}/>
            );
            date.add(1, 'w');
            done = monthIndex !== date.month();
        }
        return weeks;
    }
    startSelect() {
        this.setState({
            isActive: true
        });
    }
    endSelect() {
        this.setState({
            isActive: false
        });
    }
};

autobind(Calendar);

class Week extends React.Component {
    render() {
        var days = [],
            date = this.props.week;
        for (var i = 0; i<7; i+=1) {
            days.push(
                <span
                    className="calendar__date"
                    onMouseEnter={this.mouseEnterDate}
                    key={date.toString()}
                >{date.format('D')}</span>
            )
            date.add(1, 'day');
        }
        return <div>{days}</div>
    }
    mouseEnterDate(e) {
        if (this.props.isActive) {
            e.target.classList.add('calendar__date_selected');
        }
    }
    mouseLeaveDate() {

    }
};

autobind(Week);

class CalendarPeriod extends React.Component {
    constructor() {
        super();
        this.state = {
            date: moment()
        }
        this.render = this.render.bind(this);
    }
    componentDidMount() {
        this.setState({
            date: this.props.now
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
    render() {
        var monthNodes = [];
        for (let i = 0; i < this.props.count; i += 1) {
            let monthDate = this.state.date.clone().add(i, 'month');
            monthNodes.push(
                <Calendar key={monthDate.format('YYYY-MM-DD')} month={monthDate}/>
            );
        }
        return (
            <div className="calendar-period">
                <div
                    className="calendar-period-arrow calendar-period-arrow_prev"
                    onClick={this.prevMonth}
                >Prev</div>
                {this.nextMonth}
                {monthNodes}
                <div
                    className="calendar-period-arrow calendar-period-arrow_next"
                    onClick={this.nextMonth}
                >Next</div>
            </div>
        )
    }
};

autobind(CalendarPeriod);

ReactDOM.render(
    <CalendarPeriod now={moment()} count={2}/>,
    document.querySelector('#content')
);
