import mongoose from "mongoose";

interface IPoint {
  type: string,
  coordinates: [number, number]
}
export interface IWeather{
  location: IPoint,
  forecastTime: Date,
  temperature: number,
  precipitation: number,
}

type PointDocument = mongoose.Document & IPoint;
export type WeatherDocument = mongoose.Document & IWeather;


const pointSchema = new mongoose.Schema<PointDocument>({
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number], //[lon,lag]
      required: true
    }
  });

const WeatherSchema = new mongoose.Schema<WeatherDocument>(
    {
        location: {
            type: pointSchema,
            required: true,
            index: "2dsphere"
        },
        forecastTime: Date,
        temperature: Number,
        precipitation: Number,

    }
);


export const Weather = mongoose.model<WeatherDocument>("Weather2", WeatherSchema);

