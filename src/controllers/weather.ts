import { Request, Response } from "express";
import { Weather } from "../models/Weather";


/**
 * @route GET /weather/data
 */
export const getWeatherData = async (req: Request, res: Response): Promise<void> => {
    let {lat , lon} = req.query; 

    const nearestLoc = await Weather.where("location").near({
            center: {
                type: "Point",
                coordinates: [parseFloat(lon.toString()), parseFloat(lat.toString())]
            }, maxDistance: 5*10000}).then(doc => {
                return doc[0]?.location;
            }).catch(e => console.log(e));
    
    if(nearestLoc){
        const weatherDoc = await Weather.where("location.coordinates").equals(nearestLoc.coordinates).catch(e => console.log(e));
        res.send(weatherDoc);
    }else{
        res.send("");
    }
};

/**
 * @route GET /weather/summarize
 */
export const getWeatherSummarize = (req: Request, res: Response): void => {
   
};
