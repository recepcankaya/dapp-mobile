import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface Props {
  onChangeDayValue: (value: number) => void;
  dayInitialIndex: number;
}

const { width } = Dimensions.get("screen");
const segmentsLength = 31;
const segmentWidth = 32;
const segmentHeight = 60;
const segmentSpacing = 16;
const snapSegment = segmentWidth + segmentSpacing;
const spacerWidth = (width - segmentWidth) / 2;
const halfSegmentHeight = segmentHeight / 2;

const DayCalendar = (props: Props) => {
  const { onChangeDayValue, dayInitialIndex } = props;
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedData, setSelectedData] = useState<number>();
  const [selectedDataIndex, setSelectedDataIndex] = useState<number>(0);
  const data: number[] = Array.from(
    { length: segmentsLength },
    (_, index) => index + 1
  );
  const animatedValues = data.map(() => useSharedValue(0));

  useEffect(() => {
    if (selectedDataIndex !== undefined) {
      setSelectedData(data[selectedDataIndex]);
    }
  }, [selectedDataIndex]);

  useEffect(() => {
    if (selectedData) {
      onChangeDayValue(selectedData);
    }
  }, [selectedData]);

  useEffect(() => {
    console.log("selectedDataIndex", selectedDataIndex);
    console.log("dayInitialIndex-daySlider", dayInitialIndex);
    scrollViewRef.current?.scrollTo({
      x: dayInitialIndex * snapSegment,
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
      const timingValues = [29, 30, 24, 14, -3];
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
                index === selectedDataIndex ? withTiming(25) : withTiming(20),
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
          width: 33,
          height: 50,
          backgroundColor: "#D9D9D9",
          position: "absolute",
          top: 90,
          left: width / 2 - segmentSpacing,
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
    fontSize: 20,
  },
});

export default DayCalendar;
