import { getUserByUsername} from '../models/users.js';
import { getEventsByUser, getUsersToEvents, insertUserToEvent, getUniqueEvents, getNumberOfSubscribers } from '../models/usersToEvents.js';
import { getEventsByName, getEventsById} from '../models/events.js';
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcrypt');

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
    if(user !== null){
        console.log(user);

        if(user.rows.length === 1){
            var user_id = user.rows[0].user_id;
            console.log("user: " + user);

            getEventsByName(req.id, eventName, (event) =>{
                if(event.rows.length === 1){
                    var event_id = event.rows[0].event_id;

                    insertUserToEvent(req.id, user_id, event_id, (response) => {
                        if(response === true){
                            res.status(201).json({message: 'User has subscribed to event'});  
                         } else {
                            res.status(404).json({error: 'Invalid subscription attempt'});
                          }
                    });
                } 
            });
        }
    }
  });
}



export function getEventsByPopularity(req, res){
   
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var number = req.param.popularity;

    if(number == null){
        res.status(400).json({error: 'paramater is missing'});
    }
    getUniqueEvents(req.id, number, (response) => {
        if(response !== null){
            if(response.rows.length > 0){
                var array = [];
                var i;  
                console.log(response);
                for(i = 0; i < response.rows.length; i++){  
                    getNumberOfSubscribers(req.id, response.rows[i].event_id, (subscribers) => {
                        if(subscribers === number){
                            getEventsById(req.id, response.rows[i].event_id, (event) => {
                                if(event !== null){
                                    if(event.rows.length > 0){
                                        array.push( {event_id: event.rows[0].event_id,name: event.rows[0].name, description: event.rows[0].description, date: event.rows[0].date});
                                        console.log(array);
                                    }
                                }
                                if(i === (response.rows.length)){    
                                res.status(200).json(array);
                                }
                            });
                        }
                    });
                }
            }   
        }
    });
    res.status(404).json({error: 'Couldnt find any events with that many subscribers'});
}