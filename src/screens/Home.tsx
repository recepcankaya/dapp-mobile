import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Image } from "react-native";
import colors from "../ui/colors";
import { heightConstant, widthConstant } from "../ui/responsiveScreen";
import Text from "../ui/customText";
import useBrandStore, { Brand } from "../store/brandStore";
import logo from "../assets/LadderLogo.png";
import QRCode from "react-qr-code";
import supabase from "../lib/supabase";
import { useAddress } from "@thirdweb-dev/react-native";
import { useState } from "react";
import useUserStore from "../store/userStore";

const Home = () => {
  const userID = useUserStore((state) => state.user.id);
  const positions = [
    { top: -50, left: -50 },
    { top: -50, right: -50 },
    { bottom: -50, left: -50 },
    { bottom: -50, right: -50 },
  ];

  const brand: Brand = useBrandStore((state) => state.brand);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          style={styles.headerImage}
          source={{ uri: brand.image }}
        />
        <Image resizeMode="stretch" style={styles.headerImage} source={logo} />
      </View>
      <View style={styles.ticketContainer}>
        <View style={styles.ticketText}>
          <Text text="Your Ticket" />
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
          <QRCode size={256} value={userID} viewBox={`0 0 256 256`} />
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
    borderBottomColor: colors.purple,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  headerImage: {
    height: 85 * widthConstant,
    width: 85 * widthConstant,
    borderWidth: 1,
    borderColor: colors.purple,
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
    height: 320 * heightConstant,
    width: 320 * heightConstant,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
});

export default Home;
