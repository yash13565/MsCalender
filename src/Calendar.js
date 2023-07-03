import { useEffect, useState, useMemo } from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { useAppContext } from './AppContext';
import { findIana } from 'windows-iana';
import { getUserWeekCalendar } from './GraphService';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { getAllCalendar } from './GraphService';
import './App.css'

const views = ['month'];

function Calendar() {
  const app = useAppContext();
  const [events, setEvents] = useState([]);
  const [calData,setCalData] = useState([])
  const currentDate = new Date()
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
  const loadCalendars = async ()=>{
    if(app.user && !events.length){
    try{
      const loadedCalender = await getAllCalendar(app.authProvider)
      setCalData(loadedCalender)
    }catch(err){
      app.displayError(err.message)
    }
    }
  }
  useEffect(() => {

    loadEvents();
    loadCalendars();
  }, [app.user, app.authProvider, events.length]);
  console.log(events[0]?.organizer.emailAddress.name, 'outside')
  console.log(events, 'data')
  console.log(calData.values,'hellocalendar')
  const renderData = useMemo(() => {
    return events.map((event) => ({
      'text': event?.subject,
      'startDate': new Date(event?.start.dateTime),
      'endDate': new Date(event?.end.dateTime),
    }));
  }, [events]);
  console.log(renderData, 'data from memo')

  return (
    <>
      <div className="mb-3">
        <RouterNavLink to="/newevent" className="btn btn-dark btn-sm">
          New event
        </RouterNavLink>
        <div>
          {/* {
            calData.map((x,i)=>{
              
            })
          } */}
        </div>
      </div>

      <Scheduler dataSource={renderData} defaultCurrentDate={currentDate} timeZone="Asia/Kolkata" editing={false} views={views} defaultCurrentView="month" height={700} />

    </>
  );
}

export default Calendar;

