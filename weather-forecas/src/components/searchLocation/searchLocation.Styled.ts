import styled from "styled-components";

export const SearchLocationContainer = styled.div`
  background: rgba(68, 68, 68, 0.8);
  color: #ffffff;
  margin: 0 auto;
  height: 800px;
  border-radius: 30px;
  padding: 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const SearchLocationInput = styled.input`
  background: rgba(68, 68, 68, 0.8);
  border: 1px solid #1d1d1d;
  border-radius: 30px;
  color: #ffffff;
  text-align: center;
  width: 180px;
  margin-top: 40px;
`;
export const OptionCitiesDiv = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  color: #ffffff;
  width: 180px;
`;

export const OptionCitiesButton = styled.button`
  background: rgba(68, 68, 68, 0.8);
  border: 1px solid #1d1d1d;
  border-radius: 30px;
  color: #ffffff;
`;
export const CityNameDiv = styled.div`
  margin-top: 120px;
  h3 {
    font-size: 30px;
    background: -webkit-linear-gradient(89deg, #eee 35%, #333);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;
export const CurrentWeatherIcon = styled.img`
  margin: 0 auto;
  max-width: 180px;
  height: auto;
`;
