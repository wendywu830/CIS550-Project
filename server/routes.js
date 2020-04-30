
/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; //all column names are UPPERCASE!
oracledb.autoCommit = true;
var credentials = require('./credentials.json');

//Checks if an account with the email already exists
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

//Creates a user account if the email is not already registered
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
            res.cookie('user', req.body.email, { signed: true, httpOnly: true });
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

//Searches for businesses in given city, state, minstars
function searchCityBusiness(req, res) {
  var query = `
    SELECT *
    FROM Business
    WHERE (city=:city AND state=:st AND stars >= :stars)
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

//Searchs for top x most popular businesses in given city
//this is like the previous one so not sure if needed?
//can hardcode count too if we want
function searchBusinessOnlyByCity(req, res) {
  var query = `
  SELECT * 
  FROM
    (SELECT b.name
    FROM BUSINESS b
    WHERE b.city=:city
    ORDER BY b.stars DESC)
  WHERE ROWNUM <= :=count;
  `;
  let city = req.params.city;
  let count = req.params.count;
  const binds = [city, count];

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


//Searches for all the businesses of a particular category (attraction, restaurant, etc) with an average rating higher than x stars in a specific state
//not sure if im doing the LIKE part correctly with a variable?
function searchBusinessByCat(req, res) {
  var query = `
    SELECT business_id, name
    FROM business
    WHERE state = :state
    AND stars >= :count
    AND categories LIKE '%:cat%'
  `;
  let state = req.params.state;
  let count = req.params.count;
  let cat = req.params.cat;
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

//Names of all airports layover stops and its city and country given a source city and dest city

function searchBusinessByCat(req, res) {
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



//Add Itinerary to Account


//Get Itineraries for account


//Get the Current Max Itinerary_ID, utilized before making an itinerary to increment
function getMaxItineraryID(req, res) {
  var query = `
    SELECT MAX(Itinerary_ID) as top
    FROM Itinerary
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
          console.log(result.rows);
        }
      });
    }
  });
}

//Add Flight to itinerary


//Add Business to itinerary


//Get Everything from itinerary

/****************
* TEMP QUERYING *
*****************/

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


module.exports = {
  getAllCustomers: getAllCustomers,
  checkLogin: checkLogin,
  signUp: signUp,
  searchCityBusiness: searchCityBusiness,
  getMaxItinID: getMaxItineraryID
}