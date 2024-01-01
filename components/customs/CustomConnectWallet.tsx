import { View, ViewStyle } from "react-native";
import { ConnectWallet } from "@thirdweb-dev/react-native";
import { Mumbai } from "@thirdweb-dev/chains";

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
        displayBalanceToken={{
          [Mumbai.chainId]: "0x83CA272A33430f3709330c95f64740A1f2dE2c21",
        }}
      />
    </View>
  );
}
