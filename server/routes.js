
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

//Searchs for businesses in city
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
function flightAdd(req, res) {
  let itinerary = req.body.itinerary;
  let route = req.body.route;

  checkDuplicate (itinerary, function (isDuplicate) {
    if (isDuplicate !== null) {
      res.json({msg: "Duplicate"})
    } else {
      //actually inserting new record into DB
      var query = `
        INSERT INTO 
        ItineraryFlight (itinerary_id, route_id)
        VALUES (:i, :r)
      `;
      const binds = [itinerary, route]
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
              console.log(result.rowsAffected);
            }
          });
        }
      });
    }
  })
}

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
  getMaxItinID: getMaxItineraryID,
  addFlight: flightAdd
}