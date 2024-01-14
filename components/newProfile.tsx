import React, { useContext } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Pattern,
  Use,
} from "react-native-svg";
import { UserContext } from "./context/UserContext";
import CustomConnectWallet from "./customs/CustomConnectWallet";
import { ThirdwebProvider } from "@thirdweb-dev/react-native";

//const { username, setUsername } = useContext(UserContext);

const { width, height } = Dimensions.get("window");
const rectWidth = 431.138;
const rectHeight = 234.943;

// SVG component for the back icon
const BackIcon = () => (
  <Svg width="18" height="28" viewBox="0 0 18 28" fill="none">
    <Path
      d="M17.0824 1.04755L2.04125 13.9999L16.9999 27.0474"
      stroke="black"
      strokeWidth="4"
    />
  </Svg>
);
// SVG component for the profile picture circle
const ProfilePicture = () => (
  <Svg width="103" height="103" viewBox="0 0 133 133" fill="none">
    <Circle
      cx="66.5"
      cy="66.5"
      r="65"
      fill="url(#pattern0)"
      stroke="url(#paint0_linear_113_7)"
      strokeWidth="3"
    />
    <Defs>
      <Pattern
        id="pattern0"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1">
        <Use
          xlinkHref="#image0_113_7"
          transform="translate(0 -0.244186) scale(0.00581395)"
        />
      </Pattern>
      <LinearGradient
        id="paint0_linear_113_7"
        x1="66.5"
        y1="0"
        x2="66.5"
        y2="133"
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#B80DCA" />
        <Stop offset="1" stopColor="#4035CB" />
      </LinearGradient>
    </Defs>
  </Svg>
);

// SVG component for the user icon
const UserIcon = () => (
  <Svg width="35" height="35" viewBox="0 0 35 35" fill="none">
    <Path
      d="M9.75 10.9375C9.75 5.23392 13.4354 1 17.5 1C21.5646 1 25.25 5.23392 25.25 10.9375C25.25 16.6411 21.5646 20.875 17.5 20.875C13.4354 20.875 9.75 16.6411 9.75 10.9375ZM1 30.625C1 26.5975 4.05072 23.3207 7.94664 22.9088C10.4356 25.5442 13.7939 27.25 17.5 27.25C21.2063 27.25 24.5648 25.544 27.0538 22.9083C30.9845 23.3182 34 26.5926 34 30.625V34H1V30.625Z"
      fill="#D9D9D9"
      stroke="#0C0C0C"
      strokeWidth="2"
    />
  </Svg>
);

// SVG component for the timezone-location icon
const TimezoneIcon = () => (
  <Svg width="35" height="35" viewBox="0 0 37 38" fill="none">
    <Path
      d="M1 15C1 29 18.5 36 18.5 36C18.5 36 36 29 36 15C36 7.27083 28.1688 1 18.5 1C8.83125 1 1 7.27083 1 15Z"
      stroke="#0C0C0C"
      strokeWidth="2"
    />
    <Path
      d="M18.5 19.7833C21.8247 19.7833 24.52 17.5373 24.52 14.7667C24.52 11.996 21.8247 9.75 18.5 9.75C15.1752 9.75 12.48 11.996 12.48 14.7667C12.48 17.5373 15.1752 19.7833 18.5 19.7833Z"
      stroke="#0C0C0C"
      strokeWidth="2"
    />
  </Svg>
);

// SVG component for the wallet icon
const WalletIcon = () => (
  <Svg width="35" height="35" viewBox="0 0 35 35" fill="none">
    <Path
      d="M8.78277 9.75H9.78277V8.75V4.375C9.78277 2.51986 11.3025 1 13.1523 1H21.8914C23.7412 1 25.2609 2.51986 25.2609 4.375V8.75V9.75H26.2609H34V19.6875C34 20.3614 33.4852 20.875 32.8152 20.875H2.22846C1.55846 20.875 1.0437 20.3614 1.0437 19.6875V9.75H8.78277ZM13.1523 3.375H12.1523V4.375V8.75V9.75H13.1523H21.8914H22.8914V8.75V4.375V3.375H21.8914H13.1523ZM1.0437 34V27.1491C1.40346 27.2113 1.78267 27.25 2.18477 27.25H32.7715C33.1822 27.25 33.5746 27.2186 33.9563 27.1561V34H1.0437Z"
      fill="#D9D9D9"
      stroke="#0C0C0C"
      strokeWidth="2"
    />
  </Svg>
);

export default function NewProfile() {
  return (
    <ThirdwebProvider theme="light">
      <View style={styles.container}>
        <View style={styles.backIcon}>
          <BackIcon />
        </View>
        <View style={styles.profilePicture}>
          <ProfilePicture />
        </View>
        <Text style={styles.profileText}>Profile</Text>
        <Svg style={styles.svg} fill="none">
          {/* top left rectangle */}
          <Rect
            x={width * 0.25}
            y={height * 0.48}
            width={rectWidth}
            height={rectHeight}
            transform={`rotate(151.109 ${width * 0.1 + rectWidth / 2} ${
              height * 0.1 + rectHeight / 2
            })`}
            fill="url(#paint0_linear_113_6)"
            stroke="url(#paint1_linear_113_6)"
            strokeWidth="3"
          />
          {/* bottom right rectangle */}
          <Rect
            x={width * 0.75 - rectWidth}
            y={height * 0.52 - rectHeight}
            width={rectWidth}
            height={rectHeight}
            transform={`rotate(151.109 ${width * 0.9 - rectWidth / 2} ${
              height * 0.9 - rectHeight / 2
            })`}
            fill="url(#paint0_linear_113_5)"
            stroke="url(#paint1_linear_113_5)"
            strokeWidth="2"
          />
          <Defs>
            {/* top left rectangle gradients */}
            <LinearGradient
              id="paint0_linear_113_6"
              x1="597.135"
              y1="0.328125"
              x2="597.135"
              y2="238.271"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#D9D9D9" stopOpacity="0.45" />
              <Stop offset="1" stopColor="#D9D9D9" stopOpacity="0.15" />
            </LinearGradient>
            <LinearGradient
              id="paint1_linear_113_6"
              x1="597.135"
              y1="0.328125"
              x2="597.135"
              y2="238.271"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#B80DCA" />
              <Stop offset="0.0001" stopColor="#4035CB" />
            </LinearGradient>
            {/* bottom right rectangle gradients */}
            <LinearGradient
              id="paint0_linear_113_5"
              x1="217.069"
              y1="238.238"
              x2="217.069"
              y2="476.181"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#D9D9D9" stopOpacity="0.15" />
              <Stop offset="1" stopColor="#D9D9D9" stopOpacity="0.65" />
            </LinearGradient>
            <LinearGradient
              id="paint1_linear_113_5"
              x1="217.069"
              y1="238.238"
              x2="217.069"
              y2="476.181"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#B80DCA" />
              <Stop offset="1" stopColor="#4035CB" />
            </LinearGradient>
          </Defs>
        </Svg>
        {/* SVG component for inputs */}
        <View style={styles.rectangles}>
          <View style={{ marginBottom: 15, position: "relative" }}>
            <Svg width="307" height="62" viewBox="0 0 347 71" fill="none">
              <Rect
                x="1.5"
                y="1.5"
                width="344"
                height="68"
                rx="18.5"
                fill="#D9D9D9"
                stroke="url(#paint0_linear_114_4)"
                strokeWidth="3"
              />
              <Defs>
                <LinearGradient
                  id="paint0_linear_114_4"
                  x1="173.5"
                  y1="0"
                  x2="173.5"
                  y2="71"
                  gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#B80DCA" />
                  <Stop offset="1" stopColor="#4035CB" />
                </LinearGradient>
              </Defs>
            </Svg>
            <Text
              style={{
                position: "absolute",
                top: 15,
                left: 20,
                width: 144,
                height: 35,
                color: "#000",
                fontFamily: "Rosarivo",
                fontSize: 22,
                fontWeight: "400",
                letterSpacing: 0.44,
              }}>
              User name
            </Text>
            <View style={{ position: "absolute", top: 15, right: 10 }}>
              <UserIcon />
            </View>
          </View>
          <View style={{ marginBottom: 15, position: "relative" }}>
            <Svg width="307" height="62" viewBox="0 0 347 71" fill="none">
              <Rect
                x="1.5"
                y="1.5"
                width="344"
                height="68"
                rx="18.5"
                fill="#D9D9D9"
                stroke="url(#paint0_linear_114_4)"
                strokeWidth="3"
              />
              <Defs>
                <LinearGradient
                  id="paint0_linear_114_4"
                  x1="173.5"
                  y1="0"
                  x2="173.5"
                  y2="71"
                  gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#B80DCA" />
                  <Stop offset="1" stopColor="#4035CB" />
                </LinearGradient>
              </Defs>
            </Svg>
            <Text
              style={{
                position: "absolute",
                top: 15,
                left: 20,
                width: 257,
                color: "#000",
                fontFamily: "Rosarivo",
                fontSize: 22,
                fontWeight: "400",
                letterSpacing: 0.44,
              }}>
              Location/ Timezone
            </Text>
            <View style={{ position: "absolute", top: 15, right: 10 }}>
              <TimezoneIcon />
            </View>
          </View>
          <View style={{ marginBottom: 15, position: "relative" }}>
            <Svg width="307" height="62" viewBox="0 0 347 71" fill="none">
              <Rect
                x="1.5"
                y="1.5"
                width="344"
                height="68"
                rx="18.5"
                fill="#D9D9D9"
                stroke="url(#paint0_linear_114_4)"
                strokeWidth="3"
              />
              <Defs>
                <LinearGradient
                  id="paint0_linear_114_4"
                  x1="173.5"
                  y1="0"
                  x2="173.5"
                  y2="71"
                  gradientUnits="userSpaceOnUse">
                  <Stop stopColor="#B80DCA" />
                  <Stop offset="1" stopColor="#4035CB" />
                </LinearGradient>
              </Defs>
            </Svg>
            <View style={{ position: "absolute", top: 2, left: 5 }}>
              <CustomConnectWallet />
            </View>
            <View style={{ position: "absolute", top: 15, right: 10 }}>
              <WalletIcon />
            </View>
          </View>
        </View>
      </View>
    </ThirdwebProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  backIcon: {
    position: "absolute",
    top: 30, // Adjust as needed
    left: 15, // Adjust as needed
  },
  svg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  profilePicture: {
    position: "absolute",
    top: 70, // 77px from the top
    right: 25, // 50px from the right
  },
  profileText: {
    position: "absolute",
    top: 195, // 250px from the top
    left: 45, // 45px from the left
    width: 158,
    height: 41,
    color: "#FFF",
    fontFamily: "Rosarivo",
    fontSize: 18,
    fontWeight: "400",
    letterSpacing: 2,
  },
  rectangles: {
    position: "absolute",
    top: 195 + 40, // 40px below the "Profile" text
    left: 25, // Aligned -15 px with the "Profile" text
  },
});
