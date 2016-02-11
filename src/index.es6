import 'styles.styl'

import React from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment-range';
import classnames from 'classnames';

import CalendarPeriod from 'calendar-period';

moment.locale('ru');

ReactDOM.render(
    <CalendarPeriod now={moment()} count={3} selected={['2016-01-04','2016-02-12', '2016-01-02']}/>,
    document.querySelector('#content')
);
