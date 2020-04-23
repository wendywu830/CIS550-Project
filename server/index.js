const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');
const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser('secret'));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/people is registered to the function
// routes.getAllPeople, specified in routes.js.
app.get('/people', routes.getAllCustomers);


app.get('/checklogin/:email/:password', routes.checkLogin)

app.post('/sign-up', routes.signUp);

app.get('/search/:city/:state/:stars', routes.searchCity);

/* ---- Part 2 (FindFriends) ---- */
// TODO: (2) - Add route '/friends/:login' for the functionality of FindFriends page 
// app.get('/friends/:login', routes.getFriends); // Hint: Replace () => {} with the appropriate route handler in routes.js.


app.listen(8082, () => {
	console.log(`Server listening on PORT 8080`);
});