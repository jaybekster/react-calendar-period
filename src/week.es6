import React, { Component, PropTypes } from 'react';
import WeekDay from 'week-day';
import moment from './moment';

class Week extends Component {
    static propTypes = {
        onSelect: PropTypes.func,
        onStartSelect: PropTypes.func,
        isSelecting: PropTypes.bool
    }

    render() {
        var days = this.props.week.map((weekDayObj, weekDayIndex) => {
            return (
                <WeekDay
                    {...this.props}
                    key={weekDayIndex}
                    date={weekDayObj}
                    onSelect={this.props.onSelect.bind(this, weekDayObj)}
                    onStartSelect={this.props.onStartSelect.bind(this, weekDayObj)}
                    isSelected={this.props.selected.has(weekDayObj.format('YYYY-MM-DD'))}
                />
            )
        });

        return <div>{days}</div>
    }
};

export default Week;
