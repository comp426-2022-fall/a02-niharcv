#!/usr/bin/env node

// check for -h flag

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from "node-fetch";


const args = minimist(process.argv.slice(2));

if (args.h) {
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -t TIME_ZONE\n    -h            Show this help message and exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        Longitude: E positive; W negative.\n    -t            Time zone: uses tz.guess() from moment-timezone by default.\n    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n    -j            Echo pretty JSON from open-meteo API and exit.');
    process.exit(0);
}

var timezone = moment.tz.guess();
var lat;
var long;

if(args.n) { lat = args.n; }
if(args.s) { lat = args.s * -1; }
if(args.e) { long = args.e; }
if(args.w) { long = args.w * -1; }
if(args.t) { timezone = args.t; }
timezone.replace("/", "%2");

var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + String(lat) + '&longitude=' + String(long) + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone;
const response = await fetch(url);
const data = await response.json();

if(args.j) {
    console.log(data);
    process.exit(0);
}

const days = args.d 

if (days == 0) {
  console.log("Today's expected precipitation hours are " + data.daily.precipitation_hours[0])
} else if (days > 1) {
  console.log("In " + days + " days the expected precipitation hours are " + data.daily.precipitation_hours[days]);
} else {
  console.log("Tomorrow's precipitation hours are " + data.daily.precipitation_hours[1])
}

process.exit(0);


