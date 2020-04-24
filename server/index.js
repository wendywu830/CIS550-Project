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

app.get('/people', routes.getAllCustomers);

app.get('/checklogin/:email/:password', routes.checkLogin)

app.post('/sign-up', routes.signUp);

app.get('/search/:city/:state/:stars', routes.searchCityBusiness);

app.get('/maxItin', routes.getMaxItinID);


app.listen(8082, () => {
	console.log(`Server listening on PORT 8082`);
});