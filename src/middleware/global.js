import url from 'url';
import random from '../utils/random.js';

export function global(req, res, next) {
  req.id = random.string(8);
  console.log('express: [ ' + req.id + ' ] ' + req.method + ' request recieved for ' + url.parse(req.url).pathname);
  next();
}

