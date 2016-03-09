import React, { Component, PropTypes } from 'react';
import moment from './moment';
import autobind from 'autobind-decorator';
import Calendar from 'calendar';

class CalendarPeriod extends Component {
    static propTypes = {
        now: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.instanceOf(Date),
            PropTypes.instanceOf(moment)
        ]),
        count: PropTypes.number
    }

    static childContextTypes = {
        onSelect: PropTypes.func,
        onStartSelect: PropTypes.func,
        onEndSelect: PropTypes.func,
        isSelecting: PropTypes.bool,
        selected: PropTypes.instanceOf(Set),
        selectingRange: PropTypes.instanceOf(Set),
        action: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.state = {
            date: moment(),
            selected: new Set(),
            period: {},
            selectingRange: new Set(),
            action: true,
            isSelecting: false
        };
    }

    getChildContext() {
        return {
            onSelect: this.onSelect,
            onStartSelect: this.onStartSelect,
            onEndSelect: this.onEndSelect,
            isSelecting: this.state.isSelecting,
            action: this.state.action,
            selectingRange: this.state.selectingRange,
            selected : this.state.selected
        };
    }

    componentDidMount() {
        this.setState({
            date: moment(this.props.now),
            selected: new Set(this.props.selected)
        });
    }

    changeSelected(datesArray, addition) {
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
            let newDate = this.state.date.clone().add(i, 'month');
            monthNodes.push(
                <Calendar
                    key={newDate.format('YYYY-MM')}
                    month={newDate}
                />
            );
        }
        return (
            <div className="calendar-period">
                <div className="calendar-period__navigation">
                    <div className="calendar-period__arrow calendar-period__arrow_prev" onClick={this.prevMonth}></div>
                    <div className="calendar-period__arrow calendar-period__arrow_next" onClick={this.nextMonth}></div>
                </div>
                {monthNodes}
            </div>
        )
    }
};

autobind(CalendarPeriod);

export default CalendarPeriod;
