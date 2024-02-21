import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import {
  radiusConstant,
  heightConstant,
  widthConstant,
} from "../CustomResponsiveScreen";

const { width } = Dimensions.get("screen");
const segmentQty = 5;
const segmentWidth = Math.round(width / segmentQty);
const halfWidth = width * 0.5;
const spacerWidth = (width - segmentWidth) / 2;
const segmentSpacing = 25;

const fontSizeMin = 14 * radiusConstant;
const fontSizeChange = 6 * radiusConstant;

const scrollHeight = width * 0.34;
const itemHeight = (fontSizeMin + fontSizeChange) * 2;
const translateYMax = scrollHeight - itemHeight;

const getEllipseYAbs = (x: any, semiX: any, semiY: any) => {
  "worklet";
  return Math.sqrt((1 - (x - semiX) ** 2 / semiX ** 2) * semiY ** 2);
};

const getYOnEllipseDown = (localX: any) => {
  "worklet";
  if (localX < 0 || width < localX) return 0;
  return getEllipseYAbs(localX, halfWidth, translateYMax) + heightConstant;
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

type CalendarAnimationProps = {
  onChangeValue: (value: string) => void;
  backToDays: () => void;
  data: { index: number; key: number; text: string }[];
};

const EllipticalScroll = ({
  data,
  backToDays,
  onChangeValue,
}: CalendarAnimationProps) => {
  // @todo - there is a bug here. Later fix it.
  const [selectedDataIndex, setSelectedDataIndex] = useState(
    data.length === 33 ? data[new Date().getDate() - 1].index : 0
  );
  const sharedOffsetX = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = ({ nativeEvent }: any, shouldUpdateState = false) => {
    const { x } = nativeEvent.contentOffset;
    sharedOffsetX.value = x;
    if (shouldUpdateState) setSelectedDataIndex(Math.round(x / segmentWidth));
  };

  const handleScrollEnd = ({ nativeEvent }: any) => {
    handleScroll({ nativeEvent }, true);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollTo({
      x: selectedDataIndex * segmentWidth,
      animated: false,
    });
  }, []);

  useEffect(() => {
    if (selectedDataIndex !== undefined) {
      onChangeValue(data[selectedDataIndex].text);
    }
  }, [selectedDataIndex]);

  const renderItem = (item: any) => (
    <AnimatedItem {...item} sharedOffsetX={sharedOffsetX} />
  );

  return (
    <View style={styles.container}>
      <ScrollView
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
          width: 70 * widthConstant,
          height: 50 * heightConstant,
          backgroundColor: "#D9D9D9",
          position: "absolute",
          top: scrollHeight - 50 * heightConstant,
          left: width / 2 - (70 * widthConstant) / 2,
          borderRadius: 80 * radiusConstant,
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
    width: width,
    height: scrollHeight,
    zIndex: 10,
  },
  spacer: {
    width: spacerWidth - segmentSpacing,
    marginRight: segmentSpacing,
  },
});

export default EllipticalScroll;
