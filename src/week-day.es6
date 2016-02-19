import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import moment from 'moment';

class WeekDay extends Component {
    static propTypes = {
        date: PropTypes.instanceOf(moment),
        month: PropTypes.instanceOf(moment),
        selectingRange: PropTypes.instanceOf(Set),
        selected: PropTypes.instanceOf(Set),
        onSelect: PropTypes.func,
        onStartSelect: PropTypes.func,
        onEndSelect: PropTypes.func,
        action: PropTypes.bool
    };

    getClassNames() {
        var classList = ['calendar__date'],
            date = this.props.date,
            dateStr = date.format('YYYY-MM-DD'),
            isPast = date < moment(),
            isOuter = date < this.props.month.startOf('month') || date > this.props.month.endOf('month');

        if (isOuter) {
            classList.push('calendar__date_outer');
        } else if (isPast) {
            classList.push('calendar__date_past');
        } else {
            classList.push('calendar__date_availiable');
            if (this.props.selectingRange.has(dateStr)) {
                if (this.props.action) {
                   classList.push('calendar__date_selecting');
               } else {
                    classList.push('calendar__date_removing');
               }
            } else if (this.props.selected.has(dateStr)) {
                classList.push('calendar__date_selected');
            }
        }

        return classList;
    }

    handleMouseEvent(event) {
        var isOuter = this._date.classList.contains('calendar__date_outer'),
            isPast = this._date.classList.contains('calendar__date_past');

        switch (event.type) {
            case 'mouseup':
                this.props.onEndSelect();
                break;
            case 'mouseenter':
                if (this.props.isSelecting && !isOuter && !isPast) {
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
            <span ref={(c) => this._date = c}
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

export default WeekDay;
