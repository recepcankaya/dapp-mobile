import { useEffect } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import supabase from "../../lib/supabase";
import useAdminForAdminStore from "../../store/adminStoreForAdmin";
import colors from "../../ui/colors";

const AdminHome = () => {
  const updateAdmin = useAdminForAdminStore((state) => state.updateAdmin);
  const adminID = useAdminForAdminStore((state) => state.admin.adminId);
  const brandName = useAdminForAdminStore((state) => state.admin.brandName);
  const brandBranch = useAdminForAdminStore((state) => state.admin.brandBranch);
  const numberOfOrdersSoFar = useAdminForAdminStore(
    (state) => state.admin.numberOfOrdersSoFar
  );
  const usedNFTs = useAdminForAdminStore((state) => state.admin.usedNFTs);
  const notUsedNFTs = useAdminForAdminStore((state) => state.admin.notUsedNFTs);
  const numberForReward = useAdminForAdminStore(
    (state) => state.admin.numberForReward
  );
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAdminDashboard = async () => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select(
          "brand_name, brand_branch, used_nfts, not_used_nfts, number_for_reward, number_of_orders_so_far, contract_address, nft_src, not_used_nft_src, not_used_contract_address"
        )
        .eq("id", adminID);
      if (adminData) {
        updateAdmin({
          adminId: adminID,
          brandName: adminData[0].brand_name,
          brandBranch: adminData[0].brand_branch,
          numberOfOrdersSoFar: adminData[0].number_of_orders_so_far,
          usedNFTs: adminData[0].used_nfts,
          notUsedNFTs: adminData[0].not_used_nfts,
          numberForReward: adminData[0].number_for_reward,
          contractAddress: adminData[0].contract_address,
          NFTSrc: adminData[0].nft_src,
          notUsedContractAddress: adminData[0].not_used_contract_address,
          notUsedNFTSrc: adminData[0].not_used_nft_src,
        });
      } else {
        console.error(adminError);
      }
    } catch (error) {
      Alert.alert("Bir hata oluştu", "Lütfen tekrar deneyin.");
    }
  };

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.info}>
          <View style={styles.circle}>
            {/* Brand Logo */}
            <Text style={styles.adminData}></Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>{brandName}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            {/* Brand Logo */}
            <Text style={styles.adminData}></Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>{brandBranch}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{numberOfOrdersSoFar}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bugüne Kadar Kaç Ürün Satıldığı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{notUsedNFTs}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bekleyen Ödüllerin Sayısı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{usedNFTs}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Verilen Ödüllerin Sayısı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{numberForReward}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Kaç Alışverişte Ödül Verileceği</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.qrCode}
        onPress={() => navigation.navigate("Admin Camera")}>
        <Image
          source={require("../../assets/qr-code.png")}
          style={styles.qrCode}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    width: "90%",
    height: 650,
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  circle: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: colors.pink,
    justifyContent: "center",
    alignItems: "center",
  },
  adminData: {
    color: colors.white,
    fontSize: 20,
  },
  infoTextContainer: {
    width: "60%",
    height: 70,
    justifyContent: "center",
    backgroundColor: colors.pink,
    borderRadius: 20,
    paddingLeft: 20,
  },
  infoText: {
    color: colors.black,
    fontSize: 20,
    fontWeight: "bold",
  },
  qrCode: {
    position: "absolute",
    bottom: 10,
    width: 50,
    height: 50,
  },
});

export default AdminHome;
