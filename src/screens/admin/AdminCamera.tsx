import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import {
  Camera,
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { heightConstant, widthConstant } from "../../ui/responsiveScreen";
import supabase from "../../lib/supabase";
import updateAdminId from "../../store/adminId";
import {
  useAddress,
  useContract,
  useMintNFT,
} from "@thirdweb-dev/react-native";

const AdminCamera = () => {
  const adminId = updateAdminId((state) => state.adminId);
  const address = useAddress();
  const { contract } = useContract(
    "0xC01cA582DeeD31104B6534960f3a282DFdC1FCA8"
  );
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
      const value = codes[0].value;
      const { data: userMissionInfo, error: errorUserMissionInfo } =
        await supabase
          .from("user_missions")
          .select("number_of_orders, has_free_right, number_of_free_rights")
          .eq("user_id", value);
      const { data: numberForReward, error: errorNumberForReward } =
        await supabase
          .from("admin")
          .select("number_for_reward")
          .eq("id", adminId);

      if (!userMissionInfo) {
        // !userMissionInfo = insert et
        await supabase.from("user_missions").insert({
          number_of_orders: 1,
          user_id: value,
          admin_id: adminId,
          has_free_right: false,
          number_of_free_rights: 0,
        });
      } else if (
        numberForReward &&
        userMissionInfo[0].number_of_orders <
          numberForReward[0].number_for_reward
      ) {
        // userMissionInfo < numberForReward = 1 ekle
        await supabase
          .from("user_missions")
          .update({ number_of_orders: userMissionInfo[0].number_of_orders + 1 })
          .eq("user_id", value);
      } else {
        // userMissionInfo = numberForReward = bilgileri güncelle ve nft mintle
        await supabase
          .from("user_missions")
          .update({
            has_free_right: true,
            number_of_free_rights: userMissionInfo[0].number_of_free_rights + 1,
            number_of_orders: 0,
          })
          .eq("user_id", value);
        // BURADA KULLANICIYA NFTSİNİ MİNTLEYELİM
        if (address) {
          mintNft({
            metadata: {
              name: "Mega Playstation",
              description: "",
              image:
                "ipfs://QmP7NbUz8FhcBuRKC4NeXokkTWXZKtTRdPijM9yc2FPExU/Mega%20Playstation.png",
            },
            to: address,
          });
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
