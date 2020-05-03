/**
 * userRoutes.js
 * Routes Relevant to User Table and User login data
 * CIS 450/550 Final Project
 * @author: Ally Zhang, Derek He, Wendy Wu
 */

/***********************
 * Module Requirements *
 ***********************/
var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; //all column names are UPPERCASE!
oracledb.autoCommit = true;
var credentials = require('./../credentials.json');
var async = require('async');

/**********
 * Routes *
 **********/

/**
 * checkDuplicate
 * Checks for a duplicate customer email on account creation
 * @param email customer email to check
 * @callback next callback function to be executed when duplicate doesn't exist
 */
function checkDuplicate (email, next) {
  var query = `
    SELECT *
    FROM Customer
    WHERE email = :inputEmail
  `;
  const binds = [email]
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, binds, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          if (result.rows.length > 0) {
            console.log("already exists account")
            next("Duplicate account")
          } else {
            next(null)
          }
        }
      });
    }
  });
}

/**
 * signUp
 * Creates a user account if the email is not already registered
 * @param email customer email
 * @param first customer first name
 * @param last customer last name
 * @param password customer password
 */
function signUp(req, res) {
  let inputEmail = req.body.email
  let name = req.body.first + " " + req.body.last
  let pass = req.body.password

  checkDuplicate (inputEmail, function (isDuplicate) {
    if (isDuplicate !== null) {
      res.json({msg: "Duplicate"})
    } else {
      //actually inserting new record into DB
      var query = `
        INSERT INTO 
        Customer (email, name, password)
        VALUES (:e, :n, :p)
      `;
      const binds = [inputEmail, name, pass]
      oracledb.getConnection({
        user : credentials.user,
        password : credentials.password,
        connectString : credentials.connectString
      }, function(err, connection) {
        if (err) {
          console.log("DB connection err: " + err);
        } else {
          connection.execute(query, binds, function(err, result) {
            if (err) {console.log("Query err: " + err);}
            else {
              console.log(result.rowsAffected)
              res.json(result)
            }
          });
        }
      });
    }
  })
}

/**
 * checkLogin
 * Checks the login credentials of a user
 * @param email customer email
 * @param customer password
 */
function checkLogin(req, res) {
  var query = `
    SELECT *
    FROM Customer
    WHERE email = :inputEmail AND password = :inputPassword
  `;
  const binds = [req.params.email, req.params.password]
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, binds, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          if (result.rows.length == 1) {
            console.log("logged in!")
            return res.json(result.rows)
          } else {
            //if wrong password
            console.log("wrong pass "  + req.body.email)
            return res.json(result.rows)
          }
        }
      });
    }
  });
}

/******************
 * Testing Routes *
 ******************/
//TEMPORARY - just to see if user can be signed up
function getAllCustomers(req, res) {
  var query = `
    SELECT * 
    FROM Customer
  `;
  oracledb.getConnection({
    user : credentials.user,
    password : credentials.password,
    connectString : credentials.connectString
  }, function(err, connection) {
    if (err) {
      console.log(err);
    } else {
      connection.execute(query, function(err, result) {
        if (err) {console.log(err);}
        else {
          console.log(result.rows)
          res.json(result.rows)
        }
      });
    }
  });
}

/***********
 * Exports *
 ***********/
module.exports = {
	signUp: signUp,
	checkLogin: checkLogin,
	getAllCustomers: getAllCustomers
}