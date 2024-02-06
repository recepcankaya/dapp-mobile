import React, { useContext, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Svg, {
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Path,
  Circle,
  Pattern,
  Use,
  G,
} from "react-native-svg";
import { UserContext } from "./context/UserContext";

import CustomConnectWallet from "./customs/CustomConnectWallet";
import { ThirdwebProvider } from "@thirdweb-dev/react-native";
import axios from "axios";
import { TokenContext } from "./context/TokenContext";
import CustomTextInput from "./customs/CustomTextInput";
import CustomInputReadOnly from "./customs/CustomInputReadOnly";
import {
  heightConstant,
  radiusConstant,
  widthConstant,
} from "./customs/CustomResponsiveScreen";

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const { width, height } = Dimensions.get("window");
const rectWidth = 431.138 * widthConstant + 70;
const rectHeight = 234.943 * heightConstant + 70;

// SVG component for the back icon
const BackIcon = () => (
  <Svg
    width={18 * widthConstant}
    height={28 * heightConstant}
    viewBox="0 0 18 28"
    fill="none"
  >
    <Path
      d="M17.0824 1.04755L2.04125 13.9999L16.9999 27.0474"
      stroke="black"
      strokeWidth="4"
    />
  </Svg>
);
// SVG component for the profile picture circle
const ProfilePicture = () => (
  <Svg
    width={133 * widthConstant}
    height={133 * heightConstant}
    viewBox="0 0 133 133"
    fill="none"
  >
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
        height="1"
      >
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
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#B80DCA" />
        <Stop offset="1" stopColor="#4035CB" />
      </LinearGradient>
    </Defs>
  </Svg>
);

// SVG component for the user icon
const UserIcon = () => (
  <Svg
    width={25 * widthConstant}
    height={25 * heightConstant}
    viewBox="0 0 35 35"
    fill="none"
  >
    <Path
      d="M9.75 10.9375C9.75 5.23392 13.4354 1 17.5 1C21.5646 1 25.25 5.23392 25.25 10.9375C25.25 16.6411 21.5646 20.875 17.5 20.875C13.4354 20.875 9.75 16.6411 9.75 10.9375ZM1 30.625C1 26.5975 4.05072 23.3207 7.94664 22.9088C10.4356 25.5442 13.7939 27.25 17.5 27.25C21.2063 27.25 24.5648 25.544 27.0538 22.9083C30.9845 23.3182 34 26.5926 34 30.625V34H1V30.625Z"
      fill="#D9D9D9"
      stroke="#0C0C0C"
      strokeWidth="2"
    />
  </Svg>
);

// SVG component for the email icon
const EmailIcon = () => (
  <Svg
    width={35 * widthConstant}
    height={35 * heightConstant}
    viewBox="0 0 48 48"
    fill="none"
  >
    <G
      transform="translate(0.000000,48.000000) scale(0.100000,-0.100000)"
      fill="#000000"
    >
      <Path
        d="M36 384 c-9 -8 -16 -28 -16 -44 0 -24 13 -36 101 -94 56 -36 109 -66
        119 -66 10 0 59 27 109 60 l92 60 -3 -97 -3 -98 -195 0 -195 0 -3 83 c-4 105
        -22 108 -22 3 0 -115 -8 -111 220 -111 158 0 191 3 204 16 23 23 23 265 0 288
        -23 24 -385 24 -408 0z m402 -34 c2 -22 -11 -34 -93 -88 -52 -34 -99 -62 -105
        -62 -6 0 -53 28 -105 63 -69 45 -95 68 -95 83 0 11 3 24 7 28 4 3 93 5 197 4
        l191 -3 3 -25z"
      />
    </G>
  </Svg>
);

export default function Profile() {
  const [tempUsername, setTempUsername] = useState("");
  const [email, setEmail] = useState("");
  const { username, setUsername } = useContext(UserContext);
  const { tokens } = useContext(TokenContext);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get("/user/user_detail/", {
          headers: {
            Authorization: `Bearer ${tokens?.access}`,
          },
        });

        if (response.status === 200) {
          setUsername(response.data.username);
          setEmail(response.data.email);
          console.log(tempUsername);
        } else {
          Alert.alert("Error", "Failed to get user details");
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Error",
          "An error occurred while trying to get user details"
        );
      }
    };

    fetchUserDetails();
  }, [username]);

  const changeUsername = async (newUsername: string) => {
    // Trim the newUsername and check if it's not empty
    if (newUsername.trim() === "") {
      Alert.alert("No Changes", "Your username stay same.");
      return;
    }

    try {
      const response = await api.patch(
        "/user/profile_update/",
        {
          username: newUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${tokens?.access}`,
          },
        }
      );

      if (response.status === 200) {
        setUsername(newUsername); // Update the temporary username
        Alert.alert("Success", "Username updated successfully");
        setTempUsername("");
      } else {
        Alert.alert("Error", "Failed to update username");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while trying to update username");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicture}>
        <ProfilePicture />
      </View>
      <Text style={styles.profileText}>Profile</Text>
      <Svg style={styles.svg} fill="none">
        {/* top left rectangle */}
        <Rect
          x={width * 0.25 * widthConstant}
          y={height * 0.48 * heightConstant}
          width={rectWidth * widthConstant}
          height={rectHeight * heightConstant}
          transform={`rotate(151.109 ${
            (width * 0.1 + rectWidth / 2) * widthConstant
          } ${(height * 0.1 + rectHeight / 2) * heightConstant})`}
          fill="url(#paint0_linear_113_6)"
          stroke="url(#paint1_linear_113_6)"
          strokeWidth="3"
        />

        <Defs>
          {/* top left rectangle gradients */}
          <LinearGradient
            id="paint0_linear_113_6"
            x1="597.135"
            y1="0.328125"
            x2="597.135"
            y2="238.271"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#D9D9D9" stopOpacity="0.45" />
            <Stop offset="1" stopColor="#D9D9D9" stopOpacity="0.15" />
          </LinearGradient>
          <LinearGradient
            id="paint1_linear_113_6"
            x1="597.135"
            y1="0.328125"
            x2="597.135"
            y2="238.271"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#B80DCA" />
            <Stop offset="0.0001" stopColor="#4035CB" />
          </LinearGradient>
        </Defs>
      </Svg>
      {/* SVG component for inputs */}
      <View style={styles.rectangles}>
        <View
          style={{
            marginTop: 30 * heightConstant,
            marginBottom: 40 * heightConstant,
            alignItems: "center",
            position: "relative",
          }}
        >
          <CustomTextInput
            secureTextEntry={false}
            placeholder={username}
            value={tempUsername}
            onChangeText={(text) => setTempUsername(text)}
            inputMode="text"
            containerStyle={styles.inputContainer}
          />
          <View
            style={{
              position: "absolute",
              top: 37.5 * heightConstant,
              right: 12.5 * widthConstant,
            }}
          >
            <UserIcon />
          </View>
        </View>
        <View
          style={{
            marginBottom: 40 * heightConstant,
            alignItems: "center",
            position: "relative",
          }}
        >
          <CustomInputReadOnly
            placeholder={email}
            containerStyle={styles.inputContainer}
          />
          <View
            style={{
              position: "absolute",
              top: 12.5 * heightConstant,
              right: 10 * widthConstant,
            }}
          >
            <EmailIcon />
          </View>
        </View>
        <View
          style={{
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            width: 330 * widthConstant,
          }}
        >
          <CustomConnectWallet style={{ width: "100%" }} />
        </View>
        <TouchableOpacity onPress={() => changeUsername(tempUsername)}>
          <View
            style={{
              alignItems: "center",
              marginTop: 40 * heightConstant,
              //left: 0,
            }}
          >
            <Svg
              width={214 * widthConstant}
              height={45 * heightConstant}
              viewBox="0 0 214 45"
              fill="none"
            >
              <Rect
                x="2.5"
                y="2.5"
                width="214"
                height="45"
                rx="22.5"
                fill="#D9D9D9"
                stroke="url(#paint0_linear_114_4)"
                strokeWidth="4"
              />
              <Defs>
                <LinearGradient
                  id="paint0_linear_114_4"
                  x1="173.5"
                  y1="0"
                  x2="173.5"
                  y2="71"
                  gradientUnits="userSpaceOnUse"
                >
                  <Stop stopColor="#B80DCA" />
                  <Stop offset="1" stopColor="#4035CB" />
                </LinearGradient>
              </Defs>
            </Svg>
            <Text
              style={{
                position: "absolute",
                top: 8 * heightConstant,
                //left: 75 * widthConstant,
                //width: "100%",
                color: "#000",
                fontFamily: "Rosarivo",
                fontSize: 18 * radiusConstant,
                fontWeight: "400",
                letterSpacing: 0.44,
              }}
            >
              Update
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  backIcon: {
    position: "absolute",
    top: 30 * heightConstant, // Adjust as needed
    left: 15 * widthConstant, // Adjust as needed
  },
  svg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  profilePicture: {
    marginTop: 70 * heightConstant,
    alignItems: "flex-end",
    marginRight: 25 * widthConstant,
  },
  profileText: {
    marginTop: 40 * heightConstant,
    marginLeft: 55 * widthConstant,
    color: "#EFEEEE",
    fontFamily: "Rosarivo",
    fontSize: 25 * radiusConstant,
    fontWeight: "400",
    letterSpacing: 2,
  },
  rectangles: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    height: 60 * heightConstant,
  },
});
