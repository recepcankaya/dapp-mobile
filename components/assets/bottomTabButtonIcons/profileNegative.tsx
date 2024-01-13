import { View } from "react-native";
import { Svg, Path, Circle } from "react-native-svg";

const ProfileNegativeIcon = () => {
  return (
    <View>
      <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
        <Path
          d="M12.4999 13.6897C16.1292 13.6897 19.0713 10.849 19.0713 7.34483C19.0713 3.84068 16.1292 1 12.4999 1C8.8706 1 5.92847 3.84068 5.92847 7.34483C5.92847 10.849 8.8706 13.6897 12.4999 13.6897Z"
          fill="#0C0C0C"
          stroke="#D9D9D9"
          strokeWidth={2}
        />
        <Circle
          cx="12.5"
          cy="7.34483"
          r="4.34483"
          fill="#0C0C0C"
          stroke="#D9D9D9"
          strokeWidth={2}
        />
        <Path
          d="M7.71514 13.6896C7.71514 13.6896 2.91532 14.9201 1.99631 17.349C0.615408 21.0084 1.07253 24 1.07253 24H23.9288C23.9288 24 24.3812 21.0084 23.0051 17.349C22.086 14.9201 17.2862 13.6896 17.2862 13.6896"
          fill="#0C0C0C"
        />
        <Path
          d="M7.71514 13.6896C7.71514 13.6896 2.91532 14.9201 1.99631 17.349C0.615408 21.0084 1.07253 24 1.07253 24H23.9288C23.9288 24 24.3812 21.0084 23.0051 17.349C22.086 14.9201 17.2862 13.6896 17.2862 13.6896"
          stroke="#D9D9D9"
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

export default ProfileNegativeIcon;
