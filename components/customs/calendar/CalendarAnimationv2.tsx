/* eslint-disable react/react-in-jsx-scope */
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

const { width } = Dimensions.get("screen");
const segmentQty = 5;
const segmentWidth = Math.round(width / segmentQty); // snapToInterval is buggy  with non integers.
const halfWidth = width * 0.5;
const spacerWidth = (width - segmentWidth) / 2;
const segmentSpacing = 25;

const fontSizeMin = 14;
const fontSizeChange = 6;

const scrollHeight = width * 0.3;
const itemHeight = (fontSizeMin + fontSizeChange) * 2;
const translateYMax = scrollHeight - itemHeight;

type CalendarAnimationProps = {
  onChangeValue: (value: string) => void;
  initialIndex: number;
  data: { index: number; key: number; text: string }[];
  backToDays: () => void;
};

const sampleList = Array.from({ length: 30 }, (_, index) => ({
  index,
  key: index,
  text: (index + 1) % 5 ? index + 1 : "buzz",
}));

const getEllipseYAbs = (x: any, semiX: any, semiY: any) => {
  "worklet";
  return Math.sqrt((1 - (x - semiX) ** 2 / semiX ** 2) * semiY ** 2);
};

const getYOnEllipseDown = (localX: any) => {
  "worklet";
  if (localX < 0 || width < localX) return 0;
  return getEllipseYAbs(localX, halfWidth, translateYMax);
};

const AnimatedItem = (item: any) => {
  const itemMidX = (item?.index + 0.5) * segmentWidth;

  const drivedLocalX = useDerivedValue(
    () => itemMidX - item?.sharedOffsetX.value + spacerWidth
  );
  const animProgress = useDerivedValue(() => {
    const normalX =
      Math.abs((drivedLocalX.value - halfWidth) / segmentWidth) * 2;
    return normalX < 1 ? 1 - normalX : 0;
  });

  const animStyle = useAnimatedStyle(() => ({
    color: interpolateColor(animProgress.value, [0, 1], ["white", "black"]),
    fontSize: fontSizeMin + fontSizeChange * animProgress.value,
    fontWeight: animProgress.value ? "bold" : "normal",
    transform: [{ translateY: getYOnEllipseDown(drivedLocalX.value) }],
  }));

  return (
    <View style={styles.item}>
      <Animated.Text style={animStyle}>{item?.text}</Animated.Text>
    </View>
  );
};

const EllipticalScroll = ({
  data,
  backToDays,
  initialIndex,
  onChangeValue,
}: CalendarAnimationProps) => {
  const [selectedDataIndex, setSelectedDataIndex] = useState(Number(new Date().toISOString().slice(8,10)));
  const sharedOffsetX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: selectedDataIndex * segmentWidth, animated: false });
  }, []);

  useEffect(() => {
    console.log("selectedDataIndex", selectedDataIndex);
    if (selectedDataIndex !== undefined) {
      onChangeValue(data[selectedDataIndex].text);
    }
  }, [selectedDataIndex]);

  const handleScroll = ({ nativeEvent }: any, shouldUpdateState = false) => {
    const { x } = nativeEvent.contentOffset;
    sharedOffsetX.value = x;
    if (shouldUpdateState) setSelectedDataIndex(Math.round(x / segmentWidth));
  };
  const handleScrollEnd = ({ nativeEvent }: any) => {
    handleScroll({ nativeEvent }, true);
  };
  const renderItem = (item: any) => (
    <AnimatedItem {...item} sharedOffsetX={sharedOffsetX} />
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        onMomentumScrollEnd={handleScrollEnd}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={segmentWidth}
        style={styles.scrollView}
        onScrollEndDrag={backToDays}
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
      >
        <View style={styles.spacer}></View>
        {data.map(renderItem)}
      </ScrollView>
      <View
        style={{
          width: 70,
          height: 50,
          backgroundColor: "#D9D9D9",
          position: "absolute",
          top: 90,
          left: width / 2 - 35,
          zIndex: 1,
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
  item: {
    alignItems: "center",
    height: scrollHeight,
    width: segmentWidth,
  },
  scrollView: {
    width,
    height: scrollHeight,
  },
  scrollContent: {},
  spacer: {
    width: spacerWidth - segmentSpacing,
    marginRight: segmentSpacing,
  },
});

export default EllipticalScroll;
