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

import Login from "./src/screens/customer/Login";
import UserInfo from "./src/screens/customer/UserInfo";
import Brands from "./src/screens/customer/Brands";
import AdminLogin from "./src/screens/admin/AdminLogin";
import AdminHome from "./src/screens/admin/AdminHome";
import AdminCamera from "./src/screens/admin/AdminCamera";
import CustomerHome from "./src/screens/customer/CustomerHome";
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
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: colors.purple,
        headerBackgroundContainerStyle: { borderWidth: 0 },
        tabBarStyle: {
          backgroundColor: colors.white,
          paddingTop: 10,
          borderTopColor: colors.pink,
          borderTopWidth: 3,
        },
        tabBarLabelStyle: { color: colors.black },
      })}>
      <TabStack.Screen name="Home" component={CustomerHome} />
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
