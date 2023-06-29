import { useEffect, useState,useMemo } from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { useAppContext } from './AppContext';
import { findIana } from 'windows-iana';
import { getUserWeekCalendar } from './GraphService';
import { NavLink as RouterNavLink } from 'react-router-dom';

const views = ['month'];

function Calendar() {
  const app = useAppContext();
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    if (app.user && !events.length) {
      try {
        const ianaTimeZones = findIana(app.user.timeZone);
        const loadedEvents = await getUserWeekCalendar(app.authProvider, ianaTimeZones[0].valueOf());
        setEvents(loadedEvents);
      } catch (err) {
        app.displayError(err.message);
      }
    }
  };
  useEffect(() => {

    loadEvents();
  }, [app.user, app.authProvider, events.length]);
  console.log(events,'outside')

  const renderData = useMemo(() => {
    return events.map((event) => ({
      'text': event?.subject,
      'startDate': event.start.dateTime,
      'endDate': event.end.dateTime,
    }));
  }, [events]);
  

  console.log(renderData,'data from memo')
  return (
    <>
      <div className="mb-3">
        <RouterNavLink to="/newevent" className="btn btn-dark btn-sm">
          New event
        </RouterNavLink>
      </div>
      <Scheduler  dataSource={renderData}  timeZone="Asia/Kolkata"  editing={false} views={views} defaultCurrentView="month" height={700} />
     
    </>
  );
}

export default Calendar;

