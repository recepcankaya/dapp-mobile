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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const years = ["2024", "2025", "2026"];
const days = Array.from({ length: 31 }, (_, index) => (index + 1).toString());

type CalendarProps = {
  onChangeDate: (date: Date) => void;
};

const Calendar = ({ onChangeDate }: CalendarProps) => {
  // This is the state that consists of year, month and day for the calendar. Initially, it is set to the current date.
  const [currentDate, setCurrentDate] = useState<{
    year: string;
    month: string;
    day: string;
  }>({
    year: new Date().getFullYear().toString(),
    month: months[new Date().getMonth()],
    day: new Date().getDate().toString(),
  });

  // This is the state that consists of the index of the year, month and day in their respective arrays. Initially, it is set to the current date index in the arrays.
  const [currentDateIndex, setCurrentDateIndex] = useState<{
    yearIndex: number;
    monthIndex: number;
    dayIndex: number;
  }>({
    yearIndex: years.findIndex((y) => y === currentDate.year),
    monthIndex: months.findIndex((m) => m === currentDate.month),
    dayIndex: days.findIndex((d) => d === currentDate.day),
  });

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

  const handleCurrentDateChange = (value: string) => {
    if (dateTab === "day") {
      setCurrentDate({ ...currentDate, day: value });
      setCurrentDateIndex({
        ...currentDateIndex,
        dayIndex: days.findIndex((d) => d === value),
      });
    } else if (dateTab === "month") {
      setCurrentDate({ ...currentDate, month: value });
      setCurrentDateIndex({
        ...currentDateIndex,
        monthIndex: months.findIndex((m) => m === value),
      });
    } else {
      setCurrentDate({ ...currentDate, year: value });
      setCurrentDateIndex({
        ...currentDateIndex,
        yearIndex: years.findIndex((y) => y === value),
      });
    }
  };

  return (
    <View style={styles.container}>
      <CalendarBackground />
      {/* @todo - `tab` değiştiği zaman data prop' u boş olarak gidiyor. Bundan dolayı `undefined: length` hatası alınıyor. bu arada ayrı ayrı datalar prop olarak gönderildiği zaman sıkıntı yok. tek proptan gidince sıkıntı oluşuyor. önceliğimiz tek component üzerinden geçirmek olsun. Yok, illa ki üç farklı koşul ve component gerekiyor. O zaman öyle yaparız. Ya da üç tane ayrı component yazmak yerine şu da yapılabilir 
        dateTab === "day" ? <CalendarAnimation data={days} /> : dateTab === "months" ? <CalendarAnimation data={months} /> : <CalendarAnimation data={years} />
      */}
      <CalendarAnimation
        onChangeValue={handleCurrentDateChange}
        backToDays={backToDays}
        data={dateTab === "day" ? days : dateTab === "month" ? months : years}
        initialIndex={
          dateTab === "day"
            ? currentDateIndex.dayIndex
            : dateTab === "month"
              ? currentDateIndex.monthIndex
              : currentDateIndex.yearIndex
        }
      />
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => changeDateTab("month")}
          style={styles.buttons}>
          <Text style={styles.buttonsText}>{currentDate.month}</Text>
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
