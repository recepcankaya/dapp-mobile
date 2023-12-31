import { useState, useEffect, useContext } from "react";
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
  Button,
} from "react-native";
import * as Font from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import { TokenContext } from "./context/TokenContext";
import { UserContext } from "./context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";

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

type TabParamList = {
  LoginInner: { access?: string; refresh?: string };
  // other tabs...
};

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

const LoginInner = () => {
  const handleUsernameChange = (text: string) => {
    setUsername_x(text);
    setUsername(text);
  };
  const windowWidth = Dimensions.get("window").width;

  const [loggedIn, setLoggedIn] = useState(false);

  const { height } = Dimensions.get("window");
  const statusBarHeight = StatusBar.currentHeight || 0;
  const imageHeight = height - statusBarHeight;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [errorMessage, setErrorMessage] = useState(null);

  const [username_x, setUsername_x] = useState("");
  const [password_x, setPassword_x] = useState("");

  const { username, setUsername } = useContext(UserContext);

  const { setTokens } = useContext(TokenContext);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (loggedIn) {
      timer = setTimeout(() => {
        navigation.navigate("ProfileTab");
      }, 3000); // 3 seconds
    }

    return () => clearTimeout(timer); // cleanup on unmount
  }, [loggedIn, navigation]);

  const handleLogin = () => {
    api
      .post("/auth/get_token/", {
        password: password_x,
      })
      .then((response) => {
        if (response.status === 200) {
          setLoggedIn(true);
          setTokens({
            access: response.data.access,
            refresh: response.data.refresh,
          });
          navigation.navigate("ProfileTab");
        } else {
          // Handle other status codes here
        }
      })
      .catch((error) => {
        console.log(error.response.data);
        Alert.alert("Error", error.message);
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
        <View style={styles.walletContainer}>
          <Text style={styles.loginText}>Login</Text>
          <ConnectWallet
            buttonTitle="Login"
            modalTitleIconUrl=""
            modalTitle="Connect Your Wallet"
            theme="dark"
          />
        </View>
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don`t you have account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("newSignUp")}>
            <MaskedView
              style={{ flexDirection: "row" }}
              maskElement={<Text style={styles.signupButton}>Sign up!</Text>}>
              <LinearGradient
                colors={["#B80DCA", "#4035CB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                <Text style={[styles.signupButton, { opacity: 0 }]}>
                  Sign up!
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </View>
        <View style={styles.loginButtonContainer}>
          <Svg width="168" height="157" viewBox="0 0 177 157" fill="none">
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
            style={styles.loginButtonText}
            maskElement={
              <Text
                style={{
                  fontSize: 34,
                  fontFamily: "Inter",
                  fontStyle: "italic",
                }}>
                Login
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
                Login
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
    alignItems: "center",
    backgroundColor: "#0C0C0C",
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
  background: {
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  walletContainer: {
    marginTop: 350,
    width: "80%",
  },
  loginText: {
    marginBottom: 39,
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 25,
    fontStyle: "italic",
    fontWeight: "600",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 417,
    height: 72,
    borderRadius: 42,
    backgroundColor: "#AD00D1",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Position the button absolutely
    bottom: 0,
  },
  signupContainer: {
    flexDirection: "row", // Arrange the text and button horizontally
    justifyContent: "center", // Center the text and button horizontally
    alignItems: "center", // Center the text and button vertically
    marginTop: 120,
  },
  signupText: {
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
  },
  signupButton: {
    color: "#FFF", // The text color will be white because the gradient background is not supported
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
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
  loginButtonContainer: {
    position: "absolute",
    right: 0, // Position to the right
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  loginButtonText: {
    fontFamily: "Inter",
    fontSize: 22,
    fontStyle: "italic",
    fontWeight: "400",
    right: 30,
    bottom: 40,
    position: "absolute",
    zIndex: 1,
  },
});

export default LoginInner;
