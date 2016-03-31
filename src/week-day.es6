import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import classNames from 'classnames';
import moment from './moment';

@autobind
export default class WeekDay extends Component {
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
        let dateStr = this.props.date.format('YYYY-MM-DD'),
            isPast = this.props.isPast,
            isOuter = this.props.isOuter,
            inSelectingRange = this.context.selectingRange.has(dateStr),
            isAlreadySelected = this.context.selected.has(dateStr);

        return classNames('calendar__date', {
            'calendar__date_outer': isOuter,
            'calendar__date_past': !isOuter && isPast,
            'calendar__date_availiable': !(isPast || isOuter),
            'calendar__date_selecting': inSelectingRange && this.context.action,
            'calendar__date_removing': inSelectingRange && !this.context.action,
            'calendar__date_selected': !inSelectingRange && isAlreadySelected
        });
    }

    handleMouseEvent(event) {
        switch (event.type) {
            case 'mouseup':
                this.context.onEndSelect(this.props.date);
                break;
            case 'mouseenter':
                if (this.context.isSelecting && !(this.props.isOuter && this.props.isPast)) {
                    this.context.onSelect(this.props.date);
                }
                break;
            case 'mousedown':
                if (!(this.props.isOuter || this.props.isPast)) {
                    this.context.onStartSelect(this.props.date);
                }
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <span
                className={this.getClassNames()}
                onMouseEnter={this.handleMouseEvent}
                onMouseLeave={this.handleMouseEvent}
                onMouseDown={this.handleMouseEvent}
                onMouseUp={this.handleMouseEvent}
            >{this.props.date.format('DD')}</span>
        )
    }
}
