import express from 'express';
import bodyParser from 'body-parser';
import { indexRoute } from './routes'
import setup from './models/setup';
import { globalMessage } from './middleware/global';
import { getUserRoute, getUsersRoute, postNewUserRoute, validatePasswordRoute } from './routes/users';
import { getEventsRoute, postNewEvent, getEventsByTypeRoute, getEventByEventNameRoute, getEventsByOwnerRoute, updateEventRoute, deleteEventRoute, getEventsByDateRoute} from './routes/events';
import { getEventsToUsersRoute, postNewRelationshipRoute, getEventsBySubscriberRoute, getEventsByPopularity} from './routes/usersToEvents';

import config  from './config';
import { error } from './middleware/errors';

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

app.all('/', indexRoute);

app.get('/users', getUsersRoute);
app.get('/users/:username', getUserRoute);
app.post('/user', postNewUserRoute);
app.get('/validateLogin/:username/:password', validatePasswordRoute);
app.get('/events', getEventsRoute);
app.get('/events/dates', getEventsByDateRoute);
app.get('/events/types', getEventsByTypeRoute);
app.get('/events/names', getEventByEventNameRoute);
app.get('/events/owners', getEventsByOwnerRoute);
app.post('/event', postNewEvent);
app.put('/event', updateEventRoute);
app.delete('/event', deleteEventRoute);
app.get('/events/popularitys', getEventsByPopularity);

app.post('/subscribeToEvent', postNewRelationshipRoute);
app.get('/subscriptions', getEventsToUsersRoute);
app.get('/events/subscriptions', getEventsBySubscriberRoute);

app.all('*', error);

setup(() => {
    app.listen(port, () => {
      console.log('express: server has been started on port ' + port + '.');
    });
});
