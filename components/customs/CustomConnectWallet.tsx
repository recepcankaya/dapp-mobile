import { StyleSheet, View, ViewStyle } from "react-native";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";
import { LinearGradient } from "expo-linear-gradient";
import {heightConstant, radiusConstant, widthConstant} from "../customs/CustomResponsiveScreen";

type CustomConnectWalletProps = {
  style?: ViewStyle;
};

const darkThemeCustom = darkTheme();

const CUSTOM_COLORS = {
  ...darkThemeCustom.colors,
  buttonBackgroundColor: "#EFEEEE",
  buttonTextColor: "#3D3939",
  buttonBorderColor: "transparent",
};

export default function CustomConnectWallet({
  style,
}: CustomConnectWalletProps) {
  return (
    <View style={style}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={["#B80DCA", "#4035CB"]}
        style={styles.gradientBorder}>
        <ConnectWallet
          buttonTitle="Connect Your Wallet"
          modalTitleIconUrl=""
          modalTitle="Connect"
          theme={{
            ...darkThemeCustom,
            colors: {
              ...CUSTOM_COLORS,
            },
          }}
          switchToActiveChain={true}
          hideTestnetFaucet={true}
          displayBalanceToken={{
            80001: "0xB5Ef6aA58dba52fC26eF145C11aaC80b8BAfdEB9",
          }}
          supportedTokens={{
            [80001]: [
              {
                address: "0xB5Ef6aA58dba52fC26eF145C11aaC80b8BAfdEB9",
                name: "LadderIt Test Token 2",
                symbol: "LDTTEST2",
                icon: "",
              },
            ],
          }}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 15*radiusConstant,
    padding: 3*radiusConstant,
  },
});
