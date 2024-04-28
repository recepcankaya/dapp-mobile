import { useAddress } from "@thirdweb-dev/react-native";
import { StyleSheet, View } from "react-native";
import QRCode from "react-qr-code";

import useUserStore from "../../store/userStore";
import colors from "../../ui/colors";

const QrCode = () => {
  const userId = useUserStore((state) => state.user.id);
  const customerAddress = useAddress();

  const qrCodeValue = {
    userID: userId,
    adminID: "",
    forNFT: false,
    address: customerAddress,
  };

  return (
    <View style={styles.container}>
      <View style={styles.qrCode}>
        <QRCode
          size={256}
          value={JSON.stringify(qrCodeValue)}
          viewBox={`0 0 256 256`}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  qrCode: {
    padding: 30,
    borderColor: colors.purple,
    borderWidth: 5,
    borderRadius: 20,
  },
});

export default QrCode;
