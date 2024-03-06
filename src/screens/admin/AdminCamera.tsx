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
  useBurnNFT,
  useContract,
  useMintNFT,
  useTransferNFT,
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
  const notUsedNFTSrc = useAdminForAdminStore(
    (state) => state.admin.notUsedNFTSrc
  );
  const notUsedContractAddress = useAdminForAdminStore(
    (state) => state.admin.notUsedContractAddress
  );
  const customerAddress = useAddress();
  const { contract } = useContract(contractAddress);
  const { contract: notUsedContract } = useContract(notUsedContractAddress);
  const {
    mutateAsync: mintNft,
    isLoading,
    isError: mintNftError,
  } = useMintNFT(contract);
  const { mutateAsync: mintNotUsedNft } = useMintNFT(notUsedContract);
  const { mutateAsync: burnNFTUsingTransfer } = useTransferNFT(notUsedContract);
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
        const parsedValue: { userId: string; forNFT: boolean } = JSON.parse(
          codes[0].value
        );
        ({ userId, forNFT } = parsedValue);
      }

      // get number_of_orders from user_missions table
      const { data: userMissionInfo, error: errorUserMissionInfo } =
        await supabase
          .from("user_missions")
          .select("number_of_orders")
          .eq("user_id", userId);

      // get number_for_reward from admin table
      const { data: numberForReward, error: errorNumberForReward } =
        await supabase
          .from("admins")
          .select("number_for_reward")
          .eq("id", adminID);

      // If the order is for free, check the user's free right
      if (forNFT === true) {
        if (userMissionInfo && customerAddress) {
          // We will mint new NFT for the collection
          mintNft({
            metadata: {
              name: brandName,
              description: "",
              image: NFTSrc,
            },
            to: customerAddress,
          });
          // After minted the NFT, we will burn old NFT using transfer to 0x0 address
          burnNFTUsingTransfer({
            to: "0x0000000000000000000000000000000000000000",
            tokenId: 0,
            amount: 1,
          });
          Alert.alert("Müşterinize ödülünüzü verebilirsiniz.");
          await supabase.from("user_missions").delete().eq("id", userId);
        } else {
          Alert.alert("Bir sorun oluştu.", "Lütfen tekrar deneyiniz.");
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
        } else if (
          numberForReward &&
          userMissionInfo[0].number_of_orders ===
            numberForReward[0].number_for_reward
        ) {
          // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, mint the NFT and reset the number of orders
          if (customerAddress) {
            await supabase
              .from("user_missions")
              .update({
                number_of_orders: 0,
              })
              .eq("user_id", userId);
            mintNotUsedNft({
              metadata: {
                name: brandName,
                description: "",
                image: notUsedNFTSrc,
              },
              to: customerAddress,
            });
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
