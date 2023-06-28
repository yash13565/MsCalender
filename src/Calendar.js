import { useEffect, useState } from 'react';
// import { add, format, getDay, parseISO } from 'date-fns';
// import { endOfWeek, startOfWeek } from 'date-fns/esm';
import Scheduler from 'devextreme-react/scheduler';
import { useAppContext } from './AppContext';
import {data } from './CalenderData/Data';
import { findIana } from 'windows-iana';
import { getUserWeekCalendar } from './GraphService';

const currentDate = new Date();
const views = ['month'];

function Calendar() {
  const app = useAppContext();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (app.user && !events.length) {
        try {
          const ianaTimeZones = findIana(app.user.timeZone);
          const events = await getUserWeekCalendar(app.authProvider, ianaTimeZones[0].valueOf());
          setEvents(events);
        } catch (err) {
          const error = err;
          app.displayError(error.message);
        }
      }
    };

    loadEvents();
  }, [app.user, app.authProvider, events.length]);

  return (
    <Scheduler
        timeZone="Asia/Kolkata"
        dataSource={data}
        views={views}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        height={600}
        startDayHour={9} />
  );
}

export default Calendar;
