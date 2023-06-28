import React from 'react';
import { Alert } from 'react-bootstrap';
import { useAppContext } from './AppContext';

export default function ErrorMessage() {
  const app = useAppContext();

  if (app.error) {
    return (
      React.createElement(Alert, { variant: "danger", dismissible: true, onClose: () => app.clearError() },
        React.createElement("p", { className: "mb-3" }, app.error.message),
        app.error.debug ?
          React.createElement("pre", { className: "alert-pre border bg-light p-2" },
            React.createElement("code", null, app.error.debug)
          )
          : null
      )
    );
  }

  return null;
}
