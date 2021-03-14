import { Request, Response } from "express";
import { Weather } from "../models/Weather";


/**
 * @route GET /weather/data
 */
export const getWeatherData = async (req: Request, res: Response): Promise<void> => {

    const lon = parseFloat(req.query.lon.toString())
    const lat = parseFloat(req.query.lat.toString())

    const weatherData = await Weather.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [ lon, lat ] },
                distanceField: "calculatedDistance",
            }
        }
    ])
    .limit(100)
    .project({
        _id:0,
        precipitation: 1,
        temperature : 1,
        forecastTime : 1,
        calculatedDistance: 1
    })
    .group({  
        _id : "$calculatedDistance", 
        weather: { $addToSet: "$$ROOT" },
        averageTemp: { $avg: "$temperature" },
        averagePrecipitation: { $avg: "$precipitation" },
        maxTemp: { $max: "$temperature" },
        maxPrecipitation: { $max: "$precipitation" },
        minTemp: { $min: "$temperature" },
        minPrecipitation: { $min: "$precipitation" }
    })
    .sort({ _id : 1 })
    .limit(1)
    .project({"weather.calculatedDistance" : 0});

//TODO: sort by time?
//TODO: fix headers? percipation by rate

    res.send(weatherData[0]);

};

/**
 * @route GET /weather/summarize
 */
export const getWeatherSummarize = async(req: Request, res: Response): Promise<void> => {
    const lon = parseFloat(req.query.lon.toString())
    const lat = parseFloat(req.query.lat.toString())

    
    const summarizeData = await Weather.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [ lon, lat ] },
                distanceField: "calculatedDistance",
            }
        }
    ])
    .limit(100)
    .project({
        _id:0,
        precipitation: 1,
        temperature : 1,
        forecastTime : 1,
        calculatedDistance: 1
    })
    .group({  
        _id : "$calculatedDistance", 
        averageTemperature: { $avg: "$temperature" },
        averagePrecipitation: { $avg: "$precipitation" },
        maxTemperature: { $max: "$temperature" },
        maxPrecipitation: { $max: "$precipitation" },
        minTemperature: { $min: "$temperature" },
        minPrecipitation: { $min: "$precipitation" }
    })
    .sort({ _id : 1 })
    .limit(1);

    const summarizeAns = {
        max: {
            temperature: summarizeData[0].maxTemperature,
            precipitation: summarizeData[0].maxPrecipitation
        },
        min: {
            temperature: summarizeData[0].minTemperature,
            precipitation: summarizeData[0].minPrecipitation
        },
        avg: {
            temperature: summarizeData[0].averageTemperature,
            precipitation: summarizeData[0].averagePrecipitation
        }
    }

    res.send(summarizeAns);
    
};
