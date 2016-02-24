import 'styles.styl'

import React from 'react'
import { render } from 'react-dom';
import classnames from 'classnames';

import CalendarPeriod from 'calendar-period';

render(
    <CalendarPeriod now={new Date()} count={3} selected={['2016-01-04','2016-02-12', '2016-01-02']}/>,
    document.querySelector('#content')
);
