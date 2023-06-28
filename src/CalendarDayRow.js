import React from 'react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns/esm';

  

const formatMap = {
  "h:mm tt": "h:mm a",
  "hh:mm tt": "hh:mm a"
};

function formatDateTime(dateTime, timeFormat) {
  if (dateTime !== undefined) {
    const parsedDate = parseISO(dateTime);
    return format(parsedDate, formatMap[timeFormat] || timeFormat);
  }
}

function DateCell(props) {
  return (
    <td className='calendar-view-date-cell' rowSpan={props.events.length <= 0 ? 1 : props.events.length}>
      <div className='calendar-view-date float-left text-right'>{format(props.date, 'dd')}</div>
      <div className='calendar-view-day'>{format(props.date, 'EEEE')}</div>
      <div className='calendar-view-month text-muted'>{format(props.date, 'MMMM, yyyy')}</div>
    </td>
  );
}

export default function CalendarDayRow(props) {
  const today = new Date();
  const rowClass = today.getDay() === props.date.getDay() ? 'table-warning' : '';

  if (props.events.length <= 0) {
    return (
      <tr className={rowClass}>
        <DateCell {...props} />
        <td></td>
        <td></td>
      </tr>
    );
  }

  return (
    <>
      {props.events.map((event, index) => (
        <tr className={rowClass} key={event.id}>
          {index === 0 && <DateCell {...props} />}
          <td className="calendar-view-timespan">
            <div>{formatDateTime(event.start?.dateTime, props.timeFormat)} - {formatDateTime(event.end?.dateTime, props.timeFormat)}</div>
          </td>
          <td>
            <div className="calendar-view-subject">{event.subject}</div>
            <div className="calendar-view-organizer">{event.organizer?.emailAddress?.name}</div>
          </td>
        </tr>
      ))}
    </>
  );
}
