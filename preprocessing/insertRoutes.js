//Initial attempt at insertion via oracledb

var oracledb = require('oracledb');
var credentials = require('./credentials.json');
var fs = require('fs');
var readline = require('readline');

fs.readFile('airlines.dat', 'utf8', function(err, data) {
	if (err) throw err;
	else {
		strings = data.split(/\r?\n/);
		var elts = [];
		strings.forEach(function(thing) {
			var elt = thing.split(',');
			if (elt.length == 8 &&
			 parseInt(elt[0]) && elt[0].length != 0 && elt[0] != 'N' && elt[0] != '\\N' &&
			 elt[1].length > 2 && elt[1] != 'N' && elt[1] != '\\N' && 
			 elt[1].charAt(0) == '"' && elt[1].charAt(elt[1].length - 1) == '"' &&
			 elt[6].length > 2 && elt[6] != 'N' && elt[6] != '\\N' &&
			 elt[6].charAt(0) == '"' && elt[6].charAt(elt[6].length - 1) == '"') {
			 	var str = 'SELECT ' + elt[0] + ', ' + elt[1].replace(/'/g,"''").replace(/"/g,"'") + ', ' + elt[6].replace(/'/g,"''").replace(/"/g,"'") + 'FROM dual';
				elts.push(str);
			}
		});
		var query = elts.join(' UNION ALL \n')
		oracledb.getConnection({
			user : credentials.user,
			password : credentials.password,
			connectString : credentials.connectString
		}, function(err, connection) {
			if (err) {
				console.log(err);
			} else {
				connection.execute(`INSERT INTO Airlines VALUES (airline_id, name, country) WITH vals AS (`
				+ `\n` + query + `\n` + 
				`) \n SELECT * FROM vals`, function(err, result) {
					if (err) {console.log(err);}
					else console.log(result);
				});
			}
		});
		/*
		counter = 0;
		value = [];
		values = [];
		elts.forEach(function(elt) {
			if (counter < 999) {
				value.push(elt);
				counter += 1;
			} else {
				value.push(elt);
				values.push(value);
				value = [];
				counter = 0;
			}
		});
		var strings = [];
		values.forEach(set => strings.push(set.join(', ')));
		var queries = [];
		strings.forEach(str => queries.push("INSERT INTO Airlines (airline_id, name, country) VALUES " + str));
		*/
		/*queries.forEach(function(query) {
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
						else console.log(result);
					});
				}
			});
		})*/
	}
});