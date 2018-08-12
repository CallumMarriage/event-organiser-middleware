import { getUserByUsername} from '../models/users.js';
import { getEventsByUser, getUsersToEvents, insertUserToEvent, getUniqueEvents } from '../models/usersToEvents.js';
import { getEventByEventName, getEventsById} from '../models/events.js';
import { validatePasswordRoute } from './users.js';
const { sanitizeBody } = require('express-validator/filter');

export function getEventsBySubscriberRoute(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var username = req.query.subscription;
    
    console.log(username);
    getUserByUsername(req.id, username, (user) => {
        if(user.rows.length ===1){
            var user_id = user.rows[0].user_id;
            getEventsByUser(req.id, user_id, (events) => {
                if(events !== null){
                    if(events.rows.length > 0){
                        var array = [];
                        var i;
                        for(i = 0; i < events.rows.length; i++){
                            getEventsById(req.id, events.rows[i].event_id, (event) => {
                                if(event !== null){
                                    if(event.rows.length > 0){
                                        array.push( {event_id: event.rows[0].event_id,name: event.rows[0].name, description: event.rows[0].description, date: event.rows[0].date});
                                        console.log(array);
                                    }
                                }
                                if(i === (events.rows.length)){
                                    res.status(200).json(array);
                                }
                            });
                        }
                    } else {
                        res.status(200).json({message: 'You have no events'});
                    }
                }
            });
        } else {
            res.status(404).json({error: 'User not found'})
        }
      });

}

export function getEventsToUsersRoute(req, res) {
    
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  getUsersToEvents(req.id, (users) => {
    if (users !== null) {
      res.status(200).json(users.rows);
    } else {
      res.status(404).json({ error: 'No users in the database'});
    }
  });
}

export function postNewRelationshipRoute(req, res){
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var username = req.body.username;
  var eventName = req.body.eventName;
  var password = req.body.password;

  if(username == null || eventName == null || password == null){
      res.status(500).json({error: 'Missing Form item'});
      return;
  }

  sanitizeBody(username).trim().escape();
  sanitizeBody(password).trim().escape();
  sanitizeBody(eventName).trim().escape();

  getUserByUsername(req.id, username, (user) => {

    if(user.rows.length ===1){
        var user_id = user.rows[0].user_id;
        var user = user.rows[0];
        if(user.password !== null){
          bcrypt.compare(password, user.password, function(err, response) {
            if(err) {
                console.log(err);
                res.status(404).json({error: 'Username or password is incorrect'})
            } else if(response === true){
                getEventByEventName(req.id, eventName, (event) =>{
                    if(event.rows.length === 1){
                        var event_id = event.rows[0].event_id;
                        insertUserToEvent(req.id, event_id, user_id, (response) => {
                            if(response === true){
                                res.status(201).json({message: 'User has subscribed to event'});  
                             } else {
                                res.status(404).json({error: 'Invalid subscription attempt'});
                              }
                        });
                    }
                });

            } else {
              res.status(404).json({error: 'Username or password is incorrect'})
            }
          });
        }
    }
  });
}

export function getEventsByPopularity(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    getUniqueEvents(req.id, (response) => {
        if(response !== null){
            if(response.rows.length > 0){
                var array = [response.rows.length];

                var i = 0;
                response.rows.forEach(element => {
                    getEventsById(req.id, element.event_id, (event) => {
                        if(event !== null){
                            if(event.rows.length > 0){
                                var temp = "{'name': '" + event.rows[0].name + "', 'description': '"+ event.rows[0].description + "', 'date': " + event.rows[0].date +"'}";
                                array[i] = temp;
                                i++;
                            }
                        }
                    })
                });
                res.status(200).json(array)
            }
        }
    });
}