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
import useBrandStore from "../../store/brandStore";
import { MonthlyOrdersWithYear } from "../../lib/types";

const { width, height } = Dimensions.get("window");

const AdminCamera = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const brandId = useBrandStore((state) => state.brand.id);

  useEffect(() => {
    console.log("brandId", brandId)
  }, [brandId])

  let qrCodeValue = [];

  const resetQrCodeValue = () => qrCodeValue = [];

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) return <ActivityIndicator />;

  const device = useCameraDevice("back");

  if (!device) return <Text style={styles.noCamera}>No Camera</Text>;

  const months = [
    "ocak",
    "şubat",
    "mart",
    "nisan",
    "mayıs",
    "haziran",
    "temmuz",
    "ağustos",
    "eylül",
    "ekim",
    "kasım",
    "aralık",
  ];
  const currentMonth = months[new Date().getMonth()];
  const currentYear = new Date().getFullYear();

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

      try {
        const days = ["pzr", "pzt", "salı", "çrş", "prş", "cuma", "cmt"];
        const currentDay = days[new Date().getDay()];

        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) return;

        const { data: isTrueQRData } = await supabase
          .from("brand_branch")
          .select("brand_id")
          .eq("id", brandBranchID)
          .single();

        console.log("isTrueQRData", isTrueQRData, isTrueQRData?.brand_id === brandId);

        if (isTrueQRData?.brand_id !== brandId) return Alert.alert("Hata", "Gecersiz QR kodu", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);

        const { data: user } = await supabase
          .from("users")
          .select("username, wallet_addr")
          .eq("id", userID)
          .single();

        console.log("user", user);

        const { data: userOrderInfo } = await supabase
          .from("user_orders")
          .select(
            "id, total_user_orders, total_ticket_orders, user_total_used_free_rights"
          )
          .eq("user_id", userID)
          .eq("branch_id", brandBranchID)
          .eq("brand_id", brandId)
          .single();

        console.log("userOrderInfo", userOrderInfo);

        const { data: brandBranchInfo } = await supabase
          .from("brand_branch")
          .select(
            "brand_id, total_used_free_rights, daily_total_used_free_rights, total_orders, daily_total_orders, weekly_total_orders, monthly_total_orders, total_unused_free_rights, monthly_total_orders_with_years"
          )
          .eq("id", brandBranchID)
          .eq("brand_id", brandId);

        console.log("brandBranchInfo", brandBranchInfo);

        if (!brandBranchInfo) return Alert.alert("Hata", "Şube bilgisi bulunamadı.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);

        const { data: brandInfo } = await supabase
          .from("brand")
          .select("required_number_for_free_right")
          .eq("id", brandId);

        console.log("brandInfo", brandInfo);

        if (!brandInfo) return Alert.alert("Hata", "İşletme bilgisi bulunamadı.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);

        const { data: userTotalFreeRights } = await supabase
          .from("user_orders")
          .select("user_total_free_rights")
          .eq("user_id", userID)
          .eq("brand_id", brandId);

        console.log("userTotalFreeRights", userTotalFreeRights);

        const totalUserFreeRights = userTotalFreeRights && userTotalFreeRights.reduce((total, item) => total + item.user_total_free_rights, 0);
        if (userOrderInfo) {
          if (forNFT) {
            if (totalUserFreeRights === 0) return Alert.alert("Hata", "Müşterinizin ödül hakkı kalmamıştır.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);
            try {

              await supabase
                .from("user_orders")
                .update({
                  user_total_free_rights: Number(
                    totalUserFreeRights && totalUserFreeRights - 1
                  ),
                  user_total_used_free_rights: Number(
                    userOrderInfo && userOrderInfo.user_total_used_free_rights + 1
                  ),
                  total_user_orders: Number(
                    userOrderInfo && userOrderInfo.total_user_orders + 1
                  ),
                })
                .eq("id", (userOrderInfo && userOrderInfo.id) || "");

              await supabase
                .from("brand_branch")
                .update({
                  monthly_total_orders_with_years: {
                    ...(brandBranchInfo[0]
                      .monthly_total_orders_with_years as MonthlyOrdersWithYear),
                    [currentYear]: {
                      ...((
                        brandBranchInfo[0]?.monthly_total_orders_with_years as {
                          [key: string]: { [key: string]: number };
                        }
                      )[currentYear] || {}),
                      [currentMonth]: Number(
                        (
                          brandBranchInfo[0]?.monthly_total_orders_with_years as {
                            [key: string]: { [key: string]: number };
                          }
                        )[currentYear]?.[currentMonth] + 1
                      ),
                    },
                  },
                  total_unused_free_rights: Number(
                    brandBranchInfo[0].total_unused_free_rights - 1
                  ),
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
                  weekly_total_orders: {
                    [currentDay]: Number(
                      (
                        brandBranchInfo[0].weekly_total_orders as {
                          [key: string]: number;
                        }
                      )[currentDay] + 1
                    ),
                  },
                  monthly_total_orders: Number(
                    brandBranchInfo[0].monthly_total_orders + 1
                  ),
                })
                .eq("id", brandBranchID);



              return Alert.alert(
                `${user?.username} adlı müşteriniz ödülünüzü kullandı.`,
                `Bugüne kadar verilen sipariş sayısı: ${userOrderInfo.total_user_orders + 1} ${"\n"} Kalan ödül hakkı: ${totalUserFreeRights ? totalUserFreeRights - 1 : 1} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo.user_total_used_free_rights + 1}`,
                [
                  {
                    text: "Tamam",
                    onPress: () => qrCodeValue = [],
                  },
                ]
              );
            } catch (error) {
              return Alert.alert("Hata", "Sipariş verme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);
            }
          }
          //forNFT false yani ödül olmayan sipariş ve ilk sipariş veya başka bir markanın qr ı değil normal arttırma işlemi
          else {
            //ödüle götürecek olan sipariş değilse
            if (Number(brandInfo[0].required_number_for_free_right) - 1 > userOrderInfo.total_ticket_orders) {
              try {
                const { error: userOrderError } = await supabase
                  .from("user_orders")
                  .update({
                    total_ticket_orders: Number(
                      userOrderInfo.total_ticket_orders + 1
                    ),
                    total_user_orders: Number(userOrderInfo.total_user_orders + 1),
                  })
                  .eq("id", userOrderInfo.id);

                console.log(userOrderError);

                const { error: brandBranchError } = await supabase
                  .from("brand_branch")
                  .update({
                    monthly_total_orders_with_years: {
                      ...(brandBranchInfo[0]
                        .monthly_total_orders_with_years as MonthlyOrdersWithYear),
                      [currentYear]: {
                        ...((
                          brandBranchInfo[0]?.monthly_total_orders_with_years as {
                            [key: string]: { [key: string]: number };
                          }
                        )[currentYear] || {}),
                        [currentMonth]: Number(
                          (
                            brandBranchInfo[0]?.monthly_total_orders_with_years as {
                              [key: string]: { [key: string]: number };
                            }
                          )[currentYear]?.[currentMonth] + 1
                        ),
                      },
                    },
                    total_orders: Number(brandBranchInfo[0].total_orders + 1),
                    daily_total_orders: Number(
                      brandBranchInfo[0].daily_total_orders + 1
                    ),
                    weekly_total_orders: {
                      [currentDay]: Number(
                        (
                          brandBranchInfo[0].weekly_total_orders as {
                            [key: string]: number;
                          }
                        )[currentDay] + 1
                      ),
                    },
                    monthly_total_orders: Number(
                      brandBranchInfo[0].monthly_total_orders + 1
                    ),
                  })
                  .eq("id", brandBranchID);

                console.log(brandBranchError);

                return Alert.alert(
                  `${user?.username} adlı müşterinin işlemi başarıyla gerçekleştirildi.`,
                  `Bugüne kadar verilen sipariş sayısı: ${userOrderInfo.total_user_orders + 1} ${"\n"} Müşterinin ödül hakkı : ${totalUserFreeRights} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo.user_total_used_free_rights}`,
                  [
                    {
                      text: "Tamam",
                      onPress: () => qrCodeValue = [],
                    },
                  ]
                )
              } catch (error) {
                return Alert.alert("Hata", "Sipariş verme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);
              }
            }
            else if (userOrderInfo.total_ticket_orders === Number(brandInfo[0]?.required_number_for_free_right) - 1) {
              try {
                await supabase
                  .from("user_orders")
                  .update({
                    total_ticket_orders: 0,
                    total_user_orders: Number(userOrderInfo.total_user_orders + 1),
                    user_total_free_rights: Number(
                      totalUserFreeRights ? totalUserFreeRights + 1 : 1
                    ),
                  })
                  .eq("id", userOrderInfo.id);

                await supabase
                  .from("brand_branch")
                  .update({
                    monthly_total_orders_with_years: {
                      ...(brandBranchInfo[0]
                        .monthly_total_orders_with_years as MonthlyOrdersWithYear),
                      [currentYear]: {
                        ...((
                          brandBranchInfo[0]?.monthly_total_orders_with_years as {
                            [key: string]: { [key: string]: number };
                          }
                        )[currentYear] || {}),
                        [currentMonth]: Number(
                          (
                            brandBranchInfo[0]?.monthly_total_orders_with_years as {
                              [key: string]: { [key: string]: number };
                            }
                          )[currentYear]?.[currentMonth] + 1
                        ),
                      },
                    },
                    total_orders: Number(brandBranchInfo[0].total_orders + 1),
                    daily_total_orders: Number(
                      brandBranchInfo[0].daily_total_orders + 1
                    ),
                    weekly_total_orders: {
                      [currentDay]: Number(
                        (
                          brandBranchInfo[0].weekly_total_orders as {
                            [key: string]: number;
                          }
                        )[currentDay] + 1
                      ),
                    },
                    monthly_total_orders: Number(
                      brandBranchInfo[0].monthly_total_orders + 1
                    ),
                  })
                  .eq("id", brandBranchID);
                await supabase
                  .from("brand_branch")
                  .update({
                    total_unused_free_rights: Number(
                      brandBranchInfo[0].total_unused_free_rights + 1
                    ),
                  })
                  .eq("id", brandBranchID);

                return Alert.alert(
                  `${user?.username} adlı müşteri ödülünüzü kazandı.`,
                  `Bugüne kadar verilen sipariş sayısı: ${userOrderInfo.total_user_orders + 1} ${"\n"} Müşterinin ödül hakkı : ${totalUserFreeRights ? totalUserFreeRights + 1 : 1} ${"\n"} Bugüne kadar kullanılan ödül sayısı: ${userOrderInfo.user_total_used_free_rights}`,
                  [
                    {
                      text: "Tamam",
                      onPress: () => qrCodeValue = [],
                    }
                  ]
                )
              } catch (error) {
                return Alert.alert("Hata", "Sipariş verme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);
              }
            }
          }
        }
        else {
          //burada ilk sipariş
          try {
            await supabase.from("user_orders").insert({
              user_id: String(userID),
              branch_id: String(brandBranchID),
              brand_id: String(brandId),
              total_user_orders: 1,
              total_ticket_orders: 1,
            });
            await supabase
              .from("brand_branch")
              .update({
                monthly_total_orders_with_years: {
                  ...(brandBranchInfo[0]
                    .monthly_total_orders_with_years as MonthlyOrdersWithYear),
                  [currentYear]: {
                    ...((
                      brandBranchInfo[0]?.monthly_total_orders_with_years as {
                        [key: string]: { [key: string]: number };
                      }
                    )[currentYear] || {}),
                    [currentMonth]: Number(
                      (
                        brandBranchInfo[0]?.monthly_total_orders_with_years as {
                          [key: string]: { [key: string]: number };
                        }
                      )[currentYear]?.[currentMonth] + 1
                    ),
                  },
                },
                total_orders: Number(brandBranchInfo[0].total_orders + 1),
                daily_total_orders: Number(
                  brandBranchInfo[0].daily_total_orders + 1
                ),
                weekly_total_orders: {
                  [currentDay]: Number(
                    (
                      brandBranchInfo[0].weekly_total_orders as {
                        [key: string]: number;
                      }
                    )[currentDay] + 1
                  ),
                },
                monthly_total_orders: Number(
                  brandBranchInfo[0].monthly_total_orders + 1
                ),
              })
              .eq("id", brandBranchID);
            return Alert.alert(`${user?.username} adlı müşterinin işlemi başarıyla gerçekleşti.`, `İlk Sipariş !`, [{ text: "Tamam", onPress: () => qrCodeValue = [], },])
          } catch (error) {
            return Alert.alert("Hata", "Sipariş verme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);
          }
        }
      } catch (error) {
        return Alert.alert("Hata", "Bir şeyler yanlış gitti. Lütfen tekrar deneyiniz.", [{ text: "Tamam", onPress: () => qrCodeValue = [] }]);
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
