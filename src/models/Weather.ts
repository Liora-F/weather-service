import mongoose, { Document, Schema } from "mongoose";
var Float = require("mongoose-float").loadType(mongoose, 2);

interface IPoint {
  type: string;
  coordinates: [number, number];
}
export interface IWeather {
  location: IPoint;
  forecastTime: Date;
  temperature: number;
  precipitation: number;
}

export type WeatherDocument = Document & IWeather;

const pointSchema = new Schema<Document & IPoint>({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const WeatherSchema = new Schema<WeatherDocument>({
  location: {
    type: pointSchema,
    required: true,
    index: "2dsphere",
  },
  forecastTime: Date,
  temperature: Float,
  precipitation: Float,
});

export default mongoose.model<WeatherDocument>("Weather", WeatherSchema);
