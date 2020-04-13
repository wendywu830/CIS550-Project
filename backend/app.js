var oracledb = require('oracledb');
var credentials = require('./credentials.json');

oracledb.getConnection({
	user : credentials.user,
	password : credentials.password,
	connectString : credentials.connectString
}, function(err, connection) {
	if (err) {
		console.log(err);
	} else {
		connection.execute("SELECT * FROM Customer", function(err, result) {
			if (err) {console.log(err);}
			else console.log(result.rows);
		});
	}
});