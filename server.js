'use strict';

// Load Environment Variables from the .env file

require('dotenv').config();


// Application Dependencies

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');


// Application Setup

const app = express();
app.use(cors());
const PORT = process.env.PORT


// Incoming API Routes

app.get('/location', searchToLatLong);
app.get('/weather', getWeather);
app.get('/event', getEvent);

// for later expansion

// app.get('/review, getReview');
// app.get('/meetup, getMeetup');
// app.get('/movie, getMovie');


// Make sure the server is listening for requests

app.listen(PORT, () => console.log(`City Explorer is up on ${PORT}`));


// Helper Functions

// accesses google maps - working

function searchToLatLong(request, response) {
  // Define the URL for the GEOCODE  API
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODE_API_KEY}`;
  // console.log(url);

  superagent.get(url)
    .then(result => {
      // console.log(result.body.results[0]);
      const location = new Location(request.query.data, result);
      response.send(location);
    })
    .catch(err => handleError(err, response));
}

function Location(query, res) {
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}


// accesses Darksky - working

function getWeather(request, response) {
  // Define the URL for the DARKSKY API
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
  // console.log(url);

  superagent.get(url)
    .then(result => {
      // console.log(result.body);
      const weatherSummaries = result.body.daily.data.map(day => new Weather(day));
      response.send(weatherSummaries);
    })
    .catch(err => handleError(err, response));
}

function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}


// accesses Eventbrite

function getEvent(request, response) {
  const url = `https://www.eventbriteapi.com/v3/events/search/?token=${EVENTBRITE_API_KEY}`

  superagent.get(url)
  .then(result => {
    const eventSummaries = 
    response.send(eventSummaries);
  })
  .catch(err => handleError(err, response));
}

function Event() {

}


// for later expansion

// accesses movie database

// function getMovie(request, response) {
//   const url = 
  
//   superagent.get(url)
//     .then(result => {
//       const movieSummaries = 
//       response.send(moviesummaries);
//     })
//     .catch(err => handleError(err, response));
// }

// function Movie() {

// }


// accesses Yelp

// function getReview(request, response) {
//   const url = 

//   superagent.get(url)
//     .then(result => {
//       // console.log(result.body);
//       const yelpReviews = 
//       response.send(yelpReviews);
//     })
//     .catch(err => handleError(err, response));
  
// }
  
// function Review() {

// }


// accesses Meetup

// function getMeetup(request, response) {
//   const url = 

//   superagent.get(url)
//     .then(result => {
//       const meetupEvents = 
//       response.send(meetupEvents);
//     })
//     .catch(err => handleError(err, response));

// }

// function Meetup() {

// }


// Error Handler

function handleError(err, response) {
  console.error(err);
  if (response) response.status(500).send('Sorry something went wrong');
}

