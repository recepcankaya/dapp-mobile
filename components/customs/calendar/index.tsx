import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Path, LinearGradient, Stop, Defs, Mask } from "react-native-svg";

import CalendarAnimation from "./CalendarAnimation";
import CalendarAnimationv2 from "./CalendarAnimationv2";

const { width } = Dimensions.get("screen");

const CalendarBackground = () => {
  return (
    <Svg
      width={width}
      height={180}
      viewBox="0 0 430 180"
      fill="none"
      style={{ position: "absolute", top: -40 }}>
      <Defs>
        <LinearGradient
          id="paint0_linear_53_7"
          x1="215.062"
          y1="179.358"
          x2="214.36"
          y2="-191.546"
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#B80DCA" />
          <Stop offset="1" stopColor="#4035CB" />
        </LinearGradient>
      </Defs>
      <Mask id="path-1-inside-1_53_7" fill="white">
        <Path d="M-24.7187 -5.64075C-24.6441 43.5442 0.66043 90.6669 45.6281 125.361C90.5958 160.055 151.543 179.478 215.062 179.358C278.582 179.238 339.47 159.584 384.332 124.72C429.194 89.8555 454.355 42.6372 454.281 -6.54778L214.781 -6.09428L-24.7187 -5.64075Z" />
      </Mask>
      <Path
        d="M-24.7187 -5.64075C-24.6441 43.5442 0.66043 90.6669 45.6281 125.361C90.5958 160.055 151.543 179.478 215.062 179.358C278.582 179.238 339.47 159.584 384.332 124.72C429.194 89.8555 454.355 42.6372 454.281 -6.54778L214.781 -6.09428L-24.7187 -5.64075Z"
        fill="#0C0C0C"
        stroke="url(#paint0_linear_53_7)"
        strokeWidth={10}
        mask="url(#path-1-inside-1_53_7)"
      />
    </Svg>
  );
};

const months = [
  { index: 0, key: 0, text: "January" },
  { index: 1, key: 1, text: "February" },
  { index: 2, key: 2, text: "March" },
  { index: 3, key: 3, text: "April" },
  { index: 4, key: 4, text: "May" },
  { index: 5, key: 5, text: "June" },
  { index: 6, key: 6, text: "July" },
  { index: 7, key: 7, text: "August" },
  { index: 8, key: 8, text: "September" },
  { index: 9, key: 9, text: "October" },
  { index: 10, key: 10, text: "November" },
  { index: 11, key: 11, text: "December" },
  { index: 12, key: 12, text: "" },
  { index: 13, key: 13, text: "" },
];
const years = [
  { index: 0, key: 0, text: "2024" },
  { index: 1, key: 1, text: "2025" },
  { index: 2, key: 2, text: "2026" },
  { index: 3, key: 3, text: "" },
  { index: 4, key: 4, text: "" },
];

const days = Array.from({ length: 33 }, (_, index) => ({
  index,
  key: index,
  text: (index + 1).toString(),
}));

type CalendarProps = {
  onChangeDate: (date: { year: string; month: string; day: string }) => void;
};

const Calendar = ({ onChangeDate }: CalendarProps) => {
  // This is the state that consists of the index of the year, month and day in their respective arrays. Initially, it is set to the current date index in the arrays.
  // This is the state that consists of year, month and day for the calendar. Initially, it is set to the current date.
  const [currentDate, setCurrentDate] = useState<{
    year: string;
    month: string;
    day: string;
  }>({
    year: new Date().getFullYear().toString(),
    month: months[new Date().getMonth()].text,
    day: new Date().getDate().toString(),
  });

  // This is the state that consists of the index of the year, month and day in their respective arrays. Initially, it is set to the current date index in the arrays.
  const [currentDateIndex, setCurrentDateIndex] = useState<{
    yearIndex: number;
    monthIndex: number;
    dayIndex: number;
  }>({
    yearIndex: years.findIndex((y) => y.text === currentDate.year),
    monthIndex: months.findIndex((m) => m.text === currentDate.month),
    dayIndex: days.findIndex((d) => d.text.toString() === currentDate.day),
  });

  //add onChangeDate

  // There are three tabs in the calendar: "day", "month", and "year".
  const [dateTab, setDateTab] = useState<"day" | "month" | "year">("day");

  /**
   * Changes the active date tab.
   *
   * @param tab - The tab to set as active. Can be "day", "month", or "year".
   */
  const changeDateTab = (tab: "day" | "month" | "year") => {
    setDateTab(tab);
    console.log("The chosen tab is: ", tab);
  };

  /**
   * Navigates back to the "day" tab after a delay.
   */
  const backToDays = () => {
    setTimeout(() => {
      setDateTab("day");
    }, 2250);
  };

  return (
    <View style={styles.container}>
      <CalendarBackground />
      {dateTab === "day" && (
        <CalendarAnimationv2
          onChangeValue={(value: string) => {
            console.log("dayValue", value);
            setCurrentDate({ ...currentDate, day: value });
            setCurrentDateIndex({
              ...currentDateIndex,
              dayIndex: days.findIndex((d) => d.text === value),
            });
            onChangeDate(currentDate);
          }}
          initialIndex={currentDateIndex.dayIndex}
          backToDays={backToDays}
          data={days}
        />
      )}
      {dateTab === "month" && (
        <CalendarAnimationv2
          onChangeValue={(value: string) => {
            console.log(
              "monthValue",
              months.findIndex((m) => m.text === value) + 1
            );
            setCurrentDate({
              ...currentDate,
              month: (months.findIndex((m) => m.text === value) + 1).toString(),
            });
            setCurrentDateIndex({
              ...currentDateIndex,
              monthIndex: months.findIndex((m) => m.text === value),
            });
            onChangeDate(currentDate);
          }}
          backToDays={backToDays}
          data={months}
          initialIndex={currentDateIndex.monthIndex}
        />
      )}
      {dateTab === "year" && (
        <CalendarAnimationv2
          onChangeValue={(value: string) => {
            console.log("yearValue", value);
            setCurrentDate({ ...currentDate, year: value });
            setCurrentDateIndex({
              ...currentDateIndex,
              yearIndex: years.findIndex((y) => y.text === value),
            });
            onChangeDate(currentDate);
          }}
          initialIndex={currentDateIndex.yearIndex}
          backToDays={backToDays}
          data={years}
        />
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => changeDateTab("month")}
          style={styles.buttons}>
          <Text style={styles.buttonsText}>
            {months[parseInt(currentDate.month) - 1]?.text}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeDateTab("year")}
          style={styles.buttons}>
          <Text style={styles.buttonsText}>{currentDate.year}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 180,
  },
  sliderContainer: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: width / 2 - 50,
    top: 10,
    zIndex: 100,
  },
  buttons: {
    height: 30,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsText: {
    fontSize: 20,
    color: "white",
  },
});

export default Calendar;
