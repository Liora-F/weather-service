import Weather, { IWeather, WeatherDocument } from "./models/Weather";
import mongoDbConnect from "./util/mongoDbConnector";
import * as fs from "fs";
import * as fastCsv from "fast-csv";
import * as path from "path";
import convert from "convert-units";

type WeatherRow = {
  Longitude: number;
  Latitude: number;
  forecast_time: Date;
  "Temperature Celsius": number;
  "Precipitation Rate mm/hr": number;
  "Precipitation Rate in/hr": number;
};

(async function startScript() {
  await mongoDbConnect();
  uploadCsvFilesToDB();
})();

function uploadCsvFilesToDB() {
  const filepaths = getCsvFilePaths();

  filepaths.forEach((filepath) => {
    loadToDB(filepath);
  });
}

function getCsvFilePaths() {
  return fs
    .readdirSync("data")
    .filter((name) => name.endsWith(".csv"))
    .map((name) => path.resolve("data", name));
}

async function loadToDB(filePath: string) {
  let buffer: WeatherDocument[] = [];
  let counter = 0;

  const flushBufferToDB = async () => {
    if (buffer.length == 0) return;

    try {
      await Weather.insertMany(buffer);
    } catch (error) {
      readStream.destroy(error);
      console.log(error);
    } finally {
      buffer = [];
    }
  };

  let csvParseStream = createCsvParseStream();
  let readStream = fs.createReadStream(filePath).pipe(csvParseStream);

  for await (const data of readStream) {
    buffer.push(data);
    counter++;
    if (counter % 10000 == 0) {
      await flushBufferToDB();
    }
  }
  await flushBufferToDB();
}

function createCsvParseStream() {
  return fastCsv
    .parse<WeatherRow, IWeather>({ headers: true })
    .transform(
      (data: WeatherRow): IWeather => ({
        location: {
          type: "Point",
          coordinates: [data.Longitude, data.Latitude],
        },
        forecastTime: data.forecast_time,
        temperature: data["Temperature Celsius"],
        precipitation:
          data["Precipitation Rate mm/hr"] ??
          convert(data["Precipitation Rate in/hr"]).from("in").to("mm"),
      })
    )
    .on("error", (error) => console.error(error))
    .on("end", (rowCount: number) => console.log(`Parsed ${rowCount} rows`));
}
