import { styled } from "styled-components";
import { ForecastDayAmount } from "./dailyTemp";
interface IDayAmount {
  dayAmount: ForecastDayAmount;
}

export const FourteenDaysDiv = styled.div<IDayAmount>`
  display: ${(props) => (props.dayAmount === "Seven" ? "none" : "flex")};
`;

export const FourteenDaysButton = styled.button<IDayAmount>`
  display: ${(props) => (props.dayAmount === "Seven" ? "none" : "")};
`;

export const SevenDaysButton = styled.button<IDayAmount>`
  display: ${(props) => (props.dayAmount === "Fourteen" ? "none" : "")};
`;