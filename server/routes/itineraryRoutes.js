/**
 * itineraryRoutes.js
 * Routes relevant to Itinerary Creation
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
//TODO: Documentation in these routes

/**************
 * Get Routes *
 **************/
/**
 * getMaxItineraryID
 * Get the Current Max Itinerary_ID, utilized before making an itinerary to increment
 * @callback
 */
function getMaxItineraryID(req, res, callback) {
  var query = `
    SELECT MAX(itinerary_id) as top
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
          callback(result.rows[0].TOP)
        }
      });
    }
  });
}

//Get Itineraries for customer given email
function getCustItineraryNames(req, res) {
  var query = `
    SELECT *
    FROM itinerary i
    WHERE i.email = :email
    ORDER BY i.itinerary_id DESC
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
          //console.log(result.rows)
          res.json(result.rows)
        }
      });
    }
  });
}

//Get all businesses and names given itinerary number
function getBusFromItinByNum(req, res) {
    var query = `
      SELECT *
      FROM itinerarybusiness i, business b
      WHERE i.itinerary_id = :id AND i.business_id = b.business_id
      ORDER BY  b.name
    `;
    let id = req.params.id;
    const binds = [id];
    console.log("getBusFromItinByNum")
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

//Get all itins and businesses given email
function getBusFromItinByEmail(req, res) {
    var query = `
      SELECT i.itinerary_id, i.name as itinerary_name, b.name as business_name
      FROM itinerary i
      LEFT OUTER JOIN itinerarybusiness ib 
      ON i.email = :email AND i.itinerary_id = ib.itinerary_id
      JOIN business b 
      ON ib.business_id = b.business_id
      ORDER BY i.name
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
            console.log(result)
            res.json(result.rows)
          }
        });
      }
    });
}

//Get all itins, flights and flight src/dest given email
function getFlightFromItinByEmail(req, res) {
  var query = `
  SELECT i.itinerary_id, i.name as itinerary_name, a1.name as Source_Name, 
  a1.city as Source_City, a1.country as 
  Source_Country, a2.name as Dest_Name, a2.city as Dest_City, a2.country as 
  Dest_Country, al.name
  FROM itinerary i
  LEFT OUTER JOIN itineraryflight if
  ON i.email = :email AND i.itinerary_id=if.itinerary_id
  JOIN routes r ON if.route_id = r.route_id
  JOIN airports a1 ON r.source_id = a1.id
  JOIN airports a2 ON r.target_id = a2.id  
  JOIN airlines al ON r.airline_id = al.airline_id
  
  
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
          console.log(result)
          res.json(result.rows)
        }
      });
    }
  });
}

/**************
 * Add Routes *
 **************/
//Add Itinerary to Customer (integrated new intin id into this query)
function addItinToCust(req, res) {
  //actually inserting new record into DB
  getMaxItineraryID(req, res, function (top) {
    var query = `
      INSERT INTO 
      Itinerary (itinerary_id, email, name) 
      VALUES (:t, :email, :name)
    `;
    let inputEmail = req.params.email;
    let name = req.params.name;

    const binds = [top + 1, inputEmail, name]
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
            console.log(binds);
            console.log(result)
            res.json(result)
          }
        });
      }
    });
  })
 
  }

//Add Business to Itinerary_Business 
function addBusToItin(req, res) {
  var itin_id = req.body.itin_id;
  let biz_list = req.body.list;
  //console.log(biz_list)
  async.forEach(biz_list, function(biz_id, xcallback) { // A
    var query = `
    INSERT INTO 
    itinerarybusiness (itinerary_id, business_id)
    VALUES (:itin_id, :bus_id)
    `;
    const binds = [itin_id, biz_id]
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
            console.log(result)
            xcallback();
          }
        });
      }
    });
    
  }, function() {
    res.json({"status": "success"})
  });
  
 
  }

//Add Flight to Itinerary_Flight 
function addFlightToItin(req, res) {
  let itin_id = req.body.itin_id;
  let route_list = req.body.route_list;
  async.forEach(route_list, function(route_no, xcallback) { 
    console.log("inside routes addFlightToItin")

    var query = `
    INSERT INTO 
    itineraryflight (itinerary_id, route_id)
    VALUES (:itin_id, :route_no)
    `;
    const binds = [itin_id, route_no]
    console.log(binds)
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
            console.log("added flight")
            console.log(result)
            xcallback();
          }
        });
      }
    });
  }, function() {
    res.json({"status": "success"})
  });
}

/*****************
 * Delete Routes *
 *****************/
//Delete itinerary based on id (delete prev 2 queries first)
function deleteItinerary(req, res) {
  deleteAllItinFlights(req, res, function () {
    deleteAllItinBus(req, res, function () {
      var query = `
        DELETE FROM itinerary
        WHERE itinerary_id = :id
      `;
      let id = req.params.id;
      const binds = [id];
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
              console.log(result)
              res.json(result.rows)
            }
          });
        }
      });
    }) 
  }) 
}

//Delete all flight from given itinerary id (perform with prev and next query)
function deleteAllItinFlights(req, res, next) {
  var query = `
    DELETE FROM itineraryflight
    WHERE itinerary_id = :id
  `;
  let id = req.params.id;
  const binds = [id];

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
          console.log(result)
          next()
        }
      });
    }
  });
}

//Delete one flight from itin given itin id and route id
function deleteOneFlight(req, res, next) {
  var query = `
    DELETE FROM itineraryflight
    WHERE itinerary_id = :i_id
    AND route_id = :r_id
  `;
  let i_id = req.params.i_id;
  let r_id = req.params.r_id;
  const binds = [i_id, r_id];

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
          console.log(result)
          res.json(result.rows)
        }
      });
    }
  });
}

//Delete all businesses from given itinerary id (perform with next 2 queries)
function deleteAllItinBus(req, res, next) {
  var query = `
    DELETE FROM itinerarybusiness
    WHERE itinerary_id = :id
  `;
  let id = req.params.id;
  const binds = [id];

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
          console.log(result)
          next()
        }
      });
    }
  });
}

//Delete one business from itin given itin id and business id
function deleteOneBusiness(req, res) {
  var query = `
    DELETE FROM itinerarybusiness
    WHERE itinerary_id = :i_id
    AND business_id = :b_id
  `;
  let i_id = req.params.i_id;
  let b_id = req.params.b_id;
  const binds = [i_id, b_id];

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
          console.log(result)
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
  addItinerary: addItinToCust,
  getCustItineraryNames: getCustItineraryNames,
  addBusToItin: addBusToItin,
  addFlightToItin: addFlightToItin,
  getBusFromItinByEmail: getBusFromItinByEmail,
  getFlightFromItinByEmail: getFlightFromItinByEmail,
  deleteItinerary: deleteItinerary
}