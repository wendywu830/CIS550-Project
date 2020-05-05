const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const express = require('express');
var userRoutes = require('./routes/userRoutes.js');
var flightRoutes = require('./routes/flightRoutes.js');
var businessRoutes = require('./routes/businessRoutes.js');
var itineraryRoutes = require('./routes/itineraryRoutes.js');
const cors = require('cors');
const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser('secret'));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

//User Routes
//TODO: Which of these do you want
app.get('/people', userRoutes.getAllCustomers);
app.get('/getAllCustomers', userRoutes.getAllCustomers);
app.get('/checklogin/:email/:password', userRoutes.checkLogin)
app.post('/sign-up', userRoutes.signUp);

//Business / BusinessRoutes 
app.get('/search/:city/:state/:stars', businessRoutes.searchCityBusiness);

//Flight routes
app.get('/searchLayoverCategoryBusiness/:source_city/:dest_city/:category', flightRoutes.searchLayoverCategoryBusiness);
app.get('/searchMysteryDest/:source_city', flightRoutes.searchMysteryDest);
app.get('/searchFoodDest/:source_city', flightRoutes.searchFoodDest);
app.get('/searchFlights/:source/:dest/:stops', flightRoutes.searchFlights);


//Itinerary Routes
app.get('/addItinerary/:email/:name', itineraryRoutes.addItinerary);
app.get('/getCustItineraryNames/:email', itineraryRoutes.getCustItineraryNames);
app.post('/addBusToItin', itineraryRoutes.addBusToItin);
app.post('/addFlightToItin', itineraryRoutes.addFlightToItin);
app.get('/getBusFromItinByEmail/:email', itineraryRoutes.getBusFromItinByEmail);
app.get('/getFlightFromItinByEmail/:email', itineraryRoutes.getFlightFromItinByEmail);
app.get('/deleteItinerary/:id', itineraryRoutes.deleteItinerary)

app.listen(8082, () => {
	console.log(`Server listening on PORT 8082`);
});