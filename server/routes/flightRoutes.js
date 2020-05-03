/**
 * flightRoutes.js
 * Routes relevant to Flight tables and Airport, Airline, and Route data
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
 * searchFlightExists
 * Given source and destination city, search if flight exists and return route id and airline name
 * @param source 
 * @param dest
 */
//given source and destination city, search if flight exists and return route id and airline name
 function searchFlightExists(req, res) {
  var query = `
  SELECT r.route_id, r.source_id, a1.name, r.target_id, a2.name, r.airline_id, al.name AS airline_name
  FROM Routes r 
  JOIN Airports a1
  ON r.source_id = a1.id 
  JOIN Airports a2
  ON r.target_id = a2.id
  JOIN Airlines al
  ON r.airline_id = al.airline_id
  WHERE a1.city = :source
  AND a2.city = :dest
  `;
  let source = req.params.source
  let dest = req.params.dest

  const binds = [source, dest]
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

/*****************
* Complex Routes *
******************/
/**
 * searchLayoverLocations
 * Names of all airports layover stops and its city and country given a source city and dest city
 * @param source_city Source City
 * @param dest_city Destination City
 */
function searchLayoverLocations(req, res) {
  var query = `
  WITH source AS (
    SELECT a2.name AS layover_airport, a2.city AS layover_city, a2.country AS layover_country, a1.city AS source
    FROM Routes r 
    JOIN Airports a1
    ON r.source_id = a1.id 
    JOIN Airports a2
    ON r.target_id = a2.id
    WHERE a1.city = :source_city
    ),

    dest AS (
    SELECT a1.name AS layover_airport, a2.city AS dest
    FROM Routes r 
    JOIN Airports a1
    ON r.source_id = a1.id 
    JOIN Airports a2
    ON r.target_id = a2.id
    WHERE a2.city = :dest_city
    )

    SELECT source.source, source.layover_airport, source.layover_city, source.layover_country, dest.dest
    FROM source JOIN dest 
    ON source.layover_airport = dest.layover_airport
    GROUP BY layover_airport;

    
  `;
  let source_city = req.params.source_city;
  let dest_city = req.params.dest_city;
  const binds = [source_city, dest_city];

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
 * searchLayoverBusinesses
 * Names of all airports layover stops and business in the city given a source city and dest city
 * @param source_city Source City
 * @param dest_city Destination City
 */
function searchLayoverBusinesses(req, res) {
  var query = `
  WITH source AS (
    SELECT a2.name AS layover_airport, a2.city AS layover_city, a2.country AS layover_country, a1.city AS source
    FROM Routes r 
    JOIN Airports a1
    ON r.source_id = a1.id 
    JOIN Airports a2
    ON r.target_id = a2.id
    WHERE a1.city = :source_city
    ),

    dest AS (
    SELECT a1.name AS layover_airport, a2.city AS dest
    FROM Routes r 
    JOIN Airports a1
    ON r.source_id = a1.id 
    JOIN Airports a2
    ON r.target_id = a2.id
    WHERE a2.city = :dest_city
    )

    SELECT source.layover_airport, source.layover_city, 
    source.layover_country, b.name as name
    FROM source JOIN dest 
    ON source.layover_airport = dest.layover_airport
    JOIN business b
    ON source.layover_city = b.city
    GROUP BY source.layover_airport, source.layover_city, 
    source.layover_country, name
    ORDER BY source.layover_city, source.layover_airport;
    
  `;
  let source_city = req.params.source_city;
  let dest_city = req.params.dest_city;
  const binds = [source_city, dest_city];

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
 * searchLayoverCat
 * Names of all airports layover stops and business in the city given 
 * a source city, dest city, and category of business (eg. Restaurant)
 * @param source_city Source City
 * @param dest_city Destination City
 * @param category Category of Business
 */
function searchLayoverCat(req, res) {
  var query = `
  WITH source AS (
    SELECT a2.name AS layover_airport, a2.city AS layover_city, a2.country AS layover_country, a1.city AS source
    FROM Routes r 
    JOIN Airports a1
    ON r.source_id = a1.id 
    JOIN Airports a2
    ON r.target_id = a2.id
    WHERE a1.city = :source_city
    ),

    dest AS (
    SELECT a1.name AS layover_airport, a2.city AS dest
    FROM Routes r 
    JOIN Airports a1
    ON r.source_id = a1.id 
    JOIN Airports a2
    ON r.target_id = a2.id
    WHERE a2.city = :dest_city
    )

    SELECT source.layover_airport, source.layover_city, 
    source.layover_country, b.name as name
    FROM source JOIN dest 
    ON source.layover_airport = dest.layover_airport
    JOIN business b
    ON source.layover_city = b.city
    WHERE b.categories LIKE '%=:category%'
    GROUP BY source.layover_airport, source.layover_city, 
    source.layover_country, name
    ORDER BY source.layover_city, source.layover_airport;
  `;
  let source_city = req.params.source_city;
  let dest_city = req.params.dest_city;
  let category = req.params.category;
  const binds = [source_city, dest_city, category];

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
	searchLayoverCat: searchLayoverCat
}