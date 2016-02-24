import React, { Component, PropTypes } from 'react';
import WeekDay from 'week-day';
import moment from './moment';

class Week extends Component {
    static propTypes = {
        month: PropTypes.instanceOf(moment),
        selected: PropTypes.instanceOf(Set),
        onSelect: PropTypes.func,
        onStartSelect: PropTypes.func,
        onEndSelect: PropTypes.func,
        isSelecting: PropTypes.bool,
        action: PropTypes.bool,
        isSelected: PropTypes.bool,
        selectingRange: PropTypes.instanceOf(Set)
    };

    render() {
        var days = this.props.week.map((weekDayObj, weekDayIndex) => {
            return (
                <WeekDay
                    key={weekDayIndex}
                    month={this.props.month}
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

export default Week;
