import { getEvents, insertEvent, getEventsByUsername, getEventsByName, getEventsByType, getEventsByOwner, updateEvent, deleteEvent } from '../models/events.js';
const { sanitizeBody } = require('express-validator/filter');
import { getUserByUsername} from '../models/users.js';


export function postNewEvent(req, res){
  
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    var name = req.body.name;
    var date = req.body.date;
    var description = req.body.description;
    var type = req.body.type;
    var owner = req.body.owner
    console.log(">> Request: " + name + "," + description + ", " + date + ", " + type + ", " + owner + ".");


    if(name == null || description == null || date == null || description == null || owner ==null){
        res.status(500).json({error: 'Missing Form item'});
        return;
    }
    sanitizeBody(name).trim().escape()
    sanitizeBody(type)
    sanitizeBody(description)
    sanitizeBody(date)
    sanitizeBody(owner)

    getUserByUsername(req.id, owner, (user) => {
      if(user !== null){
        if(user.rows.length === 1){
          if(user.rows[0].type === "Organiser"){
          getEventsByName(req.id, name, (event) =>{
            if(event !== null){
              if(event.rows.length === 0){
                insertEvent(name, type, description, date, owner, (response) => {
                  if(response === true){
                      res.status(201).json({message: 'Event created succesfully'});  
                   } else {
                      res.status(404).json({error: 'Invalid register attempt'});
                    }
                  });
                } else {
                  res.status(500).json({error: 'Event already exists'});
                }
              }
          });
        } else {
          res.status(400).json({error: 'You do not have the right permissions to access this.'});
        }
        }else {
          res.status(404).json({error: 'User does not exist'});
        }
      }
    });
  }

  export function getEventsByTypeRoute(req, res){
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var type = req.query.type;
    sanitizeBody(type)

    getEventsByType(req.id, type, (events) => {
      if (events !== null) {
        res.status(200).json(events.rows);
      } else {
        res.status(404).json({ error: 'No events in the database by that type'});
      }
    });
  }
  

  export function getEventsRoute(req, res) {
        
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    getEvents(req.id, (events) => {  
      if (events !== null) {
        res.status(200).json(events.rows);
      } else {
        res.status(404).json({ error: 'No events in the database'});
      }
    });
  }

  export function getEventRoute(req, res) {
    
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    const username = req.query.username;
    if (username !== null){
      if( username !== '') {
      getEventsByUsername(req.id, username, (result) => {
        if (result !== null){ 
            if(result.rows.length > 0) {
              res.status(200).json(result.rows);
            } else {
            res.status(404).json({ error: 'Could not find event with username \'' + username + '\''});
          } 
       }else {
          res.status(404).json({ error: 'Could not find event with username \'' + username + '\''});
      }
      });
    }
   } else {
      res.status(400).json({ error: 'Invalid request'});
    }
  }

  export function getEventByEventNameRoute(req, res){
        
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const name = req.query.name;

    if(name !== null){
      getEventsByName(req.id, name, (result) =>{
        if(result != null){
          if(result.rows.length === 1) {
            res.status(200).json(result.rows);
          } else {
            res.status(404).json({ error: 'Could not find event with name \'' + name + '\''});
        } 
        }
      });
    }
  }

  export function getEventsByOwnerRoute(req, res){
            
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const owner = req.query.username;

    if(owner !== null){
      getEventsByOwner(req.id, owner, (result) =>{
        if(result != null){
          if(result.rows.length > 0) {
            res.status(200).json(result.rows);
          } else {
            res.status(404).json({ error: 'Could not find your events'});
          } 
        }
      });
    } else {
      res.status(400).json({error: 'Missing query Parameter username'})
    }
  }

  export function updateEventRoute(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    const name = req.body.name;
    const type = req.body.type;
    const description = req.body.description;
    const date = req.body.date;

    getEventByEventName(req.id, name, (event) => {
      if(event !== null){
          if(event.rows.length === 1){
            updateEvent(req.id, name, type, description, date, (response) =>{
              if(response != null){
                if(response === true){
                  res.status(201).json({message: 'Event updated succesfully'});  
               } else {
                  res.status(404).json({error: 'Invalid update attempt'});
                }
              }
            });
          } else {
            res.status(404).json({error: 'Event does not exist'});
          }
      }
    })
  }

  export function deleteEventRoute(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    const owner = req.body.owner;
    const name = req.body.name;

    if(owner == null || name == null){
      res.status(400).json({error: 'Parameter is missing'});
    }

    getUserByUsername(req.id, owner, (user) => {
      if(user !== null){
        if(user.rows.length === 1){
          if(user.rows[0].type === "Organiser"){
            deleteEvent(req.id, name, (response) => {
              if(response !== null){
                  if(response === true){
                    res.status(200).json({message: 'Event has been deleted'});
                  } else {
                    res.status(404).json({error: 'Could not find event to delete'})
                  }
              }
            });
        } else {
          res.status(400).json({error: 'You do not have the right permissions to access this.'});
        }
        }else {
          res.status(404).json({error: 'User does not exist'});
        }
      }
    });
  }