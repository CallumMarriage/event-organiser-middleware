import config from '../config.js';
//set up users
import { setUpUsers } from './models/users';
//set up events
import { setUpEvents } from './models/events';
//set up relationship between users and events
import { setupUsersToEvents } from './models/usersToEvents';

export default function setup(next) {
  console.log(">> Set up started");
  if (config.app.env === 'local' || config.app.env === 'development') {
    dropTables(() => {
      setUpUsers(() => {
        setUpEvents(() => {
          setupUsersToEvents(() => {
            next();
          });
        });
      });
    });
  } else {
    next();
  }
}

function dropTables(next) {
  const pool = require('../utils/postgres.js');
  console.log(">> dropping tables");
  pool.query('drop schema IF EXISTS public cascade', [], (err, res) => {
    if(err) {
      console.log(err);
      return err;
    } else {
      pool.query('create schema public;', [], (err, res) => {
        console.log('>> Creating schema');
        next();
      });
    }
  });
}
