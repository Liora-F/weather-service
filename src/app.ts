import express from "express";
import * as weatherController from "./controllers/weatherController";
import mongoDbConnector from "./util/mongoDbConnector";

// Create Express server
const app = express();

// Connect to MongoDB
(async () => await mongoDbConnector())();

// Express configuration
app.set("port", process.env.PORT || 3000);

/**
 * Routes.
 */
app.get("/weather/data", weatherController.getWeatherData);
app.get("/weather/summarize", weatherController.getWeatherSummarize);

export default app;
