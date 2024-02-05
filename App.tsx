import React from "react";
import { Dimensions, Image, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./components/LoadingScreen";
import AddTask from "./components/AddTask";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import { TokenProvider } from "./components/context/TokenContext";
import { UserProvider } from "./components/context/UserContext";
import { MissionProvider } from "./components/context/MissionContext";
import { PasswordTokenProvider } from "./components/context/PasswordTokenContext";
import { Svg, Defs, LinearGradient, Stop, Path, Mask } from "react-native-svg";
import { UserIdProvider } from "./components/context/UserIdContext";
import {
  ThirdwebProvider,
  smartWallet,
  metamaskWallet,
  coinbaseWallet,
  trustWallet,
  rainbowWallet,
  walletConnect,
  embeddedWallet,
  localWallet,
} from "@thirdweb-dev/react-native";
import ActiveMissions from "./components/ActiveMissions";
import Profile from "./components/Profile";
import Categories from "./components/Categories";
import {
  ActiveMissionsNegativeIcon,
  ActiveMissionsPositiveIcon,
  CategoriesNegativeIcon,
  CategoriesPositiveIcon,
  ProfileNegativeIcon,
  ProfilePositiveIcon,
} from "./components/assets/bottomTabButtonIcons";
import EmailConfirmation from "./components/auth/forgotPassword/EmailConfirmation";
import ResetConfirmation from "./components/auth/forgotPassword/ResetConfirmation";
import ResetPassword from "./components/auth/forgotPassword/ResetPassword";

const { height, width } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

type TabParamList = {
  Profile: undefined;
  "Add Task": undefined;
  "Tasks List": { taskText: string };
  "Active Missions": undefined;
  Login: undefined;
  signup: undefined;
  Categories: undefined;
};

/**
 * Since we are using ERC4337 for Account Abstraction, this is the configuration object for it
 */
const smartWalletConfig = {
  factoryAddress: "0x8317579CeFC6c4FCA25D6ba68F7939B34Ef20eF7",
  gasless: true,
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<TabParamList>();

function ProfileTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Active Missions"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          {
            backgroundColor: "#0C0C0C",
            position: "absolute",
            bottom: height >= 812 && Platform.OS === "ios" ? 34 : 0,
            alignItems: "center",
            justifyContent: "center",
            borderBlockColor: "#0C0C0C",
            height: height >= 812 && Platform.OS === "ios" ? 140 : 100,
          },
          null,
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let isProfile;
          let isActiveMissions;
          let isCategories;

          if (route.name === "Categories") {
            isCategories = true;
            isActiveMissions = false;
            isProfile = false;
          } else if (route.name === "Profile") {
            isProfile = true;
            isActiveMissions = false;
            isCategories = false;
          } else if (route.name === "Active Missions") {
            isActiveMissions = true;
            isProfile = false;
            isCategories = false;
          }
          return (
            <View
              style={{
                flex: 1,
                justifyContent: isActiveMissions ? "flex-start" : "flex-end",
                margin: isActiveMissions ? 15 : 25,
              }}>
              {focused
                ? isProfile
                  ? ProfilePositiveIcon()
                  : isCategories
                    ? CategoriesPositiveIcon()
                    : isActiveMissions
                      ? ActiveMissionsPositiveIcon()
                      : ProfileNegativeIcon()
                : isProfile
                  ? ProfileNegativeIcon()
                  : isCategories
                    ? CategoriesNegativeIcon()
                    : isActiveMissions
                      ? ActiveMissionsNegativeIcon()
                      : ProfileNegativeIcon()}
            </View>
          );
        },
        tabBarBackground() {
          return (
            <View
              style={{
                height: height >= 812 && Platform.OS === "ios" ? 174 : 140,
                backgroundColor: "#0C0C0C",
              }}>
              <Svg width={width} height={124} viewBox="0 0 430 124" fill="none">
                <Defs>
                  <LinearGradient
                    id="paint0_linear_65_3186"
                    x1="215.5"
                    y1="0"
                    x2="215.5"
                    y2="332"
                    gradientUnits="userSpaceOnUse">
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
              </Svg>
            </View>
          );
        },
      })}>
      <Tab.Screen name="Categories" component={Categories} />
      <Tab.Screen name="Active Missions" component={ActiveMissions} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
function App() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
      supportedWallets={[
        smartWallet(metamaskWallet({ recommended: true }), smartWalletConfig),
        smartWallet(coinbaseWallet({ recommended: true }), smartWalletConfig),
        smartWallet(walletConnect(), smartWalletConfig),
        smartWallet(trustWallet(), smartWalletConfig),
        smartWallet(rainbowWallet(), smartWalletConfig),
        // smartWallet(localWallet(), smartWalletConfig),
        smartWallet(
          embeddedWallet({
            auth: {
              // you need to enable EmbeddedWallets under your API Key in your thirdweb dashboard:
              // https://thirdweb.com/dashboard/settings/api-keys
              options: ["email", "google"],
              // you need to add this deeplink in your allowed `Redirect URIs` under your API Key in your thirdweb dashboard:
              // https://thirdweb.com/dashboard/settings/api-keys
              redirectUrl: "rnstarter://",
            },
          }),
          smartWalletConfig
        ),
      ]}
      autoConnect={true}>
      <PasswordTokenProvider>
        <TokenProvider>
          <UserProvider>
            <UserIdProvider>
              <MissionProvider>
                <NavigationContainer>
                  <Stack.Navigator initialRouteName="ProfileTab">
                    <Stack.Screen
                      name="Loading"
                      component={LoadingScreen}
                      options={{ headerShown: false }} // Hide navigation bar on LoadingScreen
                    />
                    <Stack.Screen
                      name="Login"
                      component={Login}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="Email Confirmation"
                      component={EmailConfirmation}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="Reset Confirmation"
                      component={ResetConfirmation}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="Reset Password"
                      component={ResetPassword}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="Sign up"
                      component={Signup}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="ProfileTab"
                      component={ProfileTabNavigator}
                      options={{ headerShown: false }} // Hide navigation bar on LoginPage
                    />
                    <Stack.Screen
                      name="Categories"
                      component={Categories}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="Add Task"
                      component={AddTask}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                    <Stack.Screen
                      name="Profile"
                      component={Profile}
                      options={{ headerShown: false }} // Hide navigation bar
                    />
                  </Stack.Navigator>
                </NavigationContainer>
              </MissionProvider>
            </UserIdProvider>
          </UserProvider>
        </TokenProvider>
      </PasswordTokenProvider>
    </ThirdwebProvider>
  );
}

export default App;
