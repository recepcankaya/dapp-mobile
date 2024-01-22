import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
// import { days, months, years } from ".";

const { width } = Dimensions.get("screen");
const segmentsLength = 10;
const segmentWidth = 50;
const segmentHeight = 60;
const segmentSpacing = 25;
const snapSegment = segmentWidth + segmentSpacing;
const spacerWidth = (width - segmentWidth) / 2;
const halfSegmentHeight = segmentHeight / 2;

type CalendarAnimationProps = {
  onChangeValue: (value: string) => void;
  initialIndex: number;
  data: string[];
  backToDays: () => void;
};

const CalendarAnimation = (props: CalendarAnimationProps) => {
  const [selectedDataIndex, setSelectedDataIndex] = useState<number>(0);
  const [selectedData, setSelectedData] = useState<string>("");

  const scrollViewRef = useRef<ScrollView>(null);
  const { onChangeValue, initialIndex, data, backToDays } = props;

  const animatedValues = data.map(() => useSharedValue(0));

  useEffect(() => {
    if (selectedDataIndex !== undefined) {
      setSelectedData(data[selectedDataIndex]);
    }
  }, [selectedDataIndex]);

  useEffect(() => {
    if (selectedData) {
      onChangeValue(selectedData);
    }
  }, [selectedData]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const selected = Math.round(offsetX / snapSegment);
    setSelectedDataIndex(selected);

    for (let i = -4; i <= 4; i++) {
      const index = selected + i;
      if (index >= 0 && index < data.length && animatedValues[index]) {
        const start = (index + 3) * snapSegment - spacerWidth;
        const end = (index + 4) * snapSegment - spacerWidth;
        const distanceToCenter = Math.abs(offsetX - (start + end));
        const translateY = Math.max(0, halfSegmentHeight - distanceToCenter);
        const timingValues = [29, 26, 9, -9, -26];
        animatedValues[index].value = withSpring(
          (translateY + timingValues[Math.abs(i)]) / halfSegmentHeight
        );
      }
    }
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
        onScrollEndDrag={backToDays}>
        <View style={styles.spacer}></View>
        {data.map((item, index) => {
          console.log("x-1");
          const animatedStyle = useAnimatedStyle(() => {
            console.log("x-4");
            return {
              height: segmentHeight + animatedValues[index].value * 70,
            };
          });
          console.log("x-2");
          const animatedTextStyle = useAnimatedStyle(() => {
            return {
              color:
                index === selectedDataIndex
                  ? withTiming("red")
                  : withTiming("white"),
              fontSize:
                index === selectedDataIndex ? withTiming(20) : withTiming(18),
            };
          });
          console.log("x-3");
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
        }}></View>
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
    marginTop: 30,
  },
  spacer: {
    width: spacerWidth - segmentSpacing,
    marginRight: segmentSpacing,
  },
  item: {
    width: segmentWidth,
    marginRight: segmentSpacing,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontSize: 15,
  },
});

export default CalendarAnimation;
