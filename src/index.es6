import 'styles.styl'

import React from 'react'
import { render } from 'react-dom';

import CalendarPeriod from 'calendar-period';

render(
    <CalendarPeriod now={new Date()} count={3} selected={[new Date()]}/>,
    document.querySelector('#content')
);
