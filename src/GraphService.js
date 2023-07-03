const { Client, PageIterator } = require('@microsoft/microsoft-graph-client');
const { AuthCodeMSALBrowserAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser');
const { endOfWeek, startOfWeek } = require('date-fns');
const { zonedTimeToUtc } = require('date-fns-tz');


let graphClient = undefined;

function ensureClient(authProvider) {
  if (!graphClient) {
    graphClient = Client.initWithMiddleware({
      authProvider: authProvider
    });
  }

  return graphClient;
}

async function getUser(authProvider) {
  ensureClient(authProvider);

  // Return the /me API endpoint result as a User object
  const user = await graphClient.api('/me')
    // Only retrieve the specific fields needed
    .select('displayName,mail,mailboxSettings,userPrincipalName')
    .get();

  return user;
}
async function getAllCalendar(authProvider){
  ensureClient(authProvider);
  const getCal = await graphClient.api('/me/calendars').get()
  return getCal;
}
async function getUserWeekCalendar(authProvider, timeZone) {
  ensureClient(authProvider);

  // Generate startDateTime and endDateTime query params
  // to display a 7-day window
  const now = new Date();
  const startDateTime = zonedTimeToUtc(startOfWeek(now), timeZone).toISOString();
  const endDateTime = zonedTimeToUtc(endOfWeek(now), timeZone).toISOString();

  // GET /me/calendarview?startDateTime=''&endDateTime=''
  // &$select=subject,organizer,start,end
  // &$orderby=start/dateTime
  // &$top=50
  const response = await graphClient.api('/me/calendarview')
    .header('Prefer', `outlook.timezone="${timeZone}"`)
    .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    .select('subject,organizer,start,end')
    .orderby('start/dateTime')
    .top(25)
    .get();

  if (response["@odata.nextLink"]) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    const events = [];

    // Must include the time zone header in page
    // requests too
    const options = {
      headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
    };

    const pageIterator = new PageIterator(graphClient, response, (event) => {
      events.push(event);
      return true;
    }, options);

    await pageIterator.iterate();

    return events;
  } else {
    return response.value;
  }
}

async function createEvent(authProvider, newEvent) {
  ensureClient(authProvider);

  // POST /me/events
  // JSON representation of the new event is sent in the
  // request body
  return await graphClient.api('/me/events').post(newEvent);
}

module.exports = {
  getUser,
  getUserWeekCalendar,
  createEvent,
  getAllCalendar
};
