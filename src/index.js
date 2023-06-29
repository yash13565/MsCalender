import React from 'react';
import ReactDOM from 'react-dom';

import {
  PublicClientApplication,
  EventType,
} from '@azure/msal-browser';

import config from './Config';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: config.appId,
    redirectUri: config.redirectUri
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true
  }
});

const accounts = msalInstance.getAllAccounts();
if (accounts && accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const authResult = event.payload;
    msalInstance.setActiveAccount(authResult.account);
  }
});

ReactDOM.render(
  <>
    <App pca={msalInstance} />
  </>,
  document.getElementById('root')
);

reportWebVitals();
