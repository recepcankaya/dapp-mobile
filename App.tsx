import React from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import LoadingScreen from "./components/LoadingScreen";
import Profile from "./components/Profile";
import AddTask from "./components/AddTask";
import TasksList from "./components/TasksList";
import newLogin from "./components/auth/newLogin";
import newSignUp from "./components/auth/newSignUp";
import { TokenProvider } from "./components/context/TokenContext";
import { UserProvider } from "./components/context/UserContext";
import { MissionProvider } from "./components/context/MissionContext";
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

type TabParamList = {
  Profile: undefined;
  "Add Task": undefined;
  "Tasks List": { taskText: string };
  "Active Missions": undefined;
  LoginInner: undefined;
  Register: undefined;
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
      initialRouteName="Profile"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          {
            display: "flex",
            backgroundColor: "#003172",
          },
          null,
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let isProfile;

          if (route.name === "Add Task") {
            iconName = focused
              ? require("./assets/ic_positive.png")
              : require("./assets/ic_positive.png");
          } else if (route.name === "Profile") {
            iconName = focused
              ? require("./assets/LadderLogo.png")
              : require("./assets/LadderLogo.png");
            isProfile = true;
          } else if (route.name === "Tasks List") {
            iconName = focused
              ? require("./assets/tabbar_addtask.png")
              : require("./assets/tabbar_addtask.png");
          }
          return isProfile ? (
            <LinearGradient
              colors={["#BF00BF", "#0505D5"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 35,
                height: 33,
                flexShrink: 0,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={iconName} style={{ width: 30, height: 30 }} />
            </LinearGradient>
          ) : (
            <Image source={iconName} style={{ width: 25, height: 25 }} />
          );
        },
      })}
    >
      <Tab.Screen name="Add Task" component={AddTask} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Tasks List" component={TasksList} options={{}} />
      <Tab.Screen name="Active Missions" component={ActiveMissions} />
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
        smartWallet(localWallet(), smartWalletConfig),
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
    >
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
                  name="ProfileTab"
                  component={ProfileTabNavigator}
                  options={{ headerShown: false }} // Hide navigation bar on LoginPage
                />
                <Stack.Screen
                  name="newLogin"
                  component={newLogin}
                  options={{ headerShown: false }} // Hide navigation bar 
                />
                <Stack.Screen
                  name="newSignUp"
                  component={newSignUp}
                  options={{ headerShown: false }} // Hide navigation bar
                />
                <Stack.Screen
                  name="Categories"
                  component={Categories}
                  options={{ headerShown: false }} // Hide navigation bar
                />
                <Stack.Screen
                  name="NewProfile"
                  component={NewProfile}
                  options={{ headerShown: false }} // Hide navigation bar 
                />
              </Stack.Navigator>
            </NavigationContainer>
          </MissionProvider>
          </UserIdProvider>
        </UserProvider>
      </TokenProvider>
    </ThirdwebProvider>
  );
}

export default App;
