import { useEffect, useState } from 'react';
import { NavLink as RouterNavLink, Navigate } from 'react-router-dom';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { createEvent } from './GraphService';
import { useAppContext } from './AppContext';

export default function NewEvent() {
  const app = useAppContext();
  const [subject, setSubject] = useState('');
  const [attendees, setAttendees] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [body, setBody] = useState('');
  const [formDisabled, setFormDisabled] = useState(true);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    setFormDisabled(
      subject.length === 0 ||
      start.length === 0 ||
      end.length === 0
    );
  }, [subject, start, end]);

  const doCreate = async () => {
    const attendeeEmails = attendees.split(';');
    const attendeeArray = [];

    attendeeEmails.forEach((email) => {
      if (email.length > 0) {
        attendeeArray.push({
          emailAddress: {
            address: email
          }
        });
      }
    });
    
    const newEvent = {
      subject: subject,
      attendees: attendeeArray.length > 0 ? attendeeArray : undefined,
      start: {
        dateTime: start,
        timeZone: app.user?.timeZone
      },
      end: {
        dateTime: end,
        timeZone: app.user?.timeZone
      },
      body: body.length > 0 ? {
        contentType: 'text',
        content: body
      } : undefined
    };

    try {
      await createEvent(app.authProvider, newEvent);
      setRedirect(true);
      
    } catch (err) {
      app.displayError('Error creating event', JSON.stringify(err));
    }
  };

  if (redirect) {
    return <Navigate to="/calendar" />;
  }

  return (
    <Form>
      <Form.Group>
        <Form.Label>Subject</Form.Label>
        <Form.Control
          type="text"
          name="subject"
          id="subject"
          className="mb-2"
          value={subject}
          onChange={(ev) => setSubject(ev.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Attendees</Form.Label>
        <Form.Control
          type="text"
          name="attendees"
          id="attendees"
          className="mb-2"
          placeholder="Enter a list of email addresses, separated by a semi-colon"
          value={attendees}
          onChange={(ev) => setAttendees(ev.target.value)}
        />
      </Form.Group>
      <Row className="mb-2">
        <Col>
          <Form.Group>
            <Form.Label>Start</Form.Label>
            <Form.Control
              type="datetime-local"
              name="start"
              id="start"
              value={start}
              onChange={(ev) => setStart(ev.target.value)}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>End</Form.Label>
            <Form.Control
              type="datetime-local"
              name="end"
              id="end"
              value={end}
              onChange={(ev) => setEnd(ev.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group>
        <Form.Label>Body</Form.Label>
        <Form.Control
          as="textarea"
          name="body"
          id="body"
          className="mb-3"
          style={{ height: '10em' }}
          value={body}
          onChange={(ev) => setBody(ev.target.value)}
        />
      </Form.Group>
      <Button
        color="primary"
        className="me-2"
        disabled={formDisabled}
        onClick={() => doCreate()}
      >
        Create
      </Button>
      <RouterNavLink to="/calendar" className="btn btn-secondary">
        Cancel
      </RouterNavLink>
    </Form>
  );
}
