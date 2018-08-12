import config from '../config.js';
import { createUsersTable, insertUser } from './users.js';
import { createEventsTable, insertEvent } from './events.js';
import { createUsersToEventsTable, insertUserToEvent} from './usersToEvents';

export default function setup(next) {
  console.log(">> Set up started");
  if (config.app.env === 'local' || config.app.env === 'development') {
    dropTables(() => {
      createUsersTable(() => {
        console.log(">> Inserting Root");
        insertUser('Admin', 'Admin@gmail.com', 'Admin', 'admin', 'Organiser', () => {
          insertUser('Student', 'student@gmail.com', 'Student', 'student', 'Student', () => {
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
