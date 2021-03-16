import { Aggregate } from "mongoose";
import Weather from "../models/Weather";

export default class WeatherService {
  static async getWeatherData(coordinates: number[]) {
    return WeatherService.getNearestPointWeatherAggregation(coordinates)
      .project({
        _id: 0,
        "weather.precipitation": 1,
        "weather.temperature": 1,
        "weather.forecastTime": 1,
      })
      .unwind({ path: "$weather" })
      .replaceRoot("$weather")
      .sort("forecastTime");
  }

  static async getWeatherSummarize(coordinates: number[]) {
    const [result] = await WeatherService.getNearestPointWeatherAggregation(
      coordinates
    )
      .addFields(this.buildSummaryFieldsClause())
      .project("-_id min max avg");

    return result;
  }

  private static getNearestPointWeatherAggregation(coordinates: number[]): Aggregate<any[]>{
    return Weather.aggregate([WeatherService.buildGeoNearClause(coordinates)])
      .limit(100)
      .group({
        _id: "$calculatedDistance",
        weather: { $addToSet: "$$ROOT" },
      })
      .sort({ _id: 1 })
      .limit(1);
  }

  private static buildGeoNearClause(coordinates: number[]): any {
    return {
      $geoNear: {
        near: { type: "Point", coordinates },
        distanceField: "calculatedDistance",
      },
    };
  }

  private static buildSummaryFieldsClause(): any {
    return {
      max: {
        temperature: { $max: "$weather.temperature" },
        precipitation: { $max: "$weather.precipitation" },
      },
      min: {
        temperature: { $min: "$weather.temperature" },
        precipitation: { $min: "$weather.precipitation" },
      },
      avg: {
        temperature: { $round: [{ $avg: "$weather.temperature" }, 2] },
        precipitation: { $round: [{ $avg: "$weather.precipitation" }, 2] },
      },
    };
  }
}
