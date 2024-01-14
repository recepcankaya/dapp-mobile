import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Svg, Defs, LinearGradient, Stop, Path, Mask } from "react-native-svg";
import Profile from "../Profile";
import ActiveMissions from "../ActiveMissions";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

function MyTabBar({ state, descriptors, navigation }: any) {
  console.log("state, descriptors, navigation", state);
  return (
    <View style={styles.container}>
      <Svg width={430} height={124} viewBox="0 0 430 124" fill="none">
        <Defs>
          <LinearGradient
            id="paint0_linear_65_3186"
            x1="215.5"
            y1="0"
            x2="215.5"
            y2="332"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#B80DCA" />
            <Stop offset="1" stopColor="#4035CB" />
          </LinearGradient>
        </Defs>
        <Mask id="path-1-inside-1_65_3186" fill="white">
          <Path
            d="M455 166C455 121.974 429.767 79.7513 384.852 48.6203C339.937 17.4892 279.019 3.32387e-06 215.5 0C151.981 -3.32387e-06 91.0629 17.4892 46.1479 48.6203C1.23298 79.7513 -24 121.974 -24 166L215.5 166H455Z"
            fill="white"
          />
        </Mask>
        <Path
          d="M455 166C455 121.974 429.767 79.7513 384.852 48.6203C339.937 17.4892 279.019 3.32387e-06 215.5 0C151.981 -3.32387e-06 91.0629 17.4892 46.1479 48.6203C1.23298 79.7513 -24 121.974 -24 166L215.5 166H455Z"
          fill="#0C0C0C"
          stroke="url(#paint0_linear_65_3186)"
          strokeWidth={10}
          mask="url(#path-1-inside-1_65_3186)"
        />
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, height: 20, width: 50, backgroundColor: "red" }}
            >
              <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 140,
    backgroundColor: "#0C0C0C",
  },
});

export default MyTabBar;
