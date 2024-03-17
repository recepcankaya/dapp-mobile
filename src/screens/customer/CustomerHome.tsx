import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet, Image, FlatList } from "react-native";
import QRCode from "react-qr-code";

import useUserStore from "../../store/userStore";
import { heightConstant, widthConstant } from "../../ui/responsiveScreen";
import Text from "../../ui/customText";
import colors from "../../ui/colors";
import useAdminStore from "../../store/adminStore";
import supabase from "../../lib/supabase";
import { useAddress } from "@thirdweb-dev/react-native";

const logo = require("../../assets/LadderLogo.png");

const positions = [
  { top: -60, left: -60 },
  { top: -60, right: -60 },
  { bottom: -60, left: -60 },
  { bottom: -60, right: -60 },
];

const CustomerHome = () => {
  const [userOrderNumber, setUserOrderNumber] = useState<number>(0);
  const userID = useUserStore((state) => state.user.id);
  const admin = useAdminStore((state) => state.admin);
  const brandLogo = useAdminStore((state) => state.admin.brandLogo);
  const ticketCircles = new Array(admin.numberForReward);

  const customerAddress = useAddress();

  const qrCodeValue = {
    userID,
    forNFT: false,
    address: customerAddress,
  };

  useEffect(() => {
    const orders = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_missions",
          filter: `user_id: eq.${userID}, admin_id: eq.${admin.id}`,
        },
        (payload: any) => {
          setUserOrderNumber(payload.new.number_of_orders);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(orders);
    };
  }, [userOrderNumber]);

  // @todo - renk green' e dönmüyor
  const ticketRenderItem = ({ index }: { index: number }) => {
    return (
      <View
        style={[
          styles.circle,
          {
            backgroundColor:
              index < userOrderNumber ? colors.green : colors.pink,
          },
        ]}
      />
    );
  };

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
          <FlatList
            data={ticketCircles}
            extraData={ticketCircles}
            renderItem={(item) => ticketRenderItem(item)}
            numColumns={4}
            contentContainerStyle={styles.circles}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
      <View style={styles.qrCodeContainer}>
        <View style={styles.qrCode}>
          <QRCode
            size={240}
            value={JSON.stringify(qrCodeValue)}
            viewBox={`0 0 240 240`}
          />
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
    height: "50%",
    backgroundColor: colors.white,
    paddingTop: 10 * heightConstant,
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
    alignItems: "center",
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
