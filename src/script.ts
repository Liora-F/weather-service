import {Weather, IWeather, WeatherDocument} from "./models/Weather";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import bluebird from "bluebird";

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});

// const test: IWeather = {
//     location: {type: "Point", coordinates: [-122.5,37.7]},
//     forecastTime : new Date(),
//     precipitation : 4.5,
//     temperature: 17.6

// };

// const loc = new Weather(test);

// Weather.findOne({
//     $nearSphere: {
//         $geometry: {
//            type: "Point" ,
//            coordinates: [ -122, 37 ]
//         }
//       }
// }).explain("queryPlanner").then(doc => console.log(doc)).catch(e => console.log(e));

// loc.save(function (err) {
//     if (err) console.log(err);});

