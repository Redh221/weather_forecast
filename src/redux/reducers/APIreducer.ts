import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

import {
  axiosApiInstanceGeo,
  axiosApiInstanceMeteo,
} from "../../api/axiosConfig";
import {
  APIInitialState,
  CityInterface,
  daysForecastType,
  HourInterface,
  HourlyForecastArray,
  IForecastParams,
  ITodayHighlight,
  IWeatherDay,
  OptionCities,
} from "./reducerTypes";

const FillWeeklyForecast = (serverResponse: any) => {
  const weatherModel: daysForecastType = [];
  const daily = serverResponse.daily;

  for (let i = 0; i < daily.time.length; i++) {
    const day: IWeatherDay = {
      date: new Date(daily.time[i]),
      temperatureMax: daily.temperature_2m_max[i],
      temperatureMin: daily.temperature_2m_min[i],
      uvIndexMax: daily.uv_index_max[i],
      weathercode: daily.weathercode[i],
    };
    weatherModel.push(day);
  }
  return weatherModel;
};

export const fillHightlightsData = (serverResponse: any, timezone: string) => {
  const currentCityTime = moment().tz(timezone);
  let timeIndex = serverResponse.hourly.time.length;
  for (let i = 0; i < serverResponse.hourly.time.length; i++) {
    const time = moment.tz(serverResponse.hourly.time[i], timezone);
    if (time >= currentCityTime) {
      timeIndex = i;
      break;
    }
  }
  const object: ITodayHighlight = {
    sunrise: moment(serverResponse.daily.sunrise[0]).toString(),
    sunset: moment(serverResponse.daily.sunset[0]).toString(),
    uvIndex: serverResponse.daily.uv_index_max[0],
    sunriseTime: moment(serverResponse.daily.sunrise[0]).format("HH:mm"),
    sunsetTime: moment(serverResponse.daily.sunset[0]).format("HH:mm"),
    humidity: serverResponse.hourly.relativehumidity_2m[timeIndex],
    pressure: serverResponse.hourly.surface_pressure[timeIndex],
    temperature: Math.round(serverResponse.current_weather.temperature),
    windSpeed: serverResponse.current_weather.windspeed,
  };

  return object;
};

export const FillHourlyForecast = (serverResponse: any, timezone: string) => {
  const hourlyForecast: HourlyForecastArray = [];
  const hourly = serverResponse.hourly;
  for (let i = 0; i < hourly.time.length; i++) {
    const date = moment.tz(serverResponse.hourly.time[i], timezone);
    const hourForecast: HourInterface = {
      date: date.toString(),
      time: date.format("HH:mm"),
      windDirection: serverResponse.hourly.winddirection_10m[i],
      windGusts: serverResponse.hourly.windgusts_10m[i],
      temperature: serverResponse.hourly.temperature_2m[i],
      weathercode: serverResponse.hourly.weathercode[i],
    };

    hourlyForecast.push(hourForecast);
  }
  return hourlyForecast;
};
const getFiveRelevant = (
  unsortedHourlyForecast: HourlyForecastArray,
  timezone: string
) => {
  const hourlyForecast = unsortedHourlyForecast.slice();
  const filteredHourlyForecast = hourlyForecast.filter(
    (item) => moment(item.date).tz(timezone).hour() % 3 === 0
  );
  const currentCityTime = moment().tz(timezone);
  for (let i = 0; i < filteredHourlyForecast.length; i++) {
    const forecastTime = moment(filteredHourlyForecast[i].date);
    if (forecastTime >= currentCityTime) {
      i -= 1;
      if (filteredHourlyForecast.length - i < 5) {
        i = filteredHourlyForecast.length - 5;
      }
      return filteredHourlyForecast.slice(i, i + 5);
    }
  }
  return filteredHourlyForecast.slice(filteredHourlyForecast.length - 5);
};

const getCurrentWeather = (
  unsortedHourlyForecast: HourlyForecastArray,
  timezone: string
) => {
  const currentCityTime = moment().tz(timezone);

  const hourlyForecast = unsortedHourlyForecast.slice();

  for (let i = 0; i < hourlyForecast.length; i++) {
    const forecastTime = moment(hourlyForecast[i].date);
    if (forecastTime.hour() === currentCityTime.hour()) {
      return hourlyForecast[i].weathercode;
    }
  }
  throw new Error("Unexpected time");
};

export const optionCitySearch = (serverResponse: any): OptionCities => {
  if (!serverResponse || !serverResponse.results) {
    return [];
  }
  const optionCitySearch = [];
  const optionCity = serverResponse.results;
  const iterationCount = Math.min(3, optionCity.length);
  for (let i = 0; i < iterationCount; i++) {
    const allCityOptions = {
      name: optionCity[i].name,
      country: optionCity[i].country,
      latitude: optionCity[i].latitude,
      longitude: optionCity[i].longitude,
      timezone: optionCity[i].timezone,
      id: optionCity[i].id,
    };
    optionCitySearch.push(allCityOptions);
  }
  return optionCitySearch;
};

const initialState: APIInitialState = {
  weeklyForecast: [],
  todaysHightLights: null,
  hourlyForecast: [],
  fiveRelevantHours: [],
  loading: false,
  loadingSearch: false,
  error: null,
  search: "",
  selectedCity: {
    timezone: "Europe/Vilnius",
    name: "Vilnius",
    country: "Lithuania",
    longitude: 25.2798,
    latitude: 54.6892,
    id: 593116,
  },
  citiesOptions: [],
  currentWeather: 0,
};

export const fetchWeeklyForecast = createAsyncThunk(
  "weeklyForecastData",

  async (forecastParams: IForecastParams, { rejectWithValue }) => {
    try {
      const result = await axiosApiInstanceMeteo.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${forecastParams.latitude}&longitude=${forecastParams.longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max&current_weather=true&timezone=${forecastParams.timezone}&forecast_days=14`
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHourlyForecast = createAsyncThunk(
  "hourlyForecastData",
  async (forecastParams: IForecastParams, { rejectWithValue }) => {
    try {
      const result = await axiosApiInstanceMeteo.get(
        `/v1/forecast?latitude=${forecastParams.latitude}&longitude=${forecastParams.longitude}&hourly=weathercode,temperature_2m,winddirection_10m,windgusts_10m&daily=weathercode&current_weather=true&timezone=${forecastParams.timezone}&forecast_days=1`
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodaysHightlights = createAsyncThunk(
  "todaysHightlights",
  async (forecastParams: IForecastParams, { rejectWithValue }) => {
    try {
      const result = await axiosApiInstanceMeteo.get(
        `/v1/forecast?latitude=${forecastParams.latitude}&longitude=${forecastParams.longitude}&hourly=temperature_2m,relativehumidity_2m,surface_pressure,windspeed_10m&daily=sunrise,sunset,uv_index_max&current_weather=true&timezone=${forecastParams.timezone}&forecast_days=1`
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSearchLocation = createAsyncThunk(
  "searchLocationData",

  async (searchState: string, { rejectWithValue }) => {
    try {
      const result = await axiosApiInstanceGeo.get(
        `/v1/search?name=${searchState}`
      );
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const APISlice = createSlice({
  name: "apis",
  initialState,
  reducers: {
    setWeeklyForecast: (state, action: PayloadAction<daysForecastType>) => {
      state.weeklyForecast = action.payload;
    },
    setTodaysHightLights: (state, action: PayloadAction<ITodayHighlight>) => {
      state.todaysHightLights = action.payload;
    },
    setFiveRelevantHours: (
      state,
      action: PayloadAction<HourlyForecastArray>
    ) => {
      state.fiveRelevantHours = action.payload;
    },
    setHourlyForecast: (state, action: PayloadAction<HourlyForecastArray>) => {
      state.hourlyForecast = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<CityInterface>) => {
      state.selectedCity = action.payload;
    },
    setOptionCitySearch: (state, action: PayloadAction<OptionCities>) => {
      state.citiesOptions = action.payload;
    },
    setCurrentWeather: (state, action: PayloadAction<number>) => {
      state.currentWeather = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchWeeklyForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeeklyForecast.fulfilled, (state, action) => {
        state.weeklyForecast = FillWeeklyForecast(action.payload);

        state.loading = false;
      })
      .addCase(fetchWeeklyForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchHourlyForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHourlyForecast.fulfilled, (state, action) => {
        state.hourlyForecast = FillHourlyForecast(
          action.payload,
          state.selectedCity.timezone
        );
        state.fiveRelevantHours = getFiveRelevant(
          state.hourlyForecast,
          state.selectedCity.timezone
        );
        state.currentWeather = getCurrentWeather(
          state.hourlyForecast,
          state.selectedCity.timezone
        );
        state.loading = false;
      })
      .addCase(fetchHourlyForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTodaysHightlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodaysHightlights.fulfilled, (state, action) => {
        state.todaysHightLights = fillHightlightsData(
          action.payload,
          state.selectedCity.timezone
        );
        state.loading = false;
      })
      .addCase(fetchTodaysHightlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSearchLocation.pending, (state) => {
        state.loadingSearch = true;
        state.error = null;
      })
      .addCase(fetchSearchLocation.fulfilled, (state, action) => {
        state.citiesOptions = optionCitySearch(action.payload);
        state.loadingSearch = false;
      })
      .addCase(fetchSearchLocation.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload;
      }),
});

export const {
  setWeeklyForecast,
  setTodaysHightLights,
  setHourlyForecast,
  setSelectedCity,
} = APISlice.actions;

export const daysForecastReducer = APISlice.reducer;
