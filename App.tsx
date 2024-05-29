import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThirdwebProvider, embeddedWallet } from "@thirdweb-dev/react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/AntDesign";

import {
  Brands,
  CustomerHome,
  Login,
  UserInfo,
  Profile,
  Loading,
  QrCode,
} from "./src/screens/customer";
import { AdminCamera, AdminHome, AdminLogin } from "./src/screens/admin";
import colors from "./src/ui/colors";

/**
 * Since we are using ERC4337 for Account Abstraction, this is the configuration object for it
 */
// const smartWalletConfig = {
//   factoryAddress: "0x8317579CeFC6c4FCA25D6ba68F7939B34Ef20eF7",
//   gasless: true,
// };

const Stack = createNativeStackNavigator();
const TabStack = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <TabStack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        headerBackgroundContainerStyle: { borderWidth: 0 },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.pink,
          borderTopWidth: 3,
        },
        tabBarLabelStyle: { color: colors.black },
        tabBarIcon: ({ focused }) => {
          let iconName;
          if (route.name === "Brands") {
            iconName = focused
              ? require("./src/assets/brands-icon.png")
              : require("./src/assets/inactive-brands-icon.png");
          } else if (route.name === "Profile") {
            iconName = focused
              ? require("./src/assets/profile-icon.png")
              : require("./src/assets/inactive-profile-icon.png");
          } else if (route.name === "Home") {
            iconName = focused
              ? require("./src/assets/customer-home-icon.png")
              : require("./src/assets/inactive-customer-home-icon.png");
          } else if (route.name === "QrCode") {
            iconName = focused
              ? require("./src/assets/qr-code.png")
              : require("./src/assets/qr-code.png");
          }
          return <Image source={iconName} />;
        },
      })}>
      <TabStack.Screen name="Brands" component={Brands} />
      <TabStack.Screen name="Home" component={CustomerHome} />
      <TabStack.Screen name="QrCode" component={QrCode} />
      <TabStack.Screen name="Profile" component={Profile} />
    </TabStack.Navigator>
  );
};

function App() {
  return (
    <ThirdwebProvider
      activeChain="polygon"
      // clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
      clientId="9cf2156f9e78bdaaecbcef17707d78ad"
      supportedWallets={[
        // !!! There is a problem with SIWE for EOA wallets, so we are not using it for now !!!

        // metamaskWallet(),
        // coinbaseWallet(),
        // walletConnect(),
        // trustWallet(),
        // rainbowWallet(),

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
      ]}
      autoConnect={true}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Loading"
            component={Loading}
            options={{ headerShown: false }} // Hide navigation bar
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }} // Hide navigation bar
          />
          <Stack.Screen
            name="Admin Login"
            component={AdminLogin}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Admin Home"
            component={AdminHome}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Admin Camera"
            component={AdminCamera}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="User Info"
            component={UserInfo}
            options={{ headerShown: false }} // Hide navigation bar
          />
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{ headerShown: false }} // Hide navigation bar
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </ThirdwebProvider>
  );
}

export default App;
