import { getUserByUsername, getUserByUserId} from '../models/users.js';
import { getEventsByUser, getUsersToEvents, insertUserToEvent, getUniqueEvents, getNumberOfSubscribers, getSubscribersByEvent, getEventsByUserAndEvent } from '../models/usersToEvents.js';
import { getEventsByName, getEventsById} from '../models/events.js';
const { sanitizeBody } = require('express-validator/filter');

export function getSubscribersByEventRoute(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var eventName = req.params.eventName;

    console.log(eventName);
    getEventsByName(req.id, eventName, (event) => {
        if(event !== null){
            if(event.rows.length == 1){
                console.log(event.rows[0]);
                getSubscribersByEvent(req.id, event.rows[0].event_id, (subscribers) => {
                    var array = [];
                    var i;
                    for(i = 0; i < subscribers.rows.length; i++){
                        console.log(subscribers.rows);
                        getUserByUserId(req.id, subscribers.rows[i].user_id, (subscriber) => {
                            console.log(subscriber.rows);
                            if(subscriber !== null){
                                if(subscriber.rows.length > 0){
                                    array.push({user_id: subscriber.rows[0].user_id, name: subscriber.rows[0].full_name});
                                    console.log(array);
                                }
                            }
                            if(i === (subscribers.rows.length)){
                                res.status(200).json(array);
                            }
                        });
                    }
                });
            } else {
                res.status(404).json({error: 'could not find event with that name'});
            }
        }
    });
}


export function getEventsBySubscriberRoute(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var username = req.query.subscription;
    
    console.log(username);
    getUserByUsername(req.id, username, (user) => {
        console.log(">> "+user)
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
                                    }
                                }
                                if(i === (events.rows.length)){
                                    res.status(200).json(array);
                                }
                            });
                            if(i === (events.rows.length)){
                                res.status(200).json(array);
                            }
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

  if(username == null || eventName == null){
      res.status(500).json({error: 'Missing Form item'});
      return;
  }

  sanitizeBody(username).trim().escape();
  sanitizeBody(eventName).trim().escape();

  getUserByUsername(req.id, username, (user) => {
    if(user !== null){
        if(user.rows.length === 1){
            var user_id = user.rows[0].user_id;
            console.log("user: " + user.rows[0]);   
            getEventsByName(req.id, eventName, (event) =>{
                if(event.rows.length === 1){
                    var event_id = event.rows[0].event_id;
                    getEventsByUserAndEvent(req.id, user_id, event_id, (events) => {
                        if(events !== false && events.rows.length === 0){
                            insertUserToEvent(req.id, user_id, event_id, (response) => {
                                if(response === true){
                                    res.status(201).json({message: 'User has subscribed to event'});  
                                } else {
                                    res.status(404).json({error: 'Invalid subscription attempt'});
                                }
                            });
                        } else {
                            res.status(400).json({error: "You have already subscribed to this event"});
                        }
                    });
                } else {
                    res.status(404).json({error: "Event does not exist"});
                }
            });
        } else {
            res.status(404).json({error: "User does not exist"});
        }
    } else {
        res.status(500).json({error: "Internal Server Error"});
    }
  });
}



export function getEventsByPopularity(req, res){
   
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var number = req.query.popularity;

    if(number == null){
        res.status(400).json({error: 'paramater is missing'});
    }
    getUniqueEvents(req.id, (response) => {
        if(response !== null){
            if(response.rows.length > 0){
                var array = [];
                var i;  
                for(i = 0; i < response.rows.length; i++){  
                    getNumberOfSubscribers(req.id, response.rows[i].event_id, (subscribers) => {
                
                        console.log(">> Number of subsribers : " + subscribers.rows[0].count);
                        if(subscribers.rows[0].count === number){
                            getEventsById(req.id, response.rows[i-1].event_id, (event) => {

                                if(event !== null){
                                    if(event.rows.length > 0){
                                        array.push( {event_id: event.rows[0].event_id,name: event.rows[0].name, description: event.rows[0].description, date: event.rows[0].date});
                                    }
                                }
                                if(i === (response.rows.length)){    
                                    res.status(200).json(array);
                                }
                
                            });
                        } else {
                            if(i === (response.rows.length)){    
                                res.status(200).json(array);
                            }
                        }
                    });
                    
                }   
            } else {
                res.status(404).json({error: 'Couldnt find any events with that many subscribers'});

            }
        }
    });
}