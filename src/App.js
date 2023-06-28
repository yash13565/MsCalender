// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { MsalProvider } from '@azure/msal-react';
import 'devextreme/dist/css/dx.light.css';
import ProvideAppContext from './AppContext';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import Calendar from './Calendar';
import NewEvent from './NewEvent';
import 'bootstrap/dist/css/bootstrap.css';

// <AppPropsSnippet>
const App = ({ pca }) => {
  return (
    <MsalProvider instance={pca}>
      <ProvideAppContext>
        <Router>
          <Container>
            <ErrorMessage />
            <Routes>
              <Route path="/"
                element={
                  <Welcome />
                } />
              <Route path="/calendar"
                element={
                  <Calendar />
                } />
              <Route path="/newevent"
                element={
                  <NewEvent />
                } />
            </Routes>
          </Container>
        </Router>
      </ProvideAppContext>
    </MsalProvider>
  );
};

export default App;
