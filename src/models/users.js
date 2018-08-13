import escape from 'pg-escape';

//uses escape to prevent sql injection.

export function getUserByUsername(requestId, username, callback) {
  const pool = require('../utils/postgres.js');
  
  const query = escape('SELECT * FROM users WHERE username=$1');
  pool.query(query, [username], (err, res) => {
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

export function setUpUsers(next){
  createUsersTable(() => {
    console.log(">> Inserting users");
    insertUser('Admin', 'Admin@gmail.com', 'Admin', 'admin', 'Organiser', () => {
      insertUser('Student', 'student@gmail.com', 'Student', 'student', 'Student', () => {
        insertUser('Student2', 'student2@gmail.com', 'Student2', 'student', 'Student', () => {
          next();
        });
      });
    });
  });
}

export function getUsersFromSet(requestId, event_id, callback){
  const pool = require('../utils/postgres.js');

  console.log(">> " + requestId + ", " + event_id);
  const query = escape('SELECT * FROM users WHERE user_id = ALL(SELECT user_id FROM users_to_events WHERE event_id=$1) ');
  pool.query(query, [event_id], (err, res) => {
    if(err) {
      callback(null);
    } else {
      callback(res);
    }
  });
}

export function insertUser(username, email, fullName, password, type, callback) {
  const bcrypt = require('bcrypt');
  const pool = require('../utils/postgres.js');
  console.log('>> Inserting user');
  const query = escape('INSERT INTO users (username, email, full_name, password, type) VALUES ($1, $2, $3, $4, $5)');

  bcrypt.hash(password, 10, function(err, hash) {
    if(err){
        callback(false);
    } else {
      pool.query(query, [username, email, fullName, hash, type], (err, res) => {
       if(err) {
          callback(false);
        } else {
          callback(true);
        }
     });
    }
  });
}

export function createUsersTable(next) {
  const pool = require('../utils/postgres.js');

  pool.query('CREATE SEQUENCE user_id_counter', [], (err, res) => {

    var query = escape('CREATE TABLE users ( user_id INTEGER NOT NULL default nextval(\'user_id_counter\'), username TEXT, email TEXT, full_name TEXT, password TEXT, type TEXT, PRIMARY KEY (user_id))');

    pool.query(query, [], (err, res) => {
      if(err) {
      } else {
        pool.query('ALTER SEQUENCE user_id_counter owned by users.user_id', [], (err, res) => {
          next();
        });
      }
    });
  });
}

export function getUsers(requestId, callback) {
  const pool = require('../utils/postgres.js');

  const query = escape('SELECT * FROM users');
  pool.query(query, [], (err, res) => {
    if(err) {
      callback(null);
    } else {
      callback(res);
    }
  });
}

//uses escape to prevent sql injection.

export function getUserByUserId(requestId, user_id, callback) {
  const pool = require('../utils/postgres.js');
  console.log(">> " + requestId + ", " + user_id);
  const query = escape('SELECT * FROM users WHERE user_id=$1');
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