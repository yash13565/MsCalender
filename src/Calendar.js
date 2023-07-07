import { useEffect, useState, useMemo } from 'react';
import Scheduler from 'devextreme-react/scheduler';
import { useAppContext } from './AppContext';
import { findIana } from 'windows-iana';
import { getUsersCalendar } from './GraphService';
import { NavLink as RouterNavLink } from 'react-router-dom';
import './App.css'


const views = ['month'];
function Calendar() {
  const app = useAppContext();
  const [events, setEvents] = useState([]);
  
  // const [calData, setCalData] = useState([]);
  // const [selected, setSelected] = useState();
  console.log(events,'events')
  const currentDate = new Date();

  const loadEvents = async () => {
    if (app.user && !events.length) {
      try {
        const ianaTimeZones = findIana(app.user.timeZone);
        console.log(ianaTimeZones[0],'time')
        const loadedEvents = await getUsersCalendar(app.authProvider,app.user.id, ianaTimeZones[0]);
        setEvents(loadedEvents);
      } catch (err) {
        app.displayError(err.message);
      }
    }
  };

  // const loadCalendars = async () => {
  //   if (app.user && !calData.length) {
  //     try {
  //       const loadedCalendars = await getAllCalendar(app.authProvider);
  //       setCalData(loadedCalendars);
        
  //     } catch (err) {
  //       app.displayError(err.message);
  //     }
  //   }
  // };
   function localData(){
    localStorage.setItem('events',JSON.stringify(renderData))
   }
  useEffect(() => {
    loadEvents();
    localData()
    // loadCalendars();
  }, [app.user, app.authProvider]);
  // console.log(calData,'calender data')
  // console.log(selected,'selected input')
  const renderData = useMemo(() => {
    // Filtering events here
    // const filteredEvents = events?.filter(event => event.calendarId === selectedCalendar);
    const myData = events?.map(event => ({
      'id': event.id,
      'text': event.subject,
      'startDate': event.start.dateTime,
      'endDate': event.end.dateTime,
    }));
    // console.log(myData.filter(e => e.id === selected),'5')
    return myData ;
  }, [events]);
  console.log(renderData,'memodata')
 
  
  return (
    <>
      <div className="mb-3">
        <div className='navsection'> 
        <RouterNavLink to="/newevent" className="btn btn-dark btn-sm">
          New event
        </RouterNavLink>
        <RouterNavLink to="/allcalendar" className="btn btn-light btn-sm">
          All Calendar List
        </RouterNavLink>
        </div>
        <div>
          {/* {calData.value?.map(calendar => (
            <div className='myinput' key={calendar.id}>
              <label>
                <input
                  type='radio'
                  value={calendar.id}
                  checked={selected === calendar.id}
                  onChange={handleCalendarChange}
                  className='myinput'
                />
                {calendar.name}
              </label>
            </div>
          ))} */}
        </div>
      </div>
      <div>
     
    </div>
      <Scheduler
        dataSource={renderData}
        defaultCurrentDate={currentDate}
        timeZone="Asia/Kolkata"
        editing={false}
        views={views}
        defaultCurrentView="month"
        height={700}
      />
    </>
  );
}

export default Calendar;
