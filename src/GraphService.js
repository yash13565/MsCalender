const { Client, PageIterator } = require('@microsoft/microsoft-graph-client');
const { startOfYear, endOfYear } = require('date-fns');
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
  const user = await graphClient.api(`/me`)
    // Only retrieve the specific fields needed
    .select('displayName,mail,mailboxSettings,userPrincipalName,id')
    .get();

  return user;
}
async function getAllCalendar(authProvider) {
  ensureClient(authProvider);
 
  const getCal = await graphClient.api(`/me/calendars`).get()
  return getCal;
}
async function getUsersCalendar(authProvider, timeZone , id) {
  ensureClient(authProvider);

  const now = new Date();
  const startDateTime = zonedTimeToUtc(startOfYear(now), timeZone).toISOString();
  const endDateTime = zonedTimeToUtc(endOfYear(now), timeZone).toISOString();
  // console.log(startDateTime, 'startdate')
  // console.log(endDateTime, 'enddate')
  // GET /me/calendarview?startDateTime=''&endDateTime=''
  // &$select=subject,organizer,start,end
  // &$orderby=start/dateTime
  // &$top=50
  
  const response = await graphClient.api(`/users/${id}/calendars/${id}`)
    // .header('Prefer', `outlook.timezone="${timeZone}"`)
    // .query({ startDateTime: startDateTime, endDateTime: endDateTime })
    // .select('subject,organizer,start,end,id')
    // .orderby('start/dateTime')
    .top(25)
    .get();

  if (response["@odata.nextLink"]) {
    // Presence of the nextLink property indicates more results are available
    // Use a page iterator to get all results
    const events = [];

    // Must include the time zone header in page
    // requests too
    const options = {
      // headers: { 'Prefer': `outlook.timezone="${timeZone}"` }
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
  return await graphClient.api(`/me/events`).post(newEvent);
}

module.exports = {
  getUser,
  getUsersCalendar,
  createEvent,
  getAllCalendar
};
