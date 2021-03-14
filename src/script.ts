import {Weather, IWeather, WeatherDocument} from "./models/Weather";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import bluebird from "bluebird";
import * as fs from 'fs';
import * as fastCsv from 'fast-csv';
import * as path from 'path';

// Connect to MongoDB
const mongoUrl = MONGODB_URI;

mongoose.Promise = bluebird;

mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});



const filenames = fs.readdirSync("data")

filenames.forEach(function(filename) {
    if(filename.endsWith('.csv')){
        let _path = path.resolve("data", filename);
        console.log(_path);

        csvToDB(_path);          
    }
});



async function csvToDB(filePath: string){

    type WeatherRow = {
        'Longitude': number,
        'Latitude' : number,
        'forecast_time' : Date,
        'Temperature Celsius' : number,
        'Precipitation Rate mm/hr' : number
    };

        let buffer : any = [],
        counter = 0;

        try {  
    
        await new Promise((resolve,reject) => {

            const csvStream = fastCsv.parse<WeatherRow, IWeather>({ headers: true })
            .transform(
                (data: WeatherRow): IWeather => ({
    
                    location : {type: 'Point', coordinates: [data.Longitude, data.Latitude]},
                    forecastTime : data.forecast_time,
                    temperature : data["Temperature Celsius"],
                    precipitation :  data["Precipitation Rate mm/hr"]
                }),
            )
            .on('error', error => console.error(error))
            .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
    
            let stream = fs.createReadStream(filePath)
            .pipe(csvStream)
            .on("error", reject)
            .on("data", async doc => {
                stream.pause();
                buffer.push(doc);
                counter++;
                try {
                    if ( counter > 10000 ) {
                        await Weather.insertMany(buffer);
                        buffer = [];
                        counter = 0;
                        console.log(`inserted chunk ${filePath}`);
                    }
                } catch(e) {
                    stream.destroy(e);
                }
    
                stream.resume();
    
            })
            .on("end", async () => {
                try {
                    if ( counter > 0 ) {
                        await Weather.insertMany(buffer);
                        buffer = [];
                        counter = 0;
                        resolve("");
                    }
                } catch(e) {
                    stream.destroy(e);
                }
            });
    
        });
    
    
        } catch(e) {
            console.error(e)
        } finally {
            console.log(`finished ${filePath}`);
            // process.exit()
        }
}




