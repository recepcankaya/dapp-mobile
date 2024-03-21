import { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Pressable,
} from "react-native";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import useAdminForAdminStore from "../../store/adminStoreForAdmin";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../ui/colors";
import supabase, { secretSupabase } from "../../lib/supabase";

const AdminCamera = () => {
  const adminID = useAdminForAdminStore((state) => state.admin.adminId);
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  let qrCodeValue = [];

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) return <ActivityIndicator />;

  const device = useCameraDevice("back");

  if (!device) return <Text style={styles.noCamera}>No Camera</Text>;

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],

    onCodeScanned: async (codes, frame) => {
      let userID = "";
      let forNFT = null;
      let address = null;
      if (qrCodeValue.length > 0) return;
      qrCodeValue = codes;

      if (typeof codes[0].value === "string") {
        const parsedValue: { userID: string; forNFT: boolean; address: any } =
          JSON.parse(codes[0].value);
        ({ userID, forNFT, address } = parsedValue);
      }
      // get number_of_orders from user_missions table
      const { data: userMissionInfo } = await supabase
        .from("user_missions")
        .select("number_of_orders, id")
        .eq("user_id", userID)
        .eq("admin_id", adminID);
      // get number_for_reward from admin table
      const { data: numberForReward } = await supabase
        .from("admins")
        .select("number_for_reward")
        .eq("id", adminID);

      // If the order is for free, make request
      if (forNFT === true && userMissionInfo) {
        const result = await fetch(
          "https://mint-nft-js.vercel.app/collectionNFT",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              admin_id: adminID,
              user_wallet: address,
            }),
          }
        );
        const { success } = await result.json();
        if (success === true) {
          let { data, error } = await supabase.rpc(
            "decrement_user_missions_number_of_free_rights",
            {
              mission_id: userMissionInfo[0].id,
            }
          );
          Alert.alert("Müşteriniz ödülünüzü kullandı.");
        } else {
          Alert.alert(
            "Müşteri ödülünü kullanamadı.",
            "Lütfen tekrar deneyiniz."
          );
        }
      }

      // If the order is not for free, check the number of orders
      else {
        if (userMissionInfo?.length === 0) {
          // If the user does not have a record in the user_missions table, add a new record
          const { data, error } = await secretSupabase
            .from("user_missions")
            .insert({
              number_of_orders: 1,
              user_id: userID,
              admin_id: adminID,
            });
          Alert.alert("İşlem başarıyla gerçekleşti.");
        } else if (
          numberForReward &&
          userMissionInfo &&
          userMissionInfo[0].number_of_orders <
          numberForReward[0].number_for_reward - 1
        ) {
          // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
          let { data, error } = await supabase.rpc(
            "increment_user_missions_number_of_orders",
            {
              mission_id: userMissionInfo[0].id,
            }
          );
          if (error) console.error(error);
          else console.log(data);
          Alert.alert("İşlem başarıyla gerçekleşti.");
        } else if (
          numberForReward &&
          userMissionInfo &&
          userMissionInfo[0].number_of_orders ===
          numberForReward[0].number_for_reward - 1
        ) {
          // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, make request
          try {
            const { data, error: incrementError } = await supabase.rpc(
              "increment_user_missions_number_of_free_rights",
              {
                mission_id: userMissionInfo[0].id,
              }
            );

            const { error: zeroError } = await secretSupabase
              .from("user_missions")
              .update({
                number_of_orders: 0,
              })
              .eq("user_id", userID)
              .eq("admin_id", adminID);

            console.log("here", zeroError);
            if (zeroError) {
              Alert.alert(
                "Bir şeyler yanlış gitti.",
                "Lütfen tekrar deneyiniz."
              );
            } else {
              Alert.alert("Müşteriniz ödülünüzü kazandı.");
            }
          } catch (error) {
            console.log("error", error);
            Alert.alert(
              "Müşteriye ödülü verilemedi.",
              "Lütfen tekrar deneyiniz."
            );
          }
        }
      }
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>←</Text>
      </Pressable>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noCamera: {
    position: "absolute",
    alignSelf: "center",
    textAlign: "center",
    bottom: 300,
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    width: 40,
    height: 40,
    padding: 5,
    borderWidth: 2,
    borderRadius: 20,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    zIndex: 1,
    backgroundColor: colors.pink,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.white,
  },
});

export default AdminCamera;
