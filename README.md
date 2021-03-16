# weather-service

A simple weather service that give you a weather forcast for a specific location.

### Setup development environment:

#### Connect to mongoDB:

Add .env file to the root folder and add the following environment variable:
```
MONGODB_URI=<your_connection_string>
```
> where *<your_connection_string>* is your mongoDB connection string

#### Upload CSV files:

This service provides a script to upload data from CSV files to the DB:

Add a folder named 'Data' to the root folder and place the CSV files there. 

##### SCV files accepded headers are:
```
Longitude,Latitude,forecast_time,Temperature Celsius,Precipitation Rate mm/hr 
```
OR
```
Longitude,Latitude,forecast_time,Temperature Celsius,Precipitation Rate in/hr
```
> values are required for all columns

#### Scripts
##### Build 
`npm run build`

##### Run data population script
`npm run populate-db`

##### Run the server
 `npm run start`
 
##### Build and run server in watch mode
`npm run watch`
 


## API Exapmles

`GET: /weather/data?lon=150&lat=80`

response example:
```JSON
[
  {
    "forecastTime": "2021-04-02T10:00:00.000Z",
    "temperature": -0.8,
    "precipitation": 19.2
  },
  {
    "forecastTime": "2021-04-02T11:00:00.000Z",
    "temperature": 17,
    "precipitation": 11.9
  },
  {
    "forecastTime": "2021-04-02T12:00:00.000Z",
    "temperature": 39.3,
    "precipitation": 335.28
  }
]
```

`GET: /weather/Summarize?lon=150&lat=80`

response example:

```JSON
{
  "max": {
    "temperature": 39.3,
    "precipitation": 335.28
  },
  "min": {
    "temperature": -0.8,
    "precipitation": 11.9
  },
  "avg": {
    "temperature": 18.5,
    "precipitation": 122.13
  }
}
```




