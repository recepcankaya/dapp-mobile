import { useState, useCallback, useEffect } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import supabase from "../../lib/supabase";
import colors from "../../ui/colors";
import CustomLoading from "../../components/common/CustomLoading";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";
import AdminInfoList from "../../components/admin/AdminInfoList";
import AdminHomeHeader from "../../components/admin/AdminHomeHeader";
import Icon from "react-native-vector-icons/Ionicons";
import { responsiveFontSize } from "../../ui/responsiveFontSize";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const BranchHome = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const setBrandBranch = useBrandBranchStore((state) => state.setBrandBranch);

  const brandName = useBrandStore((state) => state.brand.brandName);
  const brandLogo = useBrandStore((state) => state.brand.brandLogoIpfsUrl);
  const requiredNumberForFreeRight = useBrandStore(
    (state) => state.brand.requiredNumberForFreeRight
  );
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  const brandBranchId = useBrandBranchStore((state) => state.brandBranch.id);
  const totalOrder = useBrandBranchStore(
    (state) => state.brandBranch.totalOrders
  );
  const totalUsedFreeRights = useBrandBranchStore(
    (state) => state.brandBranch.totalUsedFreeRights
  );
  const totalUnusedFreeRights = useBrandBranchStore(
    (state) => state.brandBranch.totalUnusedFreeRights
  );
  const monthlyTotalOrders = useBrandBranchStore(
    (state) => state.brandBranch.monthlyTotalOrders
  );
  const dailyTotalOrders = useBrandBranchStore(
    (state) => state.brandBranch.dailyTotalOrders
  );
  const dailyTotalUsedFreeRights = useBrandBranchStore(
    (state) => state.brandBranch.dailyTotalUsedFreeRights
  );
  const weeklyTotalOrders = useBrandBranchStore(
    (state) => state.brandBranch.weeklyTotalOrders
  );

  const fetchBrandDashboard = async () => {
    try {
      const { data: brandBranchData } = await supabase
        .from("brand_branch")
        .select(
          "id, brand_id, branch_name, total_orders, total_used_free_rights, daily_total_orders, daily_total_used_free_rights, monthly_total_orders, weekly_total_orders"
        )
        .eq("id", brandBranchId)
        .single();

      if (!brandBranchData) {
        Alert.alert(
          "Bir sorun oluştur",
          "Markanıza ait bir şube bulunamadı. Lütfen tekrar giriş yapınız."
        );
        return;
      }

      setBrandBranch({
        ...brandBranch,
        id: brandBranchData.id,
        brandId: brandBranchData.brand_id,
        branchName: brandBranchData.branch_name,
        totalOrders: brandBranchData.total_orders,
        totalUsedFreeRights: brandBranchData.total_used_free_rights,
        weeklyTotalOrders: brandBranchData.weekly_total_orders,
        dailyTotalOrders: brandBranchData.daily_total_orders,
        dailyTotalUsedFreeRights: brandBranchData.daily_total_used_free_rights,
        monthlyTotalOrders: brandBranchData.monthly_total_orders,
      });
    } catch (error) {
      Alert.alert("Bir hata oluştu", "Lütfen tekrar deneyin.");
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBrandDashboard();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    console.log("weeklyTotalOrders", weeklyTotalOrders)
  }, [weeklyTotalOrders])

  const infoListData: { title: string; value: string }[] = [
    { title: "Toplam sipariş sayısı", value: totalOrder?.toString() },
    {
      title: "Bu ay verilen sipariş sayısı",
      value: monthlyTotalOrders?.toString(),
    },
    {
      title: "Bugün verilen sipariş sayısı",
      value: dailyTotalOrders?.toString(),
    },
    {
      title: "Bugün kullanılan ödül sayısı",
      value: dailyTotalUsedFreeRights?.toString(),
    },
    {
      title: "Bugüne kadar kullanılmış ödüller",
      value: totalUsedFreeRights?.toString(),
    },
    {
      title: "Bekleyen ödüllerin sayısı",
      value: totalUnusedFreeRights?.toString() || "0",
    },
    {
      title: "Ödül için sipariş sayısı",
      value: requiredNumberForFreeRight?.toString(),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <AdminHomeHeader brandName={brandName} brandLogo={brandLogo} />
      <AdminInfoList
        data={infoListData}
        onRefresh={onRefresh}
        refreshing={refreshing}
        weeklyTotalOrders={weeklyTotalOrders}
      />
      <Icon name="qr-code-outline" size={responsiveFontSize(40)} color="black" onPress={() => navigation.navigate("Admin Camera")} />
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

export default BranchHome;
