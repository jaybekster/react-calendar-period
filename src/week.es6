import React, { Component } from 'react';
import WeekDay from 'week-day';

class Week extends Component {
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
