import React, { useState, useRef, useEffect, useMemo } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Props {
  onChangeYearValue: (value: string) => void;
  yearInitialIndex: number;
}

const { width } = Dimensions.get("screen");
const segmentsLength = 10;
const segmentWidth = 50;
const segmentHeight = 60;
const segmentSpacing = 25;
const snapSegment = segmentWidth + segmentSpacing;
const spacerWidth = (width - segmentWidth) / 2;
const halfSegmentHeight = segmentHeight / 2;

const YearCalendar = (props: Props) => {
  const { onChangeYearValue, yearInitialIndex } = props;
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedData, setSelectedData] = useState<string>();
  const [selectedDataIndex, setSelectedDataIndex] = useState<number>(0);
  const data = [
    "2023",
    "2024",
    "2025",
    "2026",
    "2027",
    "2028",
    "2029",
    "2030",
  ];
  const [date, setDate] = useState();
  const animatedValues = data.map(() => useSharedValue(0));
  useEffect(() => {
    if (selectedDataIndex !== undefined) {
      setSelectedData(data[selectedDataIndex]);
    }
  }, [selectedDataIndex]);

  useEffect(() => {
    console.log("selectedYearData", selectedData);
    if (selectedData) {
      onChangeYearValue(selectedData);
    }
  }, [selectedData]);

  useEffect(() => {
    console.log("Year-selectedDataIndex", selectedDataIndex);
    console.log("yearInitialIndex", yearInitialIndex);
    scrollViewRef.current?.scrollTo({
      x: yearInitialIndex * snapSegment,
      animated: true,
    });
  }, []);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const selected = Math.round(offsetX / snapSegment) + 1;
    setSelectedDataIndex(selected - 1);
    data.forEach((item, index) => {
      const start = (index + 3) * snapSegment - spacerWidth;
      const end = (index + 4) * snapSegment - spacerWidth;
      const distanceToCenter = Math.abs(offsetX - (start + end));
      const translateY = Math.max(0, halfSegmentHeight - distanceToCenter);
      const timingValues = [29, 26, 9, -9, -26];
      for (let i = -4; i <= 4; i++) {
        const index = selectedDataIndex + i;
        if (animatedValues[index]) {
          animatedValues[index].value = withSpring(
            (translateY + timingValues[Math.abs(i)]) / halfSegmentHeight
          );
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={snapSegment}
        style={styles.scrollView}
        bounces={false}
        onScroll={handleScroll}
      >
        <View style={styles.spacer}></View>
        {data.map((item, index) => {
          const animatedStyle = useAnimatedStyle(() => {
            return {
              height: segmentHeight + animatedValues[index].value * 70,
            };
          });

          const animatedTextStyle = useAnimatedStyle(() => {
            return {
              color:
                index === selectedDataIndex
                  ? withTiming("black")
                  : withTiming("white"),
              fontSize:
                index === selectedDataIndex ? withTiming(20) : withTiming(18),
            };
          });
          return (
            <Animated.View style={[styles.item, animatedStyle]} key={index}>
              <Animated.Text style={[styles.itemText, animatedTextStyle]}>
                {item}
              </Animated.Text>
            </Animated.View>
          );
        })}
        <View style={[styles.spacer, { marginRight: 0 }]}></View>
      </ScrollView>
      <View
        style={{
          width: 70,
          height: 50,
          backgroundColor: "#D9D9D9",
          position: "absolute",
          top: 90,
          left: width / 2 - 35,
          zIndex: -10,
          borderRadius: 80,
        }}
      ></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    height: 170,
  },
  spacer: {
    width: spacerWidth - segmentSpacing,
    marginRight: segmentSpacing,
  },
  item: {
    width: segmentWidth,
    marginRight: segmentSpacing,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  itemText: {
    fontSize: 15,
  },
});

export default YearCalendar;
