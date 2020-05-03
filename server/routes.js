
/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

var oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT; //all column names are UPPERCASE!
oracledb.autoCommit = true;
var credentials = require('./credentials.json');
var async = require('async');


/**************************************************************
 **********************  LOGIN / SIGNUP  ********************** 
 **************************************************************/

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


/**************************************************************
 *************************  Flights  ************************* 
 **************************************************************/
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

/**************************************************************
 ************************  BUSINESSES  ************************ 
 **************************************************************/


//Searches for businesses in given city, state, minstars
function searchCityBusiness(req, res) {
  var query = `
    SELECT *
    FROM business
    WHERE (city:city AND state=:st AND stars >= :stars)
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
  WHERE ROWNUM <= :count;
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



/**************************************************************
 *******************  BUSINESSES AND ROUTES  ******************* 
 **************************************************************/
//Names of all airports layover stops and its city and country given a source city and dest city

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


//Names of all airports layover stops and business in the city given a source city and dest city

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


//Names of all airports layover stops and business in the city given a source city and dest city and category of business (eg. Restaurant)

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

/**************************************************************
 *************************  ITINERARY  ************************* 
 **************************************************************/
//Get the Current Max Itinerary_ID, utilized before making an itinerary to increment
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
  console.log(biz_list)
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
  let itin_id = req.params.itin_id;
  let route_no = req.params.route_no;
  
  var query = `
  INSERT INTO itineraryflight(itinerary_id, route_id)
	VALUES(:itin_id, :route_no)
  
    `;
    const binds = [itin_id, route_no]
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
            console.log(result.rows)
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
      LEFT JOIN itinerarybusiness ib 
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


//Get all flights and flight src/dest given itinerary number
function getFlightFromItinByNum(req, res) {
    var query = `
      SELECT a1.name as Source_Name, a1.city as Source_City, a1.country as 
      Source_Country ,a2.name as Dest_Name, a2.city as Dest_City, a2.country as 
      Dest_Country
      FROM itineraryflight i
      JOIN routes r ON i.route_id = r.route_id
      JOIN airports a1 ON r.source_id = a1.id
      JOIN airports a2 ON r.target_id = a2.id
      WHERE i.itinerary_id = :id 
      ORDER BY Source_Name, Source_City, Source_Country, Dest_Name, Dest_City, Dest_Country
    
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
            console.log(result.rows)
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
    Source_Country ,a2.name as Dest_Name, a2.city as Dest_City, a2.country as 
    Dest_Country
    FROM itinerary i
    LEFT JOIN itineraryflight if
    ON i.email = :email AND i.itinerary_id=if.itinerary_id
    JOIN routes r ON if.route_id = r.route_id
    JOIN airports a1 ON r.source_id = a1.id
    JOIN airports a2 ON r.target_id = a2.id
    ORDER BY itinerary_name, Source_Name, Source_City, Source_Country, Dest_Name, Dest_City, Dest_Country
  
  
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

//Delete all businesses from given itinerary id (perform with next 2 queries)
function deleteAllItinBus(req, res) {
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
          res.json(result.rows)
        }
      });
    }
  });
}

/********************* DELETING FROM ITIN ***********************/
//Delete all flight from given itinerary id (perform with prev and next query)
function deleteAllItinFlights(req, res) {
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
          res.json(result.rows)
        }
      });
    }
  });
}

//Delete itinerary based on id (delete prev 2 queries first)
function deleteItinerary(req, res) {
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
}


//Delete one flight from itin given itin id and route id
function deleteOneFlight(req, res) {
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

//Delete one business from itin given itin id and business id
function deleteOneFlight(req, res) {
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
  addItinerary: addItinToCust,
  getCustItineraryNames: getCustItineraryNames,
  addBusToItin: addBusToItin,
  addFlightToItin: addFlightToItin,
  getBusFromItinByEmail: getBusFromItinByEmail,
  getFlightFromItinByEmail: getFlightFromItinByEmail,
  deleteItinerary: deleteItinerary
}