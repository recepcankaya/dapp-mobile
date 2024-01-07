import { StyleSheet, View, ViewStyle } from "react-native";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react-native";
import { LinearGradient } from "expo-linear-gradient";

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
            80001: "0x83CA272A33430f3709330c95f64740A1f2dE2c21",
          }}
          supportedTokens={{
            [80001]: [
              {
                address: "0x83CA272A33430f3709330c95f64740A1f2dE2c21",
                name: "LadderIt Token Test1",
                symbol: "LDTTEST1",
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
    borderRadius: 10,
    padding: 3,
  },
});
