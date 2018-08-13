import escape from 'pg-escape';

export function getEventsByUser(requestId, user_id, callback) {
    const pool = require('../utils/postgres.js');
    
    const query = escape('SELECT * FROM users_to_events WHERE user_id=$1');
    pool.query(query, [user_id], (err, res) => {
      if(err) {
        callback(null);
      } else {
        if (res) {
          callback(res);
        } else {
          callback(null);
        }
      }
    });
  }

  export function getSubscribersByEvent(requestId, event_id, callback){
    const pool = require('../utils/postgres.js');
    console.log('>> ' + requestId + 'Getting subcribers with id '+event_id +'.');
    const query = escape('SELECT * FROM users_to_events WHERE event_id=$1');
    pool.query(query, [event_id], (err, res) => {
      if(err) {
         callback(false);
        } else {
         callback(res);
        }
    });
  }
  
  export function getEventsByUserAndEvent(requestId, user_id, event_id, callback){
    const pool = require('../utils/postgres.js');
    console.log('>> ' + requestId + 'Getting events with' + user_id + ' and ' + event_id +'.');
    const query = escape('SELECT * FROM users_to_events WHERE user_id=$1 AND event_id=$2');
  
    pool.query(query, [user_id, event_id], (err, res) => {
      if(err) {
         callback(false);
        } else {
         callback(res);
        }
    });
  }

  export function getEventsFromSet(requestId, events, callback){
    const pool = require('../utils/postgres.js');
    console.log('>> ' + requestId );
    const query = escape('SELECT * FROM users_to_events WHERE FIND_IN_SET(event_id, $1)');
  
    pool.query(query, [events], (err, res) => {
      console.log(err);
      if(err) {
         callback(false);
        } else {
          console.log(res);
         callback(res);
        }
    });
  }

  export function insertUserToEvent(requestId, user_id, event_id, callback) {
    const pool = require('../utils/postgres.js');
    console.log('>> ' + requestId + 'Adding relationship between ' + user_id + ' and ' + event_id +'.');
    const query = escape('INSERT INTO users_to_events (user_id, event_id) VALUES ($1, $2)');
  
    pool.query(query, [user_id, event_id], (err, res) => {
      if(err) {
         callback(false);
        } else {
         callback(true);
        }
    });
  }
  
  export function createUsersToEventsTable(next) {
    const pool = require('../utils/postgres.js');
  
    pool.query('CREATE SEQUENCE user_to_event_id_counter', [], (err, res) => {
  
      var query = escape('CREATE TABLE users_to_events ( user_to_event_id INTEGER NOT NULL default nextval(\'user_id_counter\'), user_id INTEGER, event_id INTEGER, PRIMARY KEY (user_to_event_id))');
  
      pool.query(query, [], (err, res) => {
        if(err) {
        } else {
          pool.query('ALTER SEQUENCE user_to_event_id_counter owned by users_to_events.user_to_event_id', [], (err, res) => {
            next();
          });
        }
      });
    });
  }
  
  export function setupUsersToEvents(next){
    createUsersToEventsTable(() => {
      insertUserToEvent('', 2, 1, () => {
        next();
      })
    });
  }

  export function getUsersToEvents(requestId, callback) {
    const pool = require('../utils/postgres.js');
  
    console.log(">> " + requestId);
    const query = escape('SELECT * FROM users_to_events');
    pool.query(query, [], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }

  export function getNumberOfSubscribers(requestId, event_id, callback){
    const pool = require('../utils/postgres.js');

    console.log(">> " + requestId + " Getting subscribers for " + event_id);
    const query = escape('SELECT COUNT(*) FROM users_to_events WHERE event_id=$1');
    
    pool.query(query, [event_id], (err, res) => {
      if(err) {
        callback(null);
      }else {
        console.log(res);
        callback(res);
      }
    });
  }

  export function getUniqueEvents(requestId, callback){
    const pool = require('../utils/postgres.js');

    console.log(">> " + requestId + " Getting events");
    const query = escape('SELECT DISTINCT event_id FROM users_to_events');

    pool.query(query, [], (err, res) => {
      if(err) {
        callback(null);
      }else {
        console.log(res);
        callback(res);
      }
    });
  }