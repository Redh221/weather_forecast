import { useState } from "react";
import { IThemeContext } from "../../theme/theme";
import { FavoriteBtn, StyledOptionCitiesButton } from "./searchLocation.Styled";
import { CityInterface } from "../../redux/reducers/reducerTypes";

interface IOptionCityButton {
  city: CityInterface;
  themeContext: IThemeContext;
  cityInputHandler: (event: any) => void;
  favoriteInputHandler: (event: any) => void;
  marked: boolean;
}

export const OptionCitiesButton = ({
  city,
  themeContext,
  cityInputHandler,
  favoriteInputHandler,
  marked,
}: IOptionCityButton) => {
  const [showFavoriteButton, setShowFavoriteButton] = useState<boolean>(marked);

  const setShowFavoriteButtonFunc = (event: any) => {
    setShowFavoriteButton(!showFavoriteButton);
    favoriteInputHandler(event);
  };

  return (
    <>
      {" "}
      <div style={{ position: "relative" }}>
        <StyledOptionCitiesButton
          themestyles={themeContext.stylesForTheme}
          themetype={themeContext.currentTheme}
          key={city.id}
          data-id={city.id}
          onClick={cityInputHandler}
        >
          {city.name} / {city.country}
        </StyledOptionCitiesButton>
        {showFavoriteButton ? (
          <FavoriteBtn
            key={`button-${city.id}`}
            data-id={city.id}
            onClick={setShowFavoriteButtonFunc}
            className="icon-heart-fill"
          />
        ) : (
          <FavoriteBtn
            key={`button-${city.id}`}
            data-id={city.id}
            onClick={setShowFavoriteButtonFunc}
            className="icon-heart-stroke"
          />
        )}
      </div>
    </>
  );
};
