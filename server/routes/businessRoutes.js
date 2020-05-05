/**
 * businessRoutes.js
 * Routes Relevant to Business Table and Business Data
 * CIS 450/550 Final Project
 * @author: 
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
//Searches for businesses in given city, state, minstars
/**
 * searchCityBusiness
 * Searches for businesses in given city and state with minimum number of stars
 * @param city City
 * @param state State
 * @param stars Minimum number of stars for a business
 */ 
function searchCityBusiness(req, res) {
  var query = `
    SELECT *
    FROM business
    WHERE (city=:city AND state=:st AND stars >= :stars)
    ORDER BY business.name
  `;
  let city = req.params.city
  let state = req.params.state
  let stars = req.params.stars

  const binds = [city, state, stars]
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
          res.json(result.rows)
        }
      });
    }
  });
}

//Searches for businesses in given city, state, minstars
/**
 * searchCityBusiness
 * Searches for businesses in given city and state with minimum number of stars
 * @param city City
 * @param state State
 * @param stars Minimum number of stars for a business
 */ 
function searchCityBusinessCat(req, res) {
  var query = `
    SELECT *
    FROM business
    WHERE city=:city AND state=:st AND stars >= :stars AND categories LIKE :cat
    ORDER BY business.name
  `;
  let city = req.params.city
  let state = req.params.state
  let stars = req.params.stars
  let category = "%" + req.params.category + "%"

  const binds = [city, state, stars, category]
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
          res.json(result.rows)
        }
      });
    }
  });
}


/**
 *
 * Searches for all the businesses of a particular category (attraction, restaurant, etc)
 * with an average rating higher than x stars in a specific state
 * @param state State
 * @param count Count to return
 * @param cat Category
 */
function searchBusinessByCat(req, res) {
  var query = `
    SELECT business_id, name
    FROM business
    WHERE state = :state
    AND stars >= :count
    AND categories LIKE :cat
  `;
  let state = req.params.state;
  let count = req.params.count;
  let cat = "%" + req.params.cat + "%";
  const binds = [state, count, cat];

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
  searchCityBusiness: searchCityBusiness,
  searchCityBusinessCat: searchCityBusinessCat
}