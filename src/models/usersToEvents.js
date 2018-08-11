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
  
  export function insertUserToEvent(user_id, event_id, callback) {
    const pool = require('../utils/postgres.js');
    console.log('>> Adding relationship between' + user_id + ' and ' + event_id +'.');
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
  
  export function getUsersToEvents(requestId, callback) {
    const pool = require('../utils/postgres.js');
  
    const query = escape('SELECT * FROM users_to_events');
    pool.query(query, [], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }