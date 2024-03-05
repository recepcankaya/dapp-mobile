import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { heightConstant, widthConstant } from "../../ui/responsiveScreen";
import supabase from "../../lib/supabase";
import updateAdminId from "../../store/adminStoreForAdmin";
import {
  useAddress,
  useContract,
  useMintNFT,
} from "@thirdweb-dev/react-native";
import useAdminStore from "../../store/adminStore";
import useAdminForAdminStore from "../../store/adminStoreForAdmin";

const AdminCamera = () => {
  const adminID = useAdminForAdminStore((state) => state.admin.adminId);
  const brandName = useAdminForAdminStore((state) => state.admin.brandName);
  const contractAddress = useAdminForAdminStore(
    (state) => state.admin.contractAddress
  );
  const NFTSrc = useAdminForAdminStore((state) => state.admin.NFTSrc);
  const customerAddress = useAddress();
  const { contract } = useContract(contractAddress);
  const {
    mutate: mintNft,
    isLoading,
    isError: mintNftError,
  } = useMintNFT(contract);
  const { hasPermission, requestPermission } = useCameraPermission();

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, []);

  if (!hasPermission) return <ActivityIndicator />;

  const device = useCameraDevice("back");

  if (!device) return <Text style={styles.noCamera}>No Camera</Text>;

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],
    onCodeScanned: async (codes) => {
      let userId = "";
      let forNFT = null;

      if (typeof codes[0].value === "string") {
        const parsedValue = JSON.parse(codes[0].value);
        ({ userId, forNFT } = parsedValue);
      }

      // get number_of_orders, has_free_right, number_of_free_rights from user_missions table
      const { data: userMissionInfo, error: errorUserMissionInfo } =
        await supabase
          .from("user_missions")
          .select("number_of_orders, has_free_right, number_of_free_rights")
          .eq("user_id", userId);

      // get number_for_reward from admin table
      const { data: numberForReward, error: errorNumberForReward } =
        await supabase
          .from("admins")
          .select("number_for_reward")
          .eq("id", adminID);

      // If the order is for free, check the user's free right
      if (forNFT === true) {
        // Check whether the user has a free right
        if (userMissionInfo && userMissionInfo[0].has_free_right > 1) {
          // If the user has more than one free right, decrease the number of free rights by one
          await supabase
            .from("user_missions")
            .update({
              number_of_free_rights:
                userMissionInfo[0].number_of_free_rights - 1,
            })
            .eq("user_id", userId);
          Alert.alert("Müşterinize ödülünüzü verebilirsiniz.");
        } else if (userMissionInfo && userMissionInfo[0].has_free_right === 1) {
          // If the user has only one free right, delete the row
          await supabase.from("user_missions").delete().eq("id", userId);
          Alert.alert("Müşterinize ödülünüzü verebilirsiniz.");
        } else {
          Alert.alert("Müşterinizin ücretsiz hakkı bulunmamaktadır.");
        }
      }
      // If the order is not for free, check the number of orders
      else {
        if (!userMissionInfo) {
          // If the user does not have a record in the user_missions table, add a new record
          await supabase.from("user_missions").insert({
            number_of_orders: 1,
            user_id: userId,
            admin_id: adminID,
            has_free_right: false,
            number_of_free_rights: 0,
          });
        } else if (
          numberForReward &&
          userMissionInfo[0].number_of_orders <
            numberForReward[0].number_for_reward
        ) {
          // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
          await supabase
            .from("user_missions")
            .update({
              number_of_orders: userMissionInfo[0].number_of_orders + 1,
            })
            .eq("user_id", userId);
        } else {
          // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, mint the NFT and reset the number of orders
          if (userMissionInfo[0].has_free_right === false) {
            await supabase
              .from("user_missions")
              .update({
                has_free_right: true,
                number_of_free_rights: 1,
                number_of_orders: 0,
              })
              .eq("user_id", userId);
            if (customerAddress) {
              mintNft({
                metadata: {
                  name: brandName,
                  description: "",
                  image: NFTSrc,
                },
                to: customerAddress,
              });
            }
          } else {
            await supabase
              .from("user_missions")
              .update({
                number_of_free_rights:
                  userMissionInfo[0].number_of_free_rights + 1,
                number_of_orders: 0,
              })
              .eq("user_id", userId);
            if (customerAddress) {
              mintNft({
                metadata: {
                  name: brandName,
                  description: "",
                  image: NFTSrc,
                },
                to: customerAddress,
              });
            }
          }
        }
      }
    },
  });

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
        codeScanner={codeScanner}
      />
      <TouchableOpacity style={styles.takePhotoButton}></TouchableOpacity>
    </View>
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
  takePhotoButton: {
    position: "absolute",
    bottom: 100 * heightConstant,
    alignSelf: "center",
    width: 75 * widthConstant,
    height: 75 * widthConstant,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "#fff",
  },
});

export default AdminCamera;
