import escape from 'pg-escape';

export function createEventsTable(next) {
    const pool = require('../utils/postgres.js');
  
    pool.query('CREATE SEQUENCE event_id_counter', [], (err, res) => {
  
      var query = escape('CREATE TABLE events ( event_id INTEGER NOT NULL default nextval(\'event_id_counter\'), name TEXT, type TEXT, description TEXT, date TEXT, owner TEXT, PRIMARY KEY (event_id))');
  
      pool.query(query, [], (err, res) => {
        if(err) {
        } else {
          pool.query('ALTER SEQUENCE event_id_counter owned by events.event_id', [], (err, res) => {
            next();
          });
        }
      });
    });
  }

  export function getEventsByType(requestId, type, callback){
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId);

    console.log('>> Handling request for get Events by type: ' + type);
    const query = escape('SELECT * FROM events WHERE type=$1');
    pool.query(query, [type], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }

  export function insertEvent(name, type, description, date, owner, callback) {
    const pool = require('../utils/postgres.js');

    console.log('>> Inserting event');
    const query = escape('INSERT INTO events (name, type, description, date, owner) VALUES ($1, $2, $3, $4, $5 )');
        pool.query(query, [name, type, description, date, owner], (err, res) => {
         if(err) {
             console.log(err);
            callback(false);
          } else {
            callback(true);
          }
       });
  }

  export function getEvents(requestId, callback) {
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId);

    const query = escape('SELECT * FROM events');
    pool.query(query, [], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }

  export function getEventsByName(requestId, name, callback) {
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId) + ", " + name;
    const query = escape('SELECT * FROM events WHERE name=$1');
    pool.query(query, [name], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }

  export function getEventsByOwner(requestId, owner, callback) {
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId);
    const query = escape('SELECT * FROM events WHERE owner=$1');
    pool.query(query, [owner], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }

  export function updateEvent(requestId, eventName, description, date, type, callback){
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId + " " + eventName + ", " + description + ", " + date + ", " + type);
    const query = escape('UPDATE events SET (name, description, type, date) = ($1, $2, $3, $4) WHERE name = $1');
    pool.query(query, [eventName, description, type, date], (err, res) => {
      if(err) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  export function deleteEvent(requestId, eventName, callback){
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId + ", " + eventName);
    const query = escape('DELETE FROM events WHERE name = $1');
    pool.query(query, [eventName], (err, res) => {
      if(err) {
        callback(false);
      } else {
        callback(true);
      }
    });
    
  }

  export function getEventsByDate(requestId, date, callback){
    const pool = require('../utils/postgres.js');

    console.log(">> " + requestId + ", " + date);
    const query = escape('SELECT * FROM events WHERE date = $1');

    pool.query(query, [date], (err, res) => {
      if(err) {
        callback(false);
      } else {
        callback(res);
      }
    });
  }

  export function getEventsById(requestId, event_id, callback) {
    const pool = require('../utils/postgres.js');
    console.log(">> " + requestId) + ", " + name;
    const query = escape('SELECT * FROM events WHERE event_id=$1');
    pool.query(query, [event_id], (err, res) => {
      if(err) {
        callback(null);
      } else {
        callback(res);
      }
    });
  }
