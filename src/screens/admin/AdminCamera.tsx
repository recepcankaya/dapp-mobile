import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  Pressable,
  StatusBar,
} from "react-native";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../ui/colors";

const statusBarHeight = StatusBar.currentHeight ?? 0;

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
      if (qrCodeValue.length > 0) return;
      qrCodeValue = codes;

      if (typeof codes[0].value === "string") {
        const parsedValue: { userID: string; forNFT: boolean } = JSON.parse(
          codes[0].value
        );
        ({ userID, forNFT } = parsedValue);
      }

      // get number_of_orders from user_missions table
      const { data: userMissionInfo, error: errorUserMissionInfo } =
        await supabase
          .from("user_missions")
          .select("number_of_orders")
          .eq("user_id", userID);

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
          await supabase.from("user_missions").delete().eq("id", userID);
        } else {
          Alert.alert("Bir sorun oluştu.", "Lütfen tekrar deneyiniz.");
        }
      }

      // If the order is not for free, check the number of orders
      else {
        if (userMissionInfo?.length === 0) {
          // If the user does not have a record in the user_missions table, add a new record
          await supabase.from("user_missions").insert({
            number_of_orders: 1,
            user_id: userID,
            admin_id: adminID,
          });
          Alert.alert("İşlem başarıyla gerçekleşti.");
        } else if (
          numberForReward &&
          userMissionInfo[0].number_of_orders <
          numberForReward[0].number_for_reward
        ) {
          // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
          let { data, error } = await supabase
            .rpc('Increment_user_missions.number_of_orders', {
              userID
            })
          if (error) console.error(error)
          else console.log(data)
          Alert.alert("İşlem başarıyla gerçekleşti.");
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
              .eq("user_id", userID);
            mintNotUsedNft({
              metadata: {
                name: brandName,
                description: "",
                image: notUsedNFTSrc,
              },
              to: customerAddress,
            });
            Alert.alert("Müşteriniz ödülünüzü kazandı.");
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
