import { useEffect, useState } from 'react';
// import { add, format, getDay, parseISO } from 'date-fns';
// import { endOfWeek, startOfWeek } from 'date-fns/esm';
import Scheduler from 'devextreme-react/scheduler';
import { useAppContext } from './AppContext';
import {data } from './CalenderData/Data';
import { findIana } from 'windows-iana';
import { getUserWeekCalendar } from './GraphService';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { add, getDay, parseISO } from 'date-fns';
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
    <>
    <div className="mb-3">
    <RouterNavLink to="/newevent" className="btn btn-dark btn-sm">New event</RouterNavLink>
  </div>
    <Scheduler
        timeZone="Asia/Kolkata"
        dataSource={events}
        editing={false}
        views={views}
        defaultCurrentView="week"
        defaultCurrentDate={currentDate}
        height={600}
        />
        </>
  );
}

export default Calendar;
