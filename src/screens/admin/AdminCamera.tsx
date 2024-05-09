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

import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../ui/colors";
import supabase from "../../lib/supabase";

const { width, height } = Dimensions.get("window");

const AdminCamera = () => {
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
      let brandBranchID = "";
      let forNFT = null;
      if (qrCodeValue.length > 0) return;
      qrCodeValue = codes;

      if (typeof codes[0].value === "string") {
        const parsedValue: { userID: string; brandBranchID: string; forNFT: boolean; } =
          JSON.parse(codes[0].value);
        ({ userID, brandBranchID, forNFT } = parsedValue);
      }

      const {
        data: { user: admin },
      } = await supabase.auth.getUser();

      if (!admin) return;

      const { data: user } = await supabase
        .from("users")
        .select("username, wallet_addr")
        .eq("id", userID)
        .single();

      /////////////////////////////////////////////////////
      ////////////// IF THE USER IS A BRANCH //////////////
      ///////////////////////////////////////////////////

      if (admin?.id === brandBranchID) {
        const { data: userOrderInfo } = await supabase
          .from("user_orders")
          .select(
            "id, total_user_orders, total_ticket_orders, user_total_free_rights, user_total_used_free_rights"
          )
          .eq("user_id", userID)
          .eq("branch_id", admin?.id || "");

        if (!userOrderInfo) return Alert.alert("Kullanıcıya ait sipariş bilgisi bulunamadı.", "", [
          { text: "Tamam", onPress: () => qrCodeValue = [] },
        ]);

        const { data: brandBranchInfo } = await supabase
          .from("brand_branch")
          .select(
            "brand_id, total_used_free_rights, daily_total_used_free_rights, total_orders, daily_total_orders, monthly_total_orders"
          )
          .eq("id", admin?.id || "");

        if (!brandBranchInfo) return Alert.alert("Şube bilgisi bulunamadı.", "",
          [
            {
              text: "Tamam",
              onPress: () => qrCodeValue = [],
            },
          ]);

        const { data: brandInfo } = await supabase
          .from("brand")
          .select("required_number_for_free_right, total_unused_free_rights")
          .eq("id", brandBranchInfo[0].brand_id);

        if (!brandInfo) return Alert.alert("İşletme bilgisi bulunamadı.");

        if (forNFT === true) {
          if (userOrderInfo[0]?.user_total_free_rights === 0) Alert.alert("Müşterinizin ödül hakkı kalmamıştır.", "", [
            {
              text: "Tamam",
              onPress: () => qrCodeValue = [],
            },
          ]);

          try {
            await supabase
              .from("user_orders")
              .update({
                user_total_free_rights: Number(
                  userOrderInfo[0].user_total_free_rights - 1
                ),
                user_total_used_free_rights: Number(
                  userOrderInfo[0].user_total_used_free_rights + 1
                ),
                total_user_orders: Number(
                  userOrderInfo[0].total_user_orders + 1
                ),
              })
              .eq("id", userOrderInfo[0].id);

            await supabase
              .from("brand_branch")
              .update({
                total_orders: Number(brandBranchInfo[0].total_orders + 1),
                daily_total_orders: Number(
                  brandBranchInfo[0].daily_total_orders + 1
                ),
                total_used_free_rights: Number(
                  brandBranchInfo[0].total_used_free_rights + 1
                ),
                daily_total_used_free_rights: Number(
                  brandBranchInfo[0].daily_total_used_free_rights + 1
                ),
                monthly_total_orders: Number(
                  brandBranchInfo[0].monthly_total_orders + 1
                ),
              })
              .eq("id", admin?.id || "");

            await supabase
              .from("brand")
              .update({
                total_unused_free_rights: Number(
                  brandInfo[0].total_unused_free_rights - 1
                ),
              })
              .eq("id", brandBranchInfo[0].brand_id);

            Alert.alert(`${user?.username} adlı müşteriniz ödülünüzü kullandı.`,
              `Bugüne kadar verilen sipariş sayısı: ${userOrderInfo[0].total_user_orders + 1} ${"\n"} Kalan ödül hakkı: ${userOrderInfo[0].user_total_free_rights - 1} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo[0].user_total_used_free_rights + 1}`,
              [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
          } catch (error) {
            Alert.alert("Müşteri ödülünü kullanamadı.", "Lütfen tekrar deneyiniz.", [
              {
                text: "Tamam",
                onPress: () => qrCodeValue = [],
              }
            ]);
          }
        }
        // If the order is not for free, check total_ticket_orders
        else {
          if (userOrderInfo[0] === undefined) {
            // If the user does not have a record in the user_orders table, add a new record
            try {
              await supabase.from("user_orders").insert({
                user_id: String(userID),
                branch_id: String(admin?.id),
                brand_id: String(brandBranchInfo[0].brand_id),
                total_user_orders: 1,
                total_ticket_orders: 1,
              });

              await supabase
                .from("brand_branch")
                .update({
                  total_orders: Number(brandBranchInfo[0].total_orders + 1),
                  daily_total_orders: Number(
                    brandBranchInfo[0].daily_total_orders + 1
                  ),
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", admin?.id || "");
              Alert.alert(`${user?.username} adlı müşterinizin işlemi başarıyla gerçekleştirildi.`, (""), [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            } catch (error) {
              Alert.alert("Müşteri siparişi alınamadı.", "Lütfen tekrar deneyiniz.", [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            }
          } else if (
            Number(brandInfo[0]?.required_number_for_free_right) - 1 >
            userOrderInfo[0].total_ticket_orders
          ) {
            // If the user has a record in the user_orders table and the ticket orders is less than the requiredNumberForFreeRight, increase the ticket orders by one
            try {
              await supabase
                .from("user_orders")
                .update({
                  total_ticket_orders: Number(
                    userOrderInfo[0].total_ticket_orders + 1
                  ),
                  total_user_orders: Number(
                    userOrderInfo[0].total_user_orders + 1
                  ),
                })
                .eq("id", userOrderInfo[0].id);

              await supabase
                .from("brand_branch")
                .update({
                  total_orders: Number(brandBranchInfo[0].total_orders + 1),
                  daily_total_orders: Number(
                    brandBranchInfo[0].daily_total_orders + 1
                  ),
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", admin?.id || "");

              Alert.alert(`${user?.username} adlı müşterinizin işlemi başarıyla gerçekleştirildi.`, (""), [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            } catch (error) {
              Alert.alert("Müşteri siparişi alınamadı.", "Lütfen tekrar deneyiniz.", [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            }
          } else if (
            userOrderInfo[0].total_ticket_orders ===
            Number(brandInfo[0]?.required_number_for_free_right) - 1
          ) {
            // If the user has a record in the user_orders table and the ticket orders will be equal to the requiredNumberForFreeRight, increase user_total_free_rights by one and make zero the total_ticket_orders
            try {
              await supabase
                .from("user_orders")
                .update({
                  total_ticket_orders: 0,
                  total_user_orders: Number(
                    userOrderInfo[0].total_user_orders + 1
                  ),
                  user_total_free_rights: Number(
                    userOrderInfo[0].user_total_free_rights + 1
                  ),
                })
                .eq("id", userOrderInfo[0].id);

              await supabase
                .from("brand_branch")
                .update({
                  total_orders: Number(brandBranchInfo[0].total_orders + 1),
                  daily_total_orders: Number(
                    brandBranchInfo[0].daily_total_orders + 1
                  ),
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", admin?.id || "");

              await supabase
                .from("brand")
                .update({
                  total_unused_free_rights: Number(
                    brandInfo[0].total_unused_free_rights + 1
                  ),
                })
                .eq("id", brandBranchInfo[0].brand_id);

              Alert.alert("Müşteriniz ödülünüzü kazandı", (""), [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            } catch (error) {
              Alert.alert("Müşteriye ödülü verilemedi.Lütfen tekrar deneyiniz.", "", [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            }
          }
        }
      }
      /////////////////////////////////////////////////////
      ////////////// IF THE USER IS A BRAND //////////////
      ///////////////////////////////////////////////////
      else {
        const { data: userOrderInfo } = await supabase
          .from("user_orders")
          .select(
            "id, total_user_orders, total_ticket_orders, user_total_free_rights, user_total_used_free_rights"
          )
          .eq("user_id", userID)
          .eq("branch_id", brandBranchID);

        const { data: brandBranchInfo } = await supabase
          .from("brand_branch")
          .select(
            "total_used_free_rights, daily_total_used_free_rights, total_orders, daily_total_orders, monthly_total_orders"
          )
          .eq("brand_id", admin?.id || "");

        if (!brandBranchInfo) return Alert.alert("Şube bilgisi bulunamadı.", "", [
          {
            text: "Tamam",
            onPress: () => qrCodeValue = [],
          },
        ]);

        const { data: brandInfo } = await supabase
          .from("brand")
          .select("required_number_for_free_right, total_unused_free_rights")
          .eq("id", admin?.id || "");


        if (!userOrderInfo || !brandInfo) {
          return Alert.alert("Kullanıcıya ait sipariş bilgisi bulunamadı.", "",
            [
              {
                text: "Tamam",
                onPress: () => qrCodeValue = [],
              },
            ]);
        }
        if (forNFT === true) {
          if (userOrderInfo[0]?.user_total_free_rights === 0) {
            Alert.alert("Müşterinizin ödül hakkı kalmamıştır.", "", [
              {
                text: "Tamam",
                onPress: () => qrCodeValue = [],
              },
            ]);
          }

          try {
            await supabase
              .from("user_orders")
              .update({
                user_total_free_rights: Number(
                  userOrderInfo[0].user_total_free_rights - 1
                ),
                user_total_used_free_rights: Number(
                  userOrderInfo[0].user_total_used_free_rights + 1
                ),
                total_user_orders: Number(
                  userOrderInfo[0].total_user_orders + 1
                ),
              })
              .eq("id", userOrderInfo[0].id);

            await supabase
              .from("brand_branch")
              .update({
                total_orders: Number(brandBranchInfo[0].total_orders + 1),
                daily_total_orders: Number(
                  brandBranchInfo[0].daily_total_orders + 1
                ),
                total_used_free_rights: Number(
                  brandBranchInfo[0].total_used_free_rights + 1
                ),
                daily_total_used_free_rights: Number(
                  brandBranchInfo[0].daily_total_used_free_rights + 1
                ),
                monthly_total_orders: Number(
                  brandBranchInfo[0].monthly_total_orders + 1
                ),
              })
              .eq("id", brandBranchID);

            await supabase
              .from("brand")
              .update({
                total_unused_free_rights: Number(
                  brandInfo[0].total_unused_free_rights - 1
                ),
              })
              .eq("id", admin?.id || "");

            Alert.alert(
              `${user?.username} adlı müşteriniz ödülünü kullandı.`,
              `Bugüne kadar sipariş edilen kahve sayısı: ${userOrderInfo[0].total_user_orders + 1
              } ${"\n"} Müşterinin ödül hakkı: ${userOrderInfo[0].user_total_free_rights === null ? 1 : userOrderInfo[0].user_total_free_rights + 1} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo[0].user_total_used_free_rights}`,
              [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]
            );
          } catch (error) {
            Alert.alert("Müşteri ödülünü kullanamadı.", "Lütfen tekrar deneyiniz.",
              [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
          }
        }
        // If the order is not for free, check the number of orders
        else {
          if (userOrderInfo[0] === undefined) {
            // If the user does not have a record in the user_orders table, add a new record

            try {
              await supabase.from("user_orders").insert({
                user_id: String(userID),
                branch_id: String(brandBranchID),
                brand_id: String(admin?.id),
                total_user_orders: 1,
                total_ticket_orders: 1,
              });

              await supabase
                .from("brand_branch")
                .update({
                  total_orders: Number(brandBranchInfo[0].total_orders + 1),
                  daily_total_orders: Number(
                    brandBranchInfo[0].daily_total_orders + 1
                  ),
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", brandBranchID);

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
            } catch (error) {
              Alert.alert("Müşteri siparişi alınamadı.", "Lütfen tekrar deneyiniz.", [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            }
          } else if (
            Number(brandInfo[0]?.required_number_for_free_right) - 1 >
            userOrderInfo[0].total_ticket_orders
          ) {
            // If the user has a record in the user_orders table and the ticket orders is less than the requiredNumberForFreeRight, increase the ticket orders by one

            try {
              await supabase
                .from("user_orders")
                .update({
                  total_ticket_orders: Number(
                    userOrderInfo[0].total_ticket_orders + 1
                  ),
                  total_user_orders: Number(
                    userOrderInfo[0].total_user_orders + 1
                  ),
                })
                .eq("id", userOrderInfo[0].id);

              await supabase
                .from("brand_branch")
                .update({
                  total_orders: Number(brandBranchInfo[0].total_orders + 1),
                  daily_total_orders: Number(
                    brandBranchInfo[0].daily_total_orders + 1
                  ),
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", brandBranchID);

              Alert.alert(
                `${user?.username} adlı müşterinizin işlemi başarıyla gerçekleşti.`,
                `Bugüne kadar sipariş edilen kahve sayısı: ${userOrderInfo[0].total_user_orders + 1
                } ${"\n"} Müşterinin ödül hakkı: ${userOrderInfo[0].user_total_free_rights === null ? 1 : userOrderInfo[0].user_total_free_rights + 1} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo[0].user_total_used_free_rights}`,
                [
                  {
                    text: "Tamam",
                    onPress: () => qrCodeValue = [],
                  },
                ]
              );
            } catch (error) {
              Alert.alert("Müşteri siparişi alınamadı.", ("Lütfen tekrar deneyiniz."), [
                {
                  text: "Tamam",
                  onPress: () => qrCodeValue = [],
                },
              ]);
            }
          } else if (
            userOrderInfo[0].total_ticket_orders ===
            Number(brandInfo[0]?.required_number_for_free_right) - 1
          ) {
            // If the user has a record in the user_orders table and the ticket orders is equal to the requiredNumberForFreeRight, make a request
            try {
              await supabase
                .from("user_orders")
                .update({
                  total_ticket_orders: 0,
                  total_user_orders: Number(
                    userOrderInfo[0].total_user_orders + 1
                  ),
                  user_total_free_rights: Number(
                    userOrderInfo[0].user_total_free_rights + 1
                  ),
                })
                .eq("id", userOrderInfo[0].id);

              await supabase
                .from("brand_branch")
                .update({
                  total_orders: Number(brandBranchInfo[0].total_orders + 1),
                  daily_total_orders: Number(
                    brandBranchInfo[0].daily_total_orders + 1
                  ),
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", brandBranchID);

              await supabase
                .from("brand")
                .update({
                  total_unused_free_rights: Number(
                    brandInfo[0].total_unused_free_rights + 1
                  ),
                })
                .eq("id", admin?.id || "");

              Alert.alert(
                `${user?.username} adlı müşteriniz ödülünüzü kazandı.`,
                `Bugüne kadar sipariş edilen kahve sayısı: ${userOrderInfo[0].total_user_orders + 1
                } ${"\n"} Müşterinin ödül hakkı: ${userOrderInfo[0].user_total_free_rights === null ? 1 : userOrderInfo[0].user_total_free_rights + 1} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo[0].user_total_used_free_rights}`,
                [
                  {
                    text: "Tamam",
                    onPress: () => qrCodeValue = [],
                  },
                ]
              );
            } catch (error) {
              Alert.alert("Müşteriye ödülü verilemedi.Lütfen tekrar deneyiniz.");
            }
          }
        }
      }
    }
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
