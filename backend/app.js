var oracledb = require('oracledb');
var credentials = require('./credentials.json');

oracledb.getConnection({
	user : credentials.user,
	password : credentials.password,
	connectString : credentials.connectString
}, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Connected to database.')
	}
});