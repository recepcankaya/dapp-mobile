import { PixelRatio } from "react-native";

// const fontScale: number = PixelRatio.getFontScale();
// export const getFontSize = (size: number) => {
//   console.log("fontScale", fontScale);
//   console.log("size", size);
//   return size / fontScale;
// };

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const responsiveFontSize = (size: number) => {
  const scale = width / 430;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
