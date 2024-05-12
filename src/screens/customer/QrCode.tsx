import { useAddress } from "@thirdweb-dev/react-native";
import { Alert, StyleSheet, View } from "react-native";
import QRCode from "react-qr-code";

import useUserStore from "../../store/userStore";
import colors from "../../ui/colors";
import { useEffect } from "react";
import useBrandBranchStore from "../../store/brandBranchStore";

const QrCode = () => {
  const userId = useUserStore((state) => state.user.id);
  const brandBranchId = useBrandBranchStore((state) => state.brandBranch.id);

  useEffect(() => {
    console.log('userId', userId, 'brandBranchId', brandBranchId)
  }, [userId, brandBranchId])

  useEffect(() => {
    if (!brandBranchId) {
      Alert.alert('Hata', 'QR kod oluşturulurken bir hata oluştu. Lütfen öncelikle bir marka seçer misiniz. 👉👈')
    }
  }, [brandBranchId])

  const qrCodeValue = {
    userID: userId,
    brandBranchID: brandBranchId,
    forNFT: false,
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
