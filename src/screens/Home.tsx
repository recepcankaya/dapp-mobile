import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Image, FlatList } from "react-native";
import QRCode from "react-qr-code";

import useUserStore from "../store/userStore";
import { heightConstant, widthConstant } from "../ui/responsiveScreen";
import Text from "../ui/customText";
import colors from "../ui/colors";

import supabase from "../lib/supabase";

import useAdminStore from "../store/adminStore";

const logo = require("../assets/LadderLogo.png");

const Home = () => {
  const userID = useUserStore((state) => state.user.id);
  const admin = useAdminStore((state) => state.admin);
  const [userOrderNumber, setUserOrderNumber] = useState<number>(0);

  const fetchUserOrderNumber = async () => {
    try {
      const { data, error } = await supabase.from("user_of_missions").select("number_of_orders").eq("user_id", userID);
      if (error) {
        console.log(error);
      } else {
        setUserOrderNumber(data[0]?.number_of_orders ?? 0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUserOrderNumber();
  }, []);

  const ticketCircles = new Array(admin.numberForReward).fill(userOrderNumber);
  const positions = [
    { top: -50, left: -50 },
    { top: -50, right: -50 },
    { bottom: -50, left: -50 },
    { bottom: -50, right: -50 },
  ];

  const ticketRenderItem = ({ item, index }: { item: any; index: number }) => {
    return <View style={[styles.circle, { backgroundColor: index < userOrderNumber ? colors.green : colors.pink }]} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Image
          resizeMode="contain"
          style={styles.headerImage}
          source={{ uri: admin.brandLogo }}
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
          <FlatList
            data={ticketCircles}
            extraData={ticketCircles}
            renderItem={(item) => ticketRenderItem(item)}
            numColumns={4}
            contentContainerStyle={styles.circles}
            scrollEnabled={false}
          />
          <FlatList
            data={positions}
            renderItem={(item) => <View style={[styles.blackCircles, item.item]} />}
          />
        </View>
      </View>
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCode}>
          <QRCode size={240} value={userID} viewBox={`0 0 240 240`} />
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
    alignItems: "center",
    justifyContent: 'center',
    height: 200 * heightConstant
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

export default Home;
