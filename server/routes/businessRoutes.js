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

/**
 *
 * Give recommended business based on itin routes
 * business is from same state, has average rating 5
 * @param email user email
 */
function searchRecBusiness(req, res) {
  var query = `
    SELECT *
    FROM (
      WITH 
      allItinBus AS (
          SELECT b.business_id, b.city, b.name
          FROM itinerary i
          LEFT OUTER JOIN itinerarybusiness ib 
          ON i.email = :email AND i.itinerary_id = ib.itinerary_id
          JOIN business b 
          ON ib.business_id = b.business_id
      ),
      
      oneItinBus AS (
          SELECT MAX(a.city) AS dest_city
          FROM allItinBus a
      ),
      
      allBus AS (
          SELECT b.name, b.stars, b.business_id, b.city
          FROM business b
          JOIN oneItinBus o
          ON b.city = o.dest_city
          WHERE b.categories LIKE '%Nightlife%'
          OR b.categories LIKE '%Bakeries%'
          OR b.categories LIKE '%Bars%'
          OR b.categories LIKE '%Lounges%'
          OR b.categories LIKE '%Breakfast and Brunch%'
          OR b.categories LIKE '%Recreation Centers%'
          OR b.categories LIKE '%Breweries%'
      )
      
      SELECT allBus.name, allBus.stars, allBus.business_id, allBus.city
      FROM allBus, allItinBus
      WHERE allBus.name NOT IN allItinBus.name
      AND allBus.stars = 5
      ORDER BY dbms_random.value
      )
    
    WHERE ROWNUM <= 1
  
  
  
  `;
  let email = req.params.email;
  const binds = [email];

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
  searchCityBusinessCat: searchCityBusinessCat,
  searchRecBusiness: searchRecBusiness
}