import { useState, useCallback } from "react";
import {
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import supabase from "../../lib/supabase";
import colors from "../../ui/colors";
import CustomLoading from "../../components/common/CustomLoading";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";
import AdminInfoList from "../../components/admin/AdminInfoList";
import AdminHomeHeader from "../../components/admin/AdminHomeHeader";

const AdminHome = () => {
  const setBrand = useBrandStore((state) => state.setBrand);
  const setBrandBranch = useBrandBranchStore((state) => state.setBrandBranch);
  const brand = useBrandStore((state) => state.brand);
  const brandName = useBrandStore((state) => state.brand.brandName);
  const brandLogo = useBrandStore((state) => state.brand.brandLogoIpfsUrl);
  const requiredNumberForFreeRight = useBrandStore(state => state.brand.requiredNumberForFreeRight);
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  const brandBranchId = useBrandBranchStore((state) => state.brandBranch.id);
  const totalOrder = useBrandBranchStore(state => state.brandBranch.totalOrders);
  const totalUsedFreeRights = useBrandBranchStore(state => state.brandBranch.totalUsedFreeRights);
  const totalUnusedFreeRights = useBrandBranchStore(state => state.brandBranch.totalUnusedFreeRights);
  const monthlyTotalOrders = useBrandBranchStore(state => state.brandBranch.monthlyTotalOrders);
  const dailyTotalOrders = useBrandBranchStore(state => state.brandBranch.dailyTotalOrders);
  const dailyTotalUsedFreeRights = useBrandBranchStore(state => state.brandBranch.dailyTotalUsedFreeRights);
  const weeklyTotalOrders = useBrandBranchStore(state => state.brandBranch.weeklyTotalOrders);

  const [refreshing, setRefreshing] = useState(false);

  const fetchBrandDashboard = async () => {
    try {
      const { data: brandBranchData } = await supabase
        .from("brand_branch")
        .select("branch_name, total_used_free_rights, total_orders, total_unused_free_rights, brand( brand_name, required_number_for_free_right, contract_address)")
        .eq("id", brandBranchId)
        .single();
      if (brandBranchData) {
        setBrand({
          ...brand,
          brandName: brandBranchData.brand.brand_name,
          requiredNumberForFreeRight: brandBranchData.brand.required_number_for_free_right,
          contractAddress: brandBranchData.brand.contract_address,
        });
        setBrandBranch({
          ...brandBranch,
          branchName: brandBranchData.branch_name,
          totalUsedFreeRights: brandBranchData.total_used_free_rights,
          totalOrders: brandBranchData.total_orders,
          totalUnusedFreeRights: brandBranchData.total_unused_free_rights,
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

  const infoListData: { title: string, value: string }[] = [
    { title: "Toplam sipariş sayısı", value: totalOrder?.toString() },
    { title: "Bu ay verilen sipariş sayısı", value: monthlyTotalOrders?.toString() },
    { title: "Bugün verilen sipariş sayısı", value: dailyTotalOrders?.toString() },
    { title: "Bugün kullanılan ödül sayısı", value: dailyTotalUsedFreeRights?.toString() },
    { title: "Bugüne kadar kullanılmış ödüller", value: totalUsedFreeRights?.toString() },
    { title: "Bekleyen ödüllerin sayısı", value: totalUnusedFreeRights?.toString() || "0" },
    { title: "Ödül için sipariş sayısı", value: requiredNumberForFreeRight?.toString() },
  ]
  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <AdminHomeHeader brandName={brandName} brandLogo={brandLogo} />
      <AdminInfoList data={infoListData} onRefresh={onRefresh} refreshing={refreshing} weeklyTotalOrders={weeklyTotalOrders} />
      <CustomLoading visible={refreshing} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.yellow,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminHome;
