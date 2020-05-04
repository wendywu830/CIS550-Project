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
 function searchFlights(req, res) {
  var query = `
  SELECT r.route_id AS route_id,
  r.stops AS stops, a1.name AS source_airport, a2.name AS dest_airport, 
  al.name AS airline_name
  FROM Routes r 
  JOIN Airports a1
  ON r.source_id = a1.id 
  JOIN Airports a2
  ON r.target_id = a2.id
  JOIN Airlines al
  ON r.airline_id = al.airline_id
  WHERE a1.city = :source
  AND a2.city = :dest AND r.stops = :stops
  `;
  let source = req.params.source
  let dest = req.params.dest
  let stops = req.params.stops

  const binds = [source, dest, stops]
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
          //console.log(result.rows)
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
    ORDER BY source.layover_city, source.layover_airport
    
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
    ),

    biz AS (
      SELECT name, city, stars, business_id
      FROM business b
      WHERE b.categories LIKE :category AND stars = :n
    )

    SELECT DISTINCT source.layover_airport, source.layover_city, 
    source.layover_country, b.name as name, b.stars as stars, b.business_id as b_id
    FROM source JOIN dest 
    ON source.layover_airport = dest.layover_airport
    JOIN biz b
    ON source.layover_city = b.city
    WHERE ROWNUM <= :lim
    ORDER BY source.layover_city, source.layover_airport
  `;
  let source_city = req.params.source_city;
  let dest_city = req.params.dest_city;
  let category = "%" + req.params.category + "%";
  const binds = [source_city, dest_city, category, 5, 20];

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
 * searchFoodDest
 * search best states and country to go to for foodies with direct flight to 
 * dest from src
 * states and country of dest and the number of businesses there with label 
 * restaurant or food with stats >= 3
 * @param source_city Source City
 */
function searchFoodDest(req, res) {
  var query = `
    WITH 

    srcID AS (
    SELECT id
    FROM airports
    WHERE city = :source_city),
    
    srcRoutes AS (
    SELECT routes.target_id
    FROM srcID
    JOIN routes
    ON routes.source_id = srcID.id
    ),
    
    allRoutes AS
    (SELECT dest.country, dest.lat, dest.lon
    FROM srcRoutes r
    JOIN airports dest
    ON r.target_id = dest.id),
    
    busCity AS 
    (SELECT city as bc_city, state, lat, lon, business_id
    FROM business
    WHERE categories LIKE '%Restaurants%'
    OR categories LIKE '%Food%'
    AND stars >= 4),
    
    busState AS 
    (SELECT state, COUNT(business_id) as numBusinesses
    FROM busCity
    GROUP BY state),
    
    res AS
    (SELECT busCity.bc_city, busCity.state, busState.numBusinesses, allRoutes.country
    FROM allRoutes
    JOIN busCity
    ON (allRoutes.lat = busCity.lat AND allRoutes.lon = busCity.lon)
    JOIN busState
    ON busCity.state = busState.state
    WHERE numBusinesses > 50
    ORDER BY numBusinesses DESC)
    
    SELECT DISTINCT(res.state), res.numBusinesses, res.country
    FROM res
    ORDER BY numBusinesses DESC
  
  `;
  let source_city = req.params.source_city;
  const binds = [source_city];

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
 * searchMysteryDest
 * search 5 best businesses, states and country to go from src
 * algo uses best travel categories and finds the number of businesses 
 * in each state- the businesses have stars >= 4 and each given suggestion 
 * state has at least 50 of these fun businesses
 * there also exists a direct flight from source to these destinations
 * randomly sorts the results and picks top 5
 * @param source_city Source City
 */
function searchMysteryDest(req, res) {
  var query = `
    SELECT * FROM

      (WITH 
      
      airpSrc AS
      (SELECT ap.id
      FROM airports ap
      WHERE ap.city = :source_city
      ),
      
      srcRoutes AS (
      SELECT routes.target_id
      FROM airpSrc
      JOIN routes
      ON routes.source_id = airpSrc.id
      ),
      
      allRoutes AS
      (SELECT dest.country, dest.lat, dest.lon
      FROM srcRoutes r
      JOIN airports dest
      ON r.target_id = dest.id),
      
      bus AS
      (SELECT b.name, b.city, b.state, b.lat, b.lon, b.business_id, b.stars, allRoutes.country
      FROM allRoutes
      JOIN business b
      ON (allRoutes.lat = b.lat AND allRoutes.lon = b.lon)
      WHERE b.categories LIKE '%Nightlife%'
      OR b.categories LIKE '%Beauty and Spas%'
      OR b.categories LIKE '%Bakeries%'
      OR b.categories LIKE '%Bars%'
      OR b.categories LIKE '%Lounges%'
      OR b.categories LIKE '%Active Life%'
      OR b.categories LIKE '%Breakfast and Brunch%'
      OR b.categories LIKE '%Recreation Centers%'
      OR b.categories LIKE '%Breweries%'
      OR b.categories LIKE '%Shopping%'
      AND b.stars >= 4),
      
      groupState AS
      (SELECT state, COUNT(business_id) as count
      FROM bus
      GROUP BY state),
      
      allTab AS
      (SELECT bus.city, groupState.state, bus.name, groupState.count, bus.country
      FROM groupState
      JOIN bus
      ON bus.state = groupState.state
      WHERE count > 50
      )
    
    SELECT DISTINCT(allTab.state), allTab.country, allTab.name, allTab.count
    FROM allTab
    ORDER BY dbms_random.value)
    
    WHERE ROWNUM <= 5
  
  `;
  let source_city = req.params.source_city;
  const binds = [source_city];

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
	searchLayoverCat: searchLayoverCat,
  searchFlights: searchFlights
}