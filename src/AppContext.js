import React, { useContext, createContext, useState, useEffect } from 'react';
import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
import { InteractionType } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';

import { getUser } from './GraphService';
import config from './Config';

export const appContext = createContext();

export function useAppContext() {
  return useContext(appContext);
}

export default function ProvideAppContext({ children }) {
  const auth = useProvideAppContext();
  return <appContext.Provider value={auth}>{children}</appContext.Provider>;
}

function useProvideAppContext() {
  const msal = useMsal();
  const [user, setUser] = useState();
  const [error, setError] = useState();
  console.log(user,'users')
  const displayError = (message, debug) => {
    setError({ message, debug });
  };

  const clearError = () => {
    setError(undefined);
  };

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        try {
          const account = msal.instance.getActiveAccount();
          if (account) {
            const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
              msal.instance,
              {
                account,
                scopes: config.scopes,
                interactionType: InteractionType.Popup,
              }
            );

            const user = await getUser(authProvider);

            setUser({
              displayName: user.displayName || '',
              email: user.mail || user.userPrincipalName || '',
              timeFormat: user.mailboxSettings?.timeFormat || 'h:mm a',
              timeZone: user.mailboxSettings?.timeZone || 'UTC',
              id:user.id || '',
            });
          }
        } catch (err) {
          displayError(err.message);
        }
      }
    };

    checkUser();
  }, [user, msal]);

  const signIn = async () => {
    await msal.instance.loginPopup({
      scopes: config.scopes,
      prompt: 'select_account',
    });

    const account = msal.instance.getActiveAccount();

    if (account) {
      const authProvider = new AuthCodeMSALBrowserAuthenticationProvider(
        msal.instance ,
        {
          account,
          scopes: config.scopes,
          interactionType: InteractionType.Popup,
        }
      );

      const user = await getUser(authProvider);

      setUser({
        displayName: user.displayName || '',
        email: user.mail || user.userPrincipalName || '',
        timeFormat: user.mailboxSettings?.timeFormat || 'h:mm a',
        timeZone: user.mailboxSettings?.timeZone || 'UTC',
        id:user.id || '',
      });
    }
  };

  const signOut = async () => {
    await msal.instance.logoutPopup();
    setUser(undefined);
  };

  return {
    user,
    error,
    signIn,
    signOut,
    displayError,
    clearError,
  };
}
