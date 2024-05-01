import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import supabase from "../../lib/supabase";
import useAdminForAdminStore from "../../store/adminStoreForAdmin";
import colors from "../../ui/colors";
import { useTotalCount, useContract } from "@thirdweb-dev/react-native";
import CustomLoading from "../../components/common/CustomLoading";

const AdminHome = () => {
  const updateAdmin = useAdminForAdminStore((state) => state.updateAdmin);
  const adminID = useAdminForAdminStore((state) => state.admin.adminId);
  const brandName = useAdminForAdminStore((state) => state.admin.brandName);
  const brandBranch = useAdminForAdminStore((state) => state.admin.brandBranch);
  const numberOfOrdersSoFar = useAdminForAdminStore(
    (state) => state.admin.numberOfOrdersSoFar
  );
  const notUsedNFTs = useAdminForAdminStore((state) => state.admin.notUsedNFTs);
  const numberForReward = useAdminForAdminStore(
    (state) => state.admin.numberForReward
  );
  const usedRewards = useAdminForAdminStore((state) => state.admin.usedRewards)
  const contractAddress = useAdminForAdminStore(
    (state) => state.admin.contractAddress
  );
  const { contract: usedNFTContract } = useContract(contractAddress);
  const { data: nftData, isLoading, error } = useTotalCount(usedNFTContract);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [refreshing, setRefreshing] = useState(false);

  const fetchAdminDashboard = async () => {
    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admins")
        .select(
          "brand_name, brand_branch, not_used_nfts, number_for_reward, number_of_orders_so_far, contract_address ,admin_used_rewards"
        )
        .eq("id", adminID);
      if (adminData) {
        updateAdmin({
          adminId: adminID,
          brandName: adminData[0].brand_name,
          brandBranch: adminData[0].brand_branch,
          notUsedNFTs: adminData[0].not_used_nfts,
          numberForReward: adminData[0].number_for_reward,
          numberOfOrdersSoFar: adminData[0].number_of_orders_so_far,
          contractAddress: adminData[0].contract_address,
          usedRewards: adminData[0].admin_used_rewards,
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAdminDashboard();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.infoContainer} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
            <Text style={styles.adminData}>{!isLoading ? nftData?.toString() : "..."}</Text>
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
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{usedRewards}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Verilen Ödüller</Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.qrCode}
        onPress={() => navigation.navigate("Admin Camera")}>
        <Image
          source={require("../../assets/qr-code.png")}
          style={styles.qrCode}
        />
      </TouchableOpacity>
      <CustomLoading visible={refreshing} />
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
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 15
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
