import React, { useState, useEffect } from 'react';
import { getAllCalendar } from './GraphService';
import { useAppContext } from './AppContext';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';

function AllCalendars() {
  const app = useAppContext();
  const [calData, setCalData] = useState([]);
  const [selected, setSelected] = useState();
  const navigate = useNavigate();

  const loadCalendars = async () => {
    if (app.user && !calData.length) {
      try {
        const loadedCalendars = await getAllCalendar(app.authProvider);
        setCalData(loadedCalendars);
        if (loadedCalendars.length > 0 && !selected) {
          setSelected(loadedCalendars[0].id);
        }
      } catch (err) {
        app.displayError(err.message);
      }
    }
  };

  useEffect(() => {
    loadCalendars();
  }, [app.user, app.authProvider]);

  const handleRadioChange = (calendarId) => {
    setSelected(calendarId);
  };

  const handleNextClick = () => {
    navigate(`/calendar?selected=${selected}`);
  };

  return (
    <div>
      {calData.value?.map((calendar) => (
        <div className="myinput" key={calendar.id}>
          <label>
            <input
              type="radio"
              value={calendar.id}
              checked={selected === calendar.id}
              onChange={() => handleRadioChange(calendar.id)}
              className="myinput"
            />
            {calendar.name}
          </label>
        </div>
      ))}
      <button className="btn btn-dark btn-sm" onClick={handleNextClick}>
        Next
      </button>
    </div>
  );
}

export default AllCalendars;
