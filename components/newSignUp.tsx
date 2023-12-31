import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

interface CustomTextProps {
  style: any;
  children: React.ReactNode;
}

const CustomText = (props: CustomTextProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "custom-font": require("../assets/fonts/ZenDots-Regular.ttf"),
      });

      setFontLoaded(true);
    }

    loadFont();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text style={{ ...props.style, fontFamily: "custom-font" }}>
      {props.children}
    </Text>
  );
};

const Register = () => {
  const [registered, setRegistered] = useState(false);

  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const imageHeight = height - statusBarHeight;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("1");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (registered) {
      timer = setTimeout(() => {
        navigation.navigate("LoginInner");
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timer); // cleanup on unmount
  }, [registered, navigation]);

  const handleLogin = () => {
    setTimeout(() => {
      navigation.navigate("LoginInner");
    }, 3000);
  };
  const handleRegister = () => {
    api
      .post("/user/register/", {
        username: username,
        password: password,
        timeZone: timezone,
        email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          setRegistered(true);
          navigation.navigate("LoginInner");
        } else {
          // Handle other status codes here
        }
      })
      .catch((error) => {
        if (error.response.data.email[0] || error.response.data.username[0]) {
          Alert.alert(
            "Error",
            error.response.data.email[0] +
              "\n" +
              error.response.data.username[0]
          );
        } else {
          Alert.alert("Error", error.message);
        }
        console.log(error.response.data.email);
        setErrorMessage(error.message);
      });
  };

  return (
    <>
      <StatusBar backgroundColor="transparent" translucent={true} />
      <View style={styles.container}>
        <LinearGradient
          colors={["#B80DCA", "#4035CB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.circle,
            { width: 650.637, height: 739.49, borderRadius: 739.49 },
          ]}
        />
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Text style={[styles.signUpText, { marginBottom: 15 }]}>Sign Up</Text>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B80DCA", "#4035CB"]}
            style={{
              marginBottom: 15, // 15px below the "Sign Up" text
              width: 302,
              height: 63,
              borderRadius: 10,
              padding: 3, // This will be the width of your border
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 10, // make sure this matches the borderRadius of the LinearGradient
                backgroundColor: "#D9D9D9", // or whatever your button's background color is
                justifyContent: "center", // Center the text vertically
                alignItems: "flex-start", // Center the text horizontally
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  color: "#3D3939",
                  fontFamily: "Inter",
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: "600",
                }}>
                Username
              </Text>
            </View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B80DCA", "#4035CB"]}
            style={{
              marginBottom: 15, // 15px below the "Sign Up" text
              width: 302,
              height: 63,
              borderRadius: 10,
              padding: 3, // This will be the width of your border
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 10, // make sure this matches the borderRadius of the LinearGradient
                backgroundColor: "#D9D9D9", // or whatever your button's background color is
                justifyContent: "center", // Center the text vertically
                alignItems: "flex-start", // Center the text horizontally
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  color: "#3D3939",
                  fontFamily: "Inter",
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: "600",
                  top: 20,
                }}>
                Timezone
              </Text>
              <Picker
                selectedValue={timezone}
                onValueChange={(itemValue, itemIndex) => setTimezone(itemValue)}
                style={styles.input}>
                <Picker.Item label="UTC+1" value="1" />
                <Picker.Item label="UTC+3" value="3" />
                <Picker.Item label="UTC+2" value="2" />
                <Picker.Item label="UTC+4" value="4" />
                <Picker.Item label="UTC+5" value="5" />
              </Picker>
            </View>
          </LinearGradient>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#B80DCA", "#4035CB"]}
            style={{
              marginBottom: 15, // 15px below the "Sign Up" text
              width: 302,
              height: 63,
              borderRadius: 10,
              padding: 3, // This will be the width of your border
            }}>
            <View
              style={{
                flex: 1,
                borderRadius: 10, // make sure this matches the borderRadius of the LinearGradient
                backgroundColor: "#D9D9D9", // or whatever your button's background color is
                justifyContent: "center", // Center the text vertically
                alignItems: "flex-start", // Center the text horizontally
                paddingLeft: 10,
              }}>
              <Text
                style={{
                  color: "#3D3939",
                  fontFamily: "Inter",
                  fontSize: 20,
                  fontStyle: "italic",
                  fontWeight: "600",
                }}>
                Connect Your Wallet
              </Text>
            </View>
          </LinearGradient>
        </View>
        <View style={styles.signUpButtonContainer}>
          <Svg width="158" height="147" viewBox="0 0 177 157" fill="none">
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M109.119 6.28364C125.645 9.54071 136.874 23.7587 151.609 32.0213C167.73 41.0608 191.703 40.3053 199.769 57.1128C207.807 73.8619 191.716 92.3733 189.443 110.861C187.111 129.843 196.896 151.2 186.264 166.995C175.554 182.907 154.52 188.842 135.635 190.807C118.409 192.598 103.331 181.459 86.4893 177.372C68.4574 172.996 47.9926 177.249 33.1719 165.941C17.2693 153.808 5.09061 134.639 4.04704 114.473C3.02277 94.6792 18.9714 79.1193 27.7632 61.4214C36.1565 44.526 39.0109 23.3912 54.5136 12.8845C70.0737 2.33886 90.7526 2.66378 109.119 6.28364Z"
              fill="#0C0C0C"
              stroke="url(#gradient)"
              strokeWidth="7"
            />
            <Defs>
              <SvgLinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#B80DCA" />
                <Stop offset="100%" stopColor="#4035CB" />
              </SvgLinearGradient>
            </Defs>
          </Svg>
          <MaskedView
            style={styles.signUpButtonText}
            maskElement={
              <Text
                style={{
                  fontSize: 34,
                  fontFamily: "Inter",
                  fontStyle: "italic",
                }}>
                Sign Up
              </Text>
            }>
            <LinearGradient
              colors={["#B80DCA", "#4035CB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <Text
                style={{
                  fontSize: 34,
                  fontFamily: "Inter",
                  fontStyle: "italic",
                  opacity: 0,
                }}>
                Sign Up
              </Text>
            </LinearGradient>
          </MaskedView>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0C0C0C", // Set background color to rgba(5, 5, 5, 0.70)
  },
  circle: {
    transform: [{ rotate: "-179.736deg" }],
    borderWidth: 5,
    borderColor: "#B80DCA",
    backgroundColor: "solid",
    position: "absolute",
    top: -545,
    alignSelf: "center",
  },
  signUpText: {
    //position: 'absolute',
    marginTop: 50,
    left: -100,
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "600",
  },
  signUpButtonContainer: {
    position: "absolute",
    right: 0, // Position to the right
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  signUpButtonText: {
    fontFamily: "Inter",
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: "400",
    right: 15,
    bottom: 40,
    position: "absolute",
    zIndex: 1,
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Register;
