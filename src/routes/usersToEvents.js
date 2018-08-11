import { getUserByUsername} from '../models/users.js';
import { getEventsByUser, getUsersToEvents, insertUserToEvent } from '../models/usersToEvents.js';
import { getEventByEventName } from '../models/events.js';
const { sanitizeBody } = require('express-validator/filter');

export function getEventsBySubscriberRoute(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var username = req.query.username;

    console.log(username);
    getUserByUsername(req.id, username, (user) => {
        if(user.rows.length ===1){
            var user_id = user.rows[0].user_id;
            getEventsByUser(req.id, user_id, (events) => {
                if(events !== null){
                    if(events.rows.length > 0){
                        res.status(200).json(events.rows);
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

  sanitizeBody(username).trim().escape()
  sanitizeBody(eventName).trim().escape();

  getUserByUsername(req.id, username, (user) => {

    if(user.rows.length ===1){
        var user_id = user.rows[0].user_id;
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
    }
  });
}