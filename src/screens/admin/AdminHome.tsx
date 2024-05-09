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
import colors from "../../ui/colors";
import { useTotalCount, useContract } from "@thirdweb-dev/react-native";
import CustomLoading from "../../components/common/CustomLoading";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";

const AdminHome = () => {
  // const updateAdmin = useAdminForAdminStore((state) => state.updateAdmin);
  // const brandBranch = useAdminForAdminStore((state) => state.admin.brandBranch);
  const setBrand = useBrandStore((state) => state.setBrand);
  const setBrandBranch = useBrandBranchStore((state) => state.setBrandBranch);
  //--------------------------------------------------------------------------------
  const brand = useBrandStore((state) => state.brand);
  //brandId
  const brandId = useBrandStore((state) => state.brand.id);
  //brandName
  const brandName = useBrandStore((state) => state.brand.brandName);
  //contractAddress
  const contractAddress = useBrandStore((state) => state.brand.contractAddress);
  //notUsedNFTs
  const totalUnusedFreeRights = useBrandStore(state => state.brand.totalUnusedFreeRights);
  //numberForReward
  const requiredNumberForFreeRight = useBrandStore(state => state.brand.requiredNumberForFreeRight);
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  //brandBranchId
  const brandBranchId = useBrandBranchStore((state) => state.brandBranch.id);
  //numberOfOrdersSoFar
  const totalOrder = useBrandBranchStore(state => state.brandBranch.totalOrders);
  //usedRewards
  const totalUsedFreeRights = useBrandBranchStore(state => state.brandBranch.totalUsedFreeRights);
  //--------------------------------------------------------------------------------
  const { contract: usedNFTContract } = useContract(contractAddress);
  const { data: nftData, isLoading, error } = useTotalCount(usedNFTContract);

  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [refreshing, setRefreshing] = useState(false);

  const fetchBrandDashboard = async () => {
    try {
      console.log("brandBranchId", brandBranchId);
      const { data: brandBranchData } = await supabase
        .from("brand_branch")
        .select("branch_name, total_used_free_rights, total_orders,brand( brand_name, required_number_for_free_right, contract_address, total_unused_free_rights)")
        .eq("id", brandBranchId)
        .single();
      console.log("brandBranchData", brandBranchData);
      if (brandBranchData) {
        setBrand({
          ...brand,
          brandName: brandBranchData.brand.brand_name,
          requiredNumberForFreeRight: brandBranchData.brand.required_number_for_free_right,
          contractAddress: brandBranchData.brand.contract_address,
          totalUnusedFreeRights: brandBranchData.brand.total_unused_free_rights,
        });
        setBrandBranch({
          ...brandBranch,
          branchName: brandBranchData.branch_name,
          totalUsedFreeRights: brandBranchData.total_used_free_rights,
          totalOrders: brandBranchData.total_orders,
        });
      }
    } catch (error) {
      Alert.alert("Bir hata oluştu", "Lütfen tekrar deneyin.");
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBrandDashboard()
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
            <Text style={styles.infoText}>{brandBranch.branchName}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{totalOrder}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Bugüne Kadar Kaç Ürün Satıldığı</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{totalUnusedFreeRights}</Text>
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
            <Text style={styles.adminData}>{requiredNumberForFreeRight}</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Kaç Alışverişte Ödül Verileceği</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.circle}>
            <Text style={styles.adminData}>{totalUsedFreeRights}</Text>
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
