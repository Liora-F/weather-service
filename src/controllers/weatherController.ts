import { Request, Response } from "express";
import WeatherService from "../Services/weatherService";

/**
 * @route GET /weather/data
 */
export const getWeatherData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const coordinates = getCoordinatesFromRequest(req);
    const ans = await WeatherService.getWeatherData(coordinates);
    res.send(ans);
  } catch (error) {
    res.send(error.message);
  }
};

/**
 * @route GET /weather/summarize
 */
export const getWeatherSummarize = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const coordinates = getCoordinatesFromRequest(req);
    const ans = await WeatherService.getWeatherSummarize(coordinates);
    res.send(ans);
  } catch (error) {
    res.send(error.message);
  }
};

function getCoordinatesFromRequest(req: Request): number[] {
  const lat = parseFloat(req.query.lat?.toString());
  const lon = parseFloat(req.query.lon?.toString());

  if (!assertValidCoordinates(lat, lon)) {
    throw new Error("error in parameters, 'lat' and 'lon' should be numbers respectively in range [-90,90] and [-180,180]");
  }
  return [lon, lat];
}

function assertValidCoordinates(lat: number, lon:number): boolean{
    return -90<=lat && lat<=90 && -180<=lon && lon<=180;
}
