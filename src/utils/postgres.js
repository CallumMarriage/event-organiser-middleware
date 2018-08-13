import pg  from 'pg';
import config from '../config';

const pool = new pg.Pool(config.postgres);

//default query
module.exports.query = function (text, values, callback) {
  return pool.query(text, values, callback);
};

module.exports.connect = function (callback) {
  return pool.connect(callback);
};
