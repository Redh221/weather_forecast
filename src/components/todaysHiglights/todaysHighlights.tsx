import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CityInterface,
  fetchTodaysHightlights,
  ITodayHighlight,
} from "../../redux/reducers/APIreducer";
import { AppDispatch, StoreType } from "../../redux/store";

import {
  CoupleWeatherDetailsDiv,
  SunTimeContainer,
  SunTimeDiv,
  SunTimeInfo,
  TemmperatureDiv,
  TodaysHightlightsContainer,
  TodaysHightlightSet,
  TodaysHightlightsIcon,
  WeatherDetailsDiv,
  WeatherDetailsIcon,
  WeatherDetailsSet,
} from "./todaysHighlights.Styled";
import { useThemeContext } from "../../theme/themeContext";
import { IThemeContext } from "../../theme/theme";

export const TodaysHightlights = () => {
  const themeContextData: IThemeContext = useThemeContext();

  const todaysHighlights: ITodayHighlight | null = useSelector(
    (state: StoreType) => state.daysForecastReducer.todaysHightLights
  );

  const selectedCity: CityInterface = useSelector(
    (state: StoreType) => state.daysForecastReducer.selectedCity
  );

  const { error } = useSelector(
    (state: StoreType) => state.daysForecastReducer
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      fetchTodaysHightlights({
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        timezone: selectedCity.timezone,
      })
    );
  }, [selectedCity]);
console.log(todaysHighlights?.humidity, "dkcmdk")
  return (
    <TodaysHightlightsContainer
      themeStyles={themeContextData.stylesForTheme}
      themeType={themeContextData.currentTheme}
    >
      <h1>{"Today's hilights"}</h1>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <TodaysHightlightSet>
          <SunTimeContainer>
            <SunTimeDiv>
              <TodaysHightlightsIcon src="assets/sunriseTH.png" alt="sunrise" />
              <SunTimeInfo>
                <h5>Sunrise</h5>
                <h5>{todaysHighlights?.sunriseTime}</h5>
              </SunTimeInfo>
            </SunTimeDiv>
            <SunTimeDiv>
              <TodaysHightlightsIcon src="assets/sunsetTH.png" alt="sunset" />
              <SunTimeInfo>
                <h5>Sunset</h5>
                <h5>{todaysHighlights?.sunsetTime}</h5>
              </SunTimeInfo>
            </SunTimeDiv>
          </SunTimeContainer>
          <TemmperatureDiv
            themeStyles={themeContextData.stylesForTheme}
            themeType={themeContextData.currentTheme}
          >
            <h3>{todaysHighlights?.temperature}°C</h3>
          </TemmperatureDiv>
          <WeatherDetailsSet>
            <CoupleWeatherDetailsDiv>
              <WeatherDetailsDiv>
                <WeatherDetailsIcon
                  src="assets/humidityTH.png"
                  alt="humidity"
                />
                <h5>{todaysHighlights?.humidity}%</h5>
                <h5>Humidity</h5>
              </WeatherDetailsDiv>
              <WeatherDetailsDiv>
                {" "}
                <WeatherDetailsIcon src="assets/windTH.png" alt="pressure" />
                <h5>{todaysHighlights?.windSpeed}km/h</h5>
                <h5>Wind Speed</h5>
              </WeatherDetailsDiv>
            </CoupleWeatherDetailsDiv>
            <CoupleWeatherDetailsDiv>
              <WeatherDetailsDiv>
                <WeatherDetailsIcon
                  src="assets/pressureTH.png"
                  alt="pressure"
                />
                <h5>{todaysHighlights?.pressure}hPa</h5>
                <h5>Pressure</h5>
              </WeatherDetailsDiv>
              <WeatherDetailsDiv>
                <WeatherDetailsIcon src="assets/uvTH.png" alt="pressure" />
                <h5>{todaysHighlights?.uvIndex}</h5>
                <h5>UV</h5>
              </WeatherDetailsDiv>
            </CoupleWeatherDetailsDiv>
          </WeatherDetailsSet>
        </TodaysHightlightSet>
      )}
    </TodaysHightlightsContainer>
  );
};
