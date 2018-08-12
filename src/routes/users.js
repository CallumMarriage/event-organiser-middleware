import { getUserByUsername, getUsers, insertUser, getPassword} from '../models/users.js';
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcrypt');


export function getUserRoute(req, res) {
    
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  
  const username = req.params.username;
  if (username !== null){
    if( username !== '') {
    getUserByUsername(req.id, username, (result) => {
      if (result !== null){ 
          if(result.rows.length === 1) {
            res.status(200).json(result.rows[0]);
          } else {
          res.status(404).json({ error: 'Could not find user with username \'' + username + '\''});
        } 
     }else {
        res.status(404).json({ error: 'Could not find user with username \'' + username + '\''});
    }
    });
  }
 } else {
    res.status(400).json({ error: 'Invalid request'});
  }
}

export function getUsersRoute(req, res) {
    
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  getUsers(req.id, (users) => {
    if (users !== null) {
      res.status(200).json(users.rows);
    } else {
      res.status(404).json({ error: 'No users in the database'});
    }
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}


export function postNewUserRoute(req, res){
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  var username = req.body.username;
  var email = req.body.email;
  var fullName = req.body.fullName;
  var type = req.body.type;


  console.log(">>" + req.id);
  

  if(username == null || email == null || fullName == null || req.body.password == null || type == null){
      res.status(500).json({error: 'Missing Form item'});
      return;
  }
  if(!validateEmail(email)){
    res.status(500).json({error: "Email is invalid"});
  }

  if(req.body.password.length < 5 ){
    res.status(500).json({error: 'Password is too short'});
  }

  sanitizeBody(username).trim().escape()
  sanitizeBody(email)
  sanitizeBody(fullName)
  sanitizeBody(type)

  getUserByUsername(req.id, username, (user) => {

        
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");


    if(user.rows.length > 0){
      res.status(500).json({message: 'Username already in use'})
    } else {
      insertUser(username, email, fullName, req.body.password, type, (response) => {
        if(response === true){
          res.status(201).json({message: 'user created succesfully'});
         } else {
              res.status(500).json({error: 'Invalid register attempt'});
            }
          });
      }
    });
  }

  export function validatePasswordRoute(req, res){
      
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    var username = req.params.username
    getUserByUsername(req.id, username, (response) => {
      if(response.rows.length === 1){
        var user = response.rows[0];
        if(user !== null){
          if(user.password !== null){
            bcrypt.compare(req.params.password, user.password, function(err, response) {
              if(err) {
                  console.log(err);
                  res.status(404).json({error: 'Username or password is incorrect'})
              } else if(response === true){
                  console.log(response);
                  res.status(200).json({message: true})
              } else {
                res.status(404).json({error: 'Username or password is incorrect'})
              }
            });
          } else {
            res.status(404).json({error: 'Username or password is incorrect'})
          }
        } 
      }else {
        res.status(404).json({error: 'No users with that username'})

      }
    })
  }