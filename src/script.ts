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
//     location: {type: "Point", coordinates: [-120.0,35.0]},
//     forecastTime : new Date(),
//     precipitation : 6.5,
//     temperature: 7.6
// };

// const loc = new Weather(test);

// const res =  Weather.where("location").near({
//     center: {
//         type: "Point",
//         coordinates: [-122, 37]
//     }
// }).then(doc => console.log(JSON.stringify(doc))).catch(e => console.log(e));



// loc.save(function (err) {
//     if (err) console.log(err);});

