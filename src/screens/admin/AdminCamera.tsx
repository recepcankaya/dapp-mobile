import { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Pressable,
  View,
  Dimensions,
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

const { width, height } = Dimensions.get("window");

const AdminCamera = () => {
  const adminId = useAdminForAdminStore((state) => state.admin.adminId);
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
      let adminID = "";
      let forNFT = null;
      let address = null;
      if (qrCodeValue.length > 0) return;
      qrCodeValue = codes;

      if (typeof codes[0].value === "string") {
        const parsedValue: { userID: string; adminID: string; forNFT: boolean; address: any } =
          JSON.parse(codes[0].value);
        ({ userID, adminID, forNFT, address } = parsedValue);
      }
      // get number_of_orders from user_missions table
      const { data: userMissionInfo } = await supabase
        .from("user_missions")
        .select(
          "number_of_orders, id, customer_number_of_orders_so_far, number_of_free_rights"
        )
        .eq("user_id", userID)
        .eq("admin_id", adminId);

      // get number_for_reward from admin table
      const { data: numberForReward } = await supabase
        .from("admins")
        .select("number_for_reward")
        .eq("id", adminId);

      const { data: user } = await secretSupabase
        .from("users")
        .select("username")
        .eq("id", userID)
        .single();
      // If the order is for free, make request
      if (forNFT == true && userMissionInfo) {
        if (adminID != adminId) return Alert.alert(`Bu sizin işletmenizin ödülü değildir.`, `Lütfen müşterinizden doğru ödülü kullanmasını isteyiniz.`, [
          {
            text: "Tamam",
            onPress: () => qrCodeValue = [],
          },
        ]);
        if (userMissionInfo[0].number_of_free_rights == 0) return Alert.alert(`Bu ödül kullanılamaz.`, `Lütfen daha sonra tekrar deneyiniz.`, [
          {
            text: "Tamam",
            onPress: () => qrCodeValue = [],
          },
        ])
        await supabase.rpc("decrement_admins_not_used_nfts", {
          admin_id: adminId,
        });

        await supabase.rpc("decrement_user_missions_number_of_free_rigths", {
          mission_id: userMissionInfo[0].id,
        });

        await supabase.rpc("increment_admins_number_of_orders_so_far", {
          admin_id: adminId,
        });

        await supabase.rpc("increment_user_missions_number_of_orders_so_far", {
          mission_id: userMissionInfo[0].id,
        });

        await supabase.rpc("increment_admins_used_rewards", {
          admin_id: adminId
        });

        await supabase.rpc("increment_user_missions_used_rewards", {
          mission_id: userMissionInfo[0].id
        })

        Alert.alert(
          `${user?.username} adlı müşteriniz ödülünüzü kullandı.`,
          `Bugüne kadar verilen sipariş sayısı: ${userMissionInfo[0].customer_number_of_orders_so_far + 1} ${"\n"} Kalan ödül hakkı: ${userMissionInfo[0].number_of_free_rights - 1}`,
          [
            {
              text: "Tamam",
              onPress: () => qrCodeValue = [],
            },
          ]
        );
      }

      // If the order is not for free, check the number of orders
      else {
        if (user) {
          // If the user does not have a record in the user_missions table, add a new record
          if (userMissionInfo?.length === 0) {
            await supabase.from("user_missions").insert({
              number_of_orders: 1,
              user_id: userID,
              admin_id: adminId,
              number_of_free_rights: 0,
              customer_number_of_orders_so_far: 1,
            });

            await supabase.rpc("increment_admins_number_of_orders_so_far", {
              admin_id: adminId,
            });

            await supabase.rpc("increment_user_missions_number_of_orders_so_far", {
              mission_id: adminId,
            })

            Alert.alert(
              `${user?.username} adlı müşterinizin işlemi başarıyla gerçekleştirildi.`,
              `İlk sipariş!`,
              [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]
            );
          } else if (
            numberForReward &&
            userMissionInfo &&
            userMissionInfo[0].number_of_orders <
            numberForReward[0].number_for_reward - 1
            // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
          ) {
            await supabase.rpc("increment_user_missions_number_of_orders", {
              mission_id: userMissionInfo[0].id,
            });

            await supabase.rpc(
              "increment_user_missions_number_of_orders_so_far",
              {
                mission_id: userMissionInfo[0].id,
              }
            );

            await supabase.rpc("increment_admins_number_of_orders_so_far", {
              admin_id: adminId,
            });


            Alert.alert(
              `${user?.username} adlı müşterinizin işlemi başarıyla gerçekleştirildi.`,
              `Bugüne kadar sipariş edilen kahve sayısı: ${userMissionInfo[0].customer_number_of_orders_so_far + 1
              } ${"\n"} Müşterinin ödül hakkı: ${userMissionInfo[0].number_of_free_rights === null ? 0 : userMissionInfo[0].number_of_free_rights}`,
              [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]
            );
          } else if (
            numberForReward &&
            userMissionInfo &&
            userMissionInfo[0].number_of_orders ===
            numberForReward[0].number_for_reward - 1
            // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, make request
          ) {
            try {
              await supabase.rpc("increment_admins_not_used_nfts", {
                admin_id: adminId,
              });

              await supabase.rpc(
                "increment_user_missions_number_of_free_rigths",
                {
                  mission_id: userMissionInfo[0].id,
                }
              );

              await supabase.rpc("increment_admins_number_of_orders_so_far", {
                admin_id: adminId,
              });

              await supabase.rpc(
                "increment_user_missions_number_of_orders_so_far",
                {
                  mission_id: userMissionInfo[0].id,
                }
              );

              const { error: zeroError } = await supabase
                .from("user_missions")
                .update({
                  number_of_orders: 0,
                })
                .eq("user_id", userID)
                .eq("admin_id", adminId);

              if (zeroError) {
                Alert.alert(
                  "Bir şeyler yanlış gitti.",
                  "Lütfen tekrar deneyiniz.",
                  [
                    {
                      text: "Tamam",
                      onPress: () => qrCodeValue = [],
                    },
                  ]
                );
              } else {
                Alert.alert(
                  `${user.username} adlı müşteriniz ödülünüzü kazandı.`,
                  `Bugüne kadar sipariş edilen kahve sayısı: ${userMissionInfo[0].customer_number_of_orders_so_far + 1
                  } ${"\n"} Müşterinin ödül hakkı: ${userMissionInfo[0].number_of_free_rights === null ? 1 : userMissionInfo[0].number_of_free_rights + 1}`,
                  [
                    {
                      text: "Tamam",
                      onPress: () => qrCodeValue = [],
                    },
                  ]
                );
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
      <View style={styles.transparentView}>
        <View style={styles.border} />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: 10,
            width: 10,
          }}
        />
      </View>
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
    zIndex: 2,
    backgroundColor: colors.pink,
  },
  backButtonText: {
    fontSize: 20,
    color: colors.white,
  },
  transparentView: {
    position: "absolute",
    zIndex: 1,
    borderColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: height / 3,
    borderRightWidth: width / 7,
    borderLeftWidth: width / 7,
    height,
    width,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  border: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.pink,
  },
});

export default AdminCamera;
