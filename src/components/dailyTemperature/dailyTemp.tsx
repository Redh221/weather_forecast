import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CityInterface,
  daysForecastType,
  fetchDailyForecast,
} from "../../redux/reducers/APIreducer";
import { AppDispatch, StoreType } from "../../redux/store";
import {
  Weathercode,
  WeathercodeImg,
  WeathercodeImgDaily,
} from "../utility/weathercode/weathercode.Styled";
import { getImageByWeathercode } from "../utility/weathercode/weatherImages";
import {
  DailyTempCardBox,
  DailyTempCardTemperatureBox,
  DailyTempCardTopDiv,
  DailyTempContainer,
  DailyTempDayDiv,
  DailyTempImgDiv,
  DailyTempMainDiv,
  DailyTempMaxTempDiv,
  DailyTempMinTempDiv,
  DailyTempUvDiv,
  DailyTempUvIcon,
  DailyTempWeekDayDiv,
  FourteenDaysButton,
  FourteenDaysDiv,
  SevenDaysButton,
  SevenDaysDiv,
} from "./dailyTempStyled";
import { useThemeContext } from "../../theme/themeContext";
import { IThemeContext } from "../../theme/theme";

export type ForecastDayAmount = "Seven" | "Fourteen";

export const WeeklyForecast = () => {
  const themeContextData: IThemeContext = useThemeContext();
  const [dayAmount, setDayAmount] = useState<ForecastDayAmount>("Seven");
  const changeForecastDateAmount = () => {
    if (dayAmount === "Seven") {
      setDayAmount("Fourteen");
    }
    if (dayAmount === "Fourteen") {
      setDayAmount("Seven");
    }
  };
  const weather: daysForecastType = useSelector(
    (state: StoreType) => state.daysForecastReducer.dailyForecast
  );
  const weatherSeven = weather.slice(0, 7);

  const weatherFourteen = weather.slice(7, weather.length);

  const selectedCity: CityInterface = useSelector(
    (state: StoreType) => state.daysForecastReducer.selectedCity
  );

  const { error } = useSelector(
    (state: StoreType) => state.daysForecastReducer
  );

  const dispatch = useDispatch<AppDispatch>();

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
    dispatch(
      fetchDailyForecast({
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        timezone: selectedCity.timezone,
      })
    );
  }, [selectedCity]);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <DailyTempMainDiv>
          {" "}
          <SevenDaysDiv>
            {weatherSeven.map((item: any) => (
              <DailyTempContainer key={item.date}>
                <DailyTempCardBox
                  themeStyles={themeContextData.stylesForTheme}
                  themeType={themeContextData.currentTheme}
                >
                  <DailyTempCardTopDiv>
                    <DailyTempWeekDayDiv>
                      <h5>{weekDay[item.date.getDay()]}</h5>
                    </DailyTempWeekDayDiv>
                    <DailyTempDayDiv>
                      <h5> {item.date.getDate()}</h5>
                    </DailyTempDayDiv>
                  </DailyTempCardTopDiv>

                  <DailyTempImgDiv>
                    <WeathercodeImgDaily
                      weathercode={item.weathercode}
                      src={getImageByWeathercode(item.weathercode)}
                      alt="weathercode_img"
                    ></WeathercodeImgDaily>
                  </DailyTempImgDiv>

                  <DailyTempCardTemperatureBox>
                    <DailyTempMaxTempDiv>
                      <h4>max: {item.temperatureMax} °C</h4>
                    </DailyTempMaxTempDiv>
                    <DailyTempMinTempDiv>
                      <h4>min: {item.temperatureMin} °C</h4>
                    </DailyTempMinTempDiv>
                  </DailyTempCardTemperatureBox>
                  <DailyTempUvDiv>
                    <DailyTempUvIcon
                      src="assets/uvTH.png"
                      alt="pressure"
                    ></DailyTempUvIcon>
                    <h5>{item.uvIndexMax}</h5>
                  </DailyTempUvDiv>
                </DailyTempCardBox>
              </DailyTempContainer>
            ))}
          </SevenDaysDiv>
          <div>
            <SevenDaysButton
              themeStyles={themeContextData.stylesForTheme}
              themeType={themeContextData.currentTheme}
              dayAmount={dayAmount}
              onClick={changeForecastDateAmount}
            >
              Show more
            </SevenDaysButton>
          </div>
          <FourteenDaysDiv dayAmount={dayAmount}>
            {weatherFourteen.map((item: any) => (
              <DailyTempContainer key={item.date}>
                <DailyTempCardBox
                  themeStyles={themeContextData.stylesForTheme}
                  themeType={themeContextData.currentTheme}
                >
                  <DailyTempCardTopDiv>
                    <DailyTempWeekDayDiv>
                      <h5>{weekDay[item.date.getDay()]}</h5>
                    </DailyTempWeekDayDiv>
                    <DailyTempDayDiv>
                      <h5> {item.date.getDate()}</h5>
                    </DailyTempDayDiv>
                  </DailyTempCardTopDiv>

                  <DailyTempImgDiv>
                    <WeathercodeImgDaily
                      weathercode={item.weathercode}
                      src={getImageByWeathercode(item.weathercode)}
                      alt="weathercode_img"
                    ></WeathercodeImgDaily>
                  </DailyTempImgDiv>

                  <DailyTempCardTemperatureBox>
                    <DailyTempMaxTempDiv>
                      <h4>max: {item.temperatureMax} °C</h4>
                    </DailyTempMaxTempDiv>
                    <DailyTempMinTempDiv>
                      <h4>min: {item.temperatureMin} °C</h4>
                    </DailyTempMinTempDiv>
                  </DailyTempCardTemperatureBox>
                  <DailyTempUvDiv>
                    <DailyTempUvIcon
                      src="assets/uvTH.png"
                      alt="pressure"
                    ></DailyTempUvIcon>
                    <h5>{item.uvIndexMax}</h5>
                  </DailyTempUvDiv>
                </DailyTempCardBox>
              </DailyTempContainer>
            ))}
          </FourteenDaysDiv>
          <FourteenDaysButton
            themeStyles={themeContextData.stylesForTheme}
            themeType={themeContextData.currentTheme}
            dayAmount={dayAmount}
            onClick={changeForecastDateAmount}
          >
            Show less
          </FourteenDaysButton>
        </DailyTempMainDiv>
      )}
    </div>
  );
};