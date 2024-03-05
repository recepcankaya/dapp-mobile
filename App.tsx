import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  trustWallet,
  rainbowWallet,
  walletConnect,
  embeddedWallet,
} from "@thirdweb-dev/react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  Brands,
  CustomerHome,
  Login,
  UserInfo,
  Profile,
} from "./src/screens/customer";
import { AdminCamera, AdminHome, AdminLogin } from "./src/screens/admin";
import colors from "./src/ui/colors";
import { Image } from "react-native";

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
          if (route.name === "Home") {
            iconName = focused
              ? require("../dapp-mobile/src/assets/customer-home-icon.png")
              : require("../dapp-mobile/src/assets/inactive-customer-home-icon.png");
          } else if (route.name === "Profile") {
            iconName = focused
              ? require("../dapp-mobile/src/assets/profile-icon.png")
              : require("../dapp-mobile/src/assets/inactive-profile-icon.png");
          }
          return <Image source={iconName} />;
        },
      })}>
      <TabStack.Screen name="Home" component={CustomerHome} />
      <TabStack.Screen name="Profile" component={Profile} />
    </TabStack.Navigator>
  );
};

function App() {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      // clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
      clientId="03398793b650e4108bc269aa59a8db69"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
        trustWallet(),
        rainbowWallet(),

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
            name="Brands"
            component={Brands}
            options={{ headerShown: false }} // Hide navigation bar
          />
          <Stack.Screen
            name="TabNavigator"
            component={TabNavigator}
            options={{ headerShown: false }} // Hide navigation bar
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThirdwebProvider>
  );
}

export default App;
