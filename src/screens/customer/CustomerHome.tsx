import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Image } from "react-native";
import QRCode from "react-qr-code";

import useBrandStore, { Brand } from "../../store/brandStore";
import useUserStore from "../../store/userStore";
import { heightConstant, widthConstant } from "../../ui/responsiveScreen";
import Text from "../../ui/customText";
import colors from "../../ui/colors";
import { useAddress } from "@thirdweb-dev/react-native";
import useAdminStore from "../../store/adminStore";

const logo = require("../../assets/LadderLogo.png");

const CustomerHome = () => {
  const userID = useUserStore((state) => state.user.id);
  const brandLogo = useAdminStore((state) => state.admin.brandLogo);

  const positions = [
    { top: -50, left: -50 },
    { top: -50, right: -50 },
    { bottom: -50, left: -50 },
    { bottom: -50, right: -50 },
  ];

  const qrCodeValue = {
    userId,
    forNFT: false
  }

  const brand: Brand = useBrandStore((state) => state.brand);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          style={styles.headerImage}
          source={{
            uri: brandLogo.replace("ipfs://", "https://ipfs.io/ipfs/"),
          }}
        />
        <Image resizeMode="stretch" style={styles.headerImage} source={logo} />
      </View>
      <View style={styles.ticketContainer}>
        <View style={styles.ticketText}>
          <Text text="Süreciniz" />
        </View>
        <View style={styles.ticket}>
          {positions.map((position, index) => (
            <View key={index} style={[styles.blackCircles, position]} />
          ))}
          <View style={styles.circles}>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
          </View>
          <View style={styles.circles}>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
            <View style={styles.circle}></View>
          </View>
        </View>
      </View>
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCode}>
          <QRCode size={240} value={JSON.stringify(qrCodeValue)} viewBox={`0 0 240 240`} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  header: {
    height: 100 * heightConstant,
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.pink,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  headerImage: {
    height: 85 * widthConstant,
    width: 85 * widthConstant,
    borderWidth: 1,
    borderColor: colors.pink,
    borderRadius: 20,
  },
  ticketContainer: {
    flex: 1,
  },
  ticketText: {
    padding: 20,
    zIndex: 1,
  },
  ticket: {
    width: "100%",
    height: 200 * heightConstant,
    backgroundColor: colors.white,
  },
  blackCircles: {
    position: "absolute",
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: colors.black,
  },
  circles: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    backgroundColor: colors.pink,
    height: 75 * widthConstant,
    width: 75 * widthConstant,
    borderRadius: 40,
    margin: 3,
  },
  qrCodeContainer: {
    flex: 1,
    alignSelf: "center",
  },
  qrCode: {
    height: 340 * heightConstant,
    width: 340 * heightConstant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});

export default CustomerHome;
