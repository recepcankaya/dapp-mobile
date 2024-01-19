import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Path, LinearGradient, Stop, Defs, Mask } from "react-native-svg";

import DayCalendar from "./dayCalendar";
import MonthCalendar from "./monthCalendar";
import YearCalendar from "./yearCalendar";

const { width } = Dimensions.get("screen");

interface CalendarProps {
  onChangeDate: (date: Date) => void;
}

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
const years = ["2022", "2023", "2024"];
const days = Array.from({ length: 31 }, (_, index) => index + 1);

const Calendar = (props: CalendarProps) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<string>(months[new Date().getMonth()]);
  const [day, setDay] = useState<number>(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number>();
  const [dayInitialIndex, setDayInitialIndex] = useState<number>(0);
  const [monthInitialIndex, setMonthInitialIndex] = useState<number>(0);
  const [yearInitialIndex, setYearInitialIndex] = useState<number>(0);
  const [dateType, setDateType] = useState(0);
  const { onChangeDate } = props;

  useEffect(() => {
    const date = new Date(
      parseInt(years[yearInitialIndex]),
      months.findIndex((item) => item === months[monthInitialIndex]),
      days[dayInitialIndex + 1]
    );
    onChangeDate(date);
  }, [dayInitialIndex, monthInitialIndex, yearInitialIndex]);

  useEffect(() => {
    setTimeout(() => {
      setSelectedMonth(month);
      setDayInitialIndex(dayInitialIndex);
    }, 3000);
  }, [month]);

  useEffect(() => {
    if (selectedMonth !== undefined && selectedMonth === month) {
      setDateType(0);
    }
  }, [selectedMonth]);

  useEffect(() => {
    setTimeout(() => {
      setSelectedYear(year);
      setDayInitialIndex(dayInitialIndex);
    }, 3000);
  }, [year]);

  useEffect(() => {
    if (selectedYear !== undefined && selectedYear === year) setDateType(0);
  }, [selectedYear]);

  useEffect(() => {
    setDateType(0);
    setDayInitialIndex(0);
    setMonthInitialIndex(0);
    setYearInitialIndex(0);
  }, []);

  useEffect(() => {
    if (dateType === 0) {
      console.log("day", day);
      setDayInitialIndex(days.indexOf(day));
    } else if (dateType === 1) {
      console.log("month", month);
      setMonthInitialIndex(months.indexOf(month));
    } else if (dateType === 2) {
      console.log("year", year);
      setYearInitialIndex(years.indexOf(year.toString()));
    }
  }, [dateType]);

  return (
    <View style={styles.container}>
      <CalendarBackground />
      {dateType === 0 && (
        <DayCalendar
          onChangeDayValue={(value: number) => {
            console.log("dayValue", value);
            setDay(days[value - 1]);
            setDayInitialIndex(value - 1);
          }}
          dayInitialIndex={dayInitialIndex}
        />
      )}
      {dateType === 1 && (
        <MonthCalendar
          onChangeMonthValue={(value: string) => {
            console.log("monthValue", value);
            setMonth(value);
            setMonthInitialIndex(months.findIndex((m) => m === value));
          }}
          monthInitialIndex={monthInitialIndex}
        />
      )}
      {dateType === 2 && (
        <YearCalendar
          onChangeYearValue={(value: string) => {
            console.log("yearValue", value);
            setYear(Number(value));
            setYearInitialIndex(years.findIndex((y) => y === value));
          }}
          yearInitialIndex={yearInitialIndex}
        />
      )}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => setDateType(1)} style={styles.buttons}>
          <Text style={styles.buttonsText}>{month}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setDateType(2)} style={styles.buttons}>
          <Text style={styles.buttonsText}>{year}</Text>
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
