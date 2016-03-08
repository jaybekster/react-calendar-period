import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import moment from './moment';

class WeekDay extends Component {
    static propTypes = {
        date: PropTypes.instanceOf(moment),
        month: PropTypes.instanceOf(moment)
    }

    static contextTypes = {
        onSelect: PropTypes.func,
        onStartSelect: PropTypes.func,
        onEndSelect: PropTypes.func,
        isSelecting: PropTypes.bool,
        action: PropTypes.bool,
        selectingRange: PropTypes.instanceOf(Set),
        selected: PropTypes.instanceOf(Set)
    }

    getClassNames() {
        var propsDate = this.props.date,
            dateStr = propsDate.format('YYYY-MM-DD'),
            isPast = propsDate < moment(),
            isOuter = propsDate < this.props.month.startOf('month') || propsDate > this.props.month.endOf('month');

        return classNames('calendar__date', {
            'calendar__date_outer': isOuter,
            'calendar__date_past': !isOuter && isPast,
            'calendar__date_availiable': !(isOuter && isPast),
            'calendar__date_selecting': this.context.selectingRange.has(dateStr) && this.context.action,
            'calendar__date_removing': this.context.selectingRange.has(dateStr) && !this.context.action,
            'calendar__date_selected': !this.context.selectingRange.has(dateStr) && this.context.selected.has(dateStr)
        });
    }

    handleMouseEvent(event) {
        var containerNode = this.refs.container,
            isOuter = containerNode.classList.contains('calendar__date_outer'),
            isPast = containerNode.classList.contains('calendar__date_past'),
            propsDate = this.props.date;

        switch (event.type) {
            case 'mouseup':
                this.context.onEndSelect(propsDate);
                break;
            case 'mouseenter':
                if (this.context.isSelecting && !isOuter && !isPast) {
                    this.context.onSelect(propsDate);
                }
                break;
            case 'mousedown':
                this.context.onStartSelect(propsDate);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <span
                ref='container'
                className={this.getClassNames()}
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
