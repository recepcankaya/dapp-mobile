import { View } from "react-native";
import { Svg, Path } from "react-native-svg";

const ActiveMissionsNegativeIcon = () => {
  return (
    <View>
      <Svg width={37} height={38} viewBox="0 0 37 38" fill="none">
        <Path
          d="M1 13.6667V37H36V13.6667L18.5 2L1 13.6667Z"
          stroke="#D9D9D9"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

export default ActiveMissionsNegativeIcon;
