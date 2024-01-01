import { View, ViewStyle } from "react-native";
import { ConnectWallet } from "@thirdweb-dev/react-native";

type CustomConnectWalletProps = {
  style?: ViewStyle;
};

export default function CustomConnectWallet({
  style,
}: CustomConnectWalletProps) {
  return (
    <View style={style}>
      <ConnectWallet
        buttonTitle="Connect Your Wallet"
        modalTitleIconUrl=""
        modalTitle="Connect"
        theme="dark"
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
    </View>
  );
}
