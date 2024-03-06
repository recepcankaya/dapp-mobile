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
  useContract,
  useMintNFT,
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
  const customerAddress = useAddress();
  const { contract } = useContract(contractAddress);
  const {
    mutate: mintNft,
    isLoading,
    isError: mintNftError,
  } = useMintNFT(contract);
  const { hasPermission, requestPermission } = useCameraPermission();

  const cameraRef = useRef<Camera>(null);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    console.log('atakan');
  }, [])

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) return <ActivityIndicator />;

  const device = useCameraDevice("back");

  if (!device) return <Text style={styles.noCamera}>No Camera</Text>;

  const codeScanner = useCodeScanner({
    codeTypes: ["qr", "ean-13"],

    onCodeScanned: async (codes, frame) => {
      let userId = "";
      let forNFT = null;
      console.log('codes', codes);


      if (typeof codes[0].value === "string") {
        const parsedValue: { userId: string; forNFT: boolean } = JSON.parse(codes[0].value);
        ({ userId, forNFT } = parsedValue);
      }

      // get number_of_orders, has_free_right, number_of_free_rights from user_missions table
      const { data: userMissionInfo, error: errorUserMissionInfo } =
        await supabase
          .from("user_missions")
          .select("number_of_orders, has_free_right, number_of_free_rights")
          .eq("user_id", userId);
      console.log('userMissionInfo', userMissionInfo);
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
        console.log('x', userMissionInfo);
        if (userMissionInfo) {
          console.log('x-1');
          // If the user does not have a record in the user_missions table, add a new record
          await supabase.from("user_missions").insert({
            number_of_orders: 1,
            user_id: userId,
            admin_id: adminID.toString(),
            has_free_right: false,
            number_of_free_rights: 0,
          }).then((response) => {
            console.log('User Missions Insert Response', response);
          });
        } else if (
          numberForReward &&
          userMissionInfo[0].number_of_orders <
          numberForReward[0].number_for_reward
        ) {
          console.log('x-2');
          // If the user has a record in the user_missions table and the number of orders is less than the number_for_reward, increase the number of orders by one
          await supabase
            .from("user_missions")
            .update({
              number_of_orders: userMissionInfo[0].number_of_orders + 1,
            })
            .eq("user_id", userId).then((response) => {
              console.log('User Missions Update Response', response);
            });
        } else {
          console.log('x-3');
          // If the user has a record in the user_missions table and the number of orders is equal to the number_for_reward, mint the NFT and reset the number of orders
          if (userMissionInfo[0].has_free_right === false) {
            console.log('x-4');
            await supabase
              .from("user_missions")
              .update({
                has_free_right: true,
                number_of_free_rights: 1,
                number_of_orders: 0,
              })
              .eq("user_id", userId).then((response) => {
                console.log('Has Free Right False Response', response);
              });
            if (customerAddress) {
              console.log('x-5');
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
            console.log('x-6');
            await supabase
              .from("user_missions")
              .update({
                number_of_free_rights:
                  userMissionInfo[0].number_of_free_rights + 1,
                number_of_orders: 0,
              })
              .eq("user_id", userId).then((response) => {
                console.log('Has Free Right True Response', response);
              });
            if (customerAddress) {
              console.log('x-7');
              mintNft({
                metadata: {
                  name: brandName,
                  description: "",
                  image: NFTSrc,
                },
                to: customerAddress,
              });
            }
            console.log('x-8');
          }
          console.log('x-9');
        }
      }
      console.log('x-10');
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>
          ←
        </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
    zIndex: 1,
    backgroundColor: colors.black
  },
  backButtonText: {
    fontSize: 20,
    color: colors.white,
  }
});

export default AdminCamera;
