import { View } from "react-native";
import { Svg, Path, Line } from "react-native-svg";

const CategoriesNegativeIcon = () => {
  return (
    <View>
      <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
        <Path
          d="M10.4706 20.7143C15.7011 20.7143 19.9412 16.3011 19.9412 10.8571C19.9412 5.41319 15.7011 1 10.4706 1C5.24013 1 1 5.41319 1 10.8571C1 16.3011 5.24013 20.7143 10.4706 20.7143Z"
          stroke="#EFEEEE"
          strokeWidth={2}
        />
        <Line
          x1="24"
          y1="24"
          x2="17.2354"
          y2="17.4286"
          stroke="#EFEEEE"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

export default CategoriesNegativeIcon;
