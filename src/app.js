import express from 'express';
import bodyParser from 'body-parser';

//models setup (create tables and insert data)
//drop tables
import setup from './models/setup';
//set up users
import { setUpUsers } from './models/users';
//set up events
import { setUpEvents } from './models/events';
//set up relationship between users and events
import { setupUsersToEvents } from './models/usersToEvents';

//middleware
import { error } from './middleware/errors';
import { globalMessage } from './middleware/global';

//routes
import { indexRoute } from './routes'
import { getUserRoute, getUsersRoute, postNewUserRoute, validatePasswordRoute } from './routes/users';
import { getEventsRoute, postNewEvent, getEventsByTypeRoute, getEventByEventNameRoute, getEventsByOwnerRoute, updateEventRoute, deleteEventRoute, getEventsByDateRoute} from './routes/events';
import { getEventsToUsersRoute, postNewRelationshipRoute, getEventsBySubscriberRoute, getEventsByPopularity} from './routes/usersToEvents';

//config
import config  from './config';

var cors = require('cors');

var app = express();

app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true
}));

const port = process.env.PORT || config.app.port;

app.all('*', globalMessage);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//index route
app.all('/', indexRoute);

//get users
app.get('/users', getUsersRoute);
//get user by username
app.get('/users/:username', getUserRoute);
//post new user
app.post('/user', postNewUserRoute);
//validate the password of the user
app.get('/validateLogin/:username/:password', validatePasswordRoute);

//get events
app.get('/events', getEventsRoute);
//get events at a certain date
app.get('/events/dates', getEventsByDateRoute);
//get events of a certain type
app.get('/events/types', getEventsByTypeRoute);
//get event by name
app.get('/events/names', getEventByEventNameRoute);
//get events by owner
app.get('/events/owners', getEventsByOwnerRoute);
//post new event
app.post('/event', postNewEvent);
//update event
app.put('/event', updateEventRoute);
//delete event
app.delete('/event', deleteEventRoute);
//get events with a certain number of subscribers
app.get('/events/popularitys', getEventsByPopularity);

//subscribe to new event
app.post('/subscribeToEvent', postNewRelationshipRoute);
//get all subscriptions
app.get('/subscriptions', getEventsToUsersRoute);
//get events user is subscribed to
app.get('/events/subscriptions', getEventsBySubscriberRoute);

app.all('*', error);

setup(() => {
  setUpUsers(() => {
    setUpEvents(() => {
      setupUsersToEvents(() => {
        app.listen(port, () => {
          console.log('express: server has been started on port ' + port + '.');
        });
      });
    });
  });
});
