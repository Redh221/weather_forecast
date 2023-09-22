import { useEffect, useState } from "react";
// interface;

const ToWeatherModel = (APIobj: any) => {
  const weatherModel: any = [];
  const daily = APIobj.daily;

  for (let i = 0; i < daily.time.length; i++) {
    const day = {
      date: new Date(daily.time[i]),
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      uvIndexMax: daily.uv_index_max[i],
      weathercode: daily.weathercode[i],
    };
    weatherModel.push(day);
  }
  // console.log(weatherModel[0].getDay(), "tEST 1");
  return weatherModel;
};

export const ForecastData = () => {
  const [weather, setWeather] = useState<any[any]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const weekDay = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=54.6892&longitude=25.2798&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max"
    )
      .then((response) => response.json())
      .then((json) => setWeather(ToWeatherModel(json)))
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div style={{ display: "flex" }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        weather.map((item: any) => (
          <div
            key={item.date}
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "pink",
              margin: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "red",
                margin: "10px",
              }}
            >
              <p>weekDay: {weekDay[item.date.getDay()]}</p>
              <p>date: {item.date.getDate()}</p>
              <p>Max temperature: {item.temperatureMax}</p>
              <p>Min temperature: {item.temperatureMin}</p>
              <p>UV Index Max: {item.uvIndexMax}</p>
              <p>Weathercode: {item.weathercode}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
