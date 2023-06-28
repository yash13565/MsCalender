import React from 'react';
import {
  Button,
  Container
} from 'react-bootstrap';
import './App.css'
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { useAppContext } from './AppContext';
import {NavLink as RouterNavLink } from 'react-router-dom'
export default function Welcome() {
  const app = useAppContext();
 
  return (
    <div className="p-5 mb-4 bg-light rounded-3">
      <Container fluid>
        <h1>React Graph Tutorial</h1>
        <p className="lead">
          Welcome To Microsoft Calendar, Easy to schedule your day to day meetings.Have Fun!.
        </p>
        <AuthenticatedTemplate>
          <div className='parent'>                                                                                                             
            <h4>Welcome {app.user?.displayName || ''}!</h4>
            <Button variant="dark"   onClick={app.signOut}>Sign out</Button>
            <RouterNavLink to="/calendar" className="nav-link">
            <Button variant="info">Calendar</Button>
                </RouterNavLink>
          </div>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
        
          <Button variant="success" onClick={app.signIn}>Sign in</Button>
         
        </UnauthenticatedTemplate>
      </Container>
    </div>
  );
}
