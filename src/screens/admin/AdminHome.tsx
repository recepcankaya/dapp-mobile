import { useState, useCallback } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import supabase from "../../lib/supabase";
import colors from "../../ui/colors";
import CustomLoading from "../../components/common/CustomLoading";
import useBrandStore from "../../store/brandStore";
import AdminInfoList from "../../components/admin/AdminInfoList";
import AdminHomeHeader from "../../components/admin/AdminHomeHeader";
import useBrandBranchesDetailsStore from "../../store/brandBranchesDetailsStore";
import Icon from "react-native-vector-icons/Ionicons";
import { responsiveFontSize } from "../../ui/responsiveFontSize";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const AdminHome = () => {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const brandId = useBrandStore((state) => state.brand.id);
  const brandName = useBrandStore((state) => state.brand.brandName);
  const brandLogo = useBrandStore((state) => state.brand.brandLogoIpfsUrl);
  const requiredNumberForFreeRight = useBrandStore(
    (state) => state.brand.requiredNumberForFreeRight
  );
  const brandBranchesDetails = useBrandBranchesDetailsStore((state) => state.brandBranchesDetails);
  const setBrandBranchesDetails = useBrandBranchesDetailsStore((state) => state.setBrandBranchesDetails);

  const fetchBrandDashboard = async () => {
    try {
      const { data: brandData } = await supabase
        .from("brand")
        .select(
          `id,brand_name, 
      brand_logo_ipfs_url, 
      required_number_for_free_right,
      contract_address,
      brand_branch(
        total_orders, 
        total_used_free_rights, 
        total_unused_free_rights, 
        daily_total_orders, 
        daily_total_used_free_rights, 
        monthly_total_orders,
        weekly_total_orders
      )`
        )
        .eq("id", brandId);

      if (!brandData) {
        Alert.alert(
          "Bir hata oluştu",
          "Verileri getirirken bir hata oluştu. Lütfen tekrar deneyiniz."
        );
        return;
      }

      const calculateData = brandData[0].brand_branch.map((item) => ({
        total_orders: item.total_orders,
        total_used_free_rights: item.total_used_free_rights,
        total_unused_free_rights: item.total_unused_free_rights,
        daily_total_orders: item.daily_total_orders,
        daily_total_used_free_rights: item.daily_total_used_free_rights,
        monthly_total_orders: item.monthly_total_orders,
      }));

      const calculatedData = calculateData.reduce(
        (acc, item) => {
          acc.total_orders += item.total_orders;
          acc.total_used_free_rights += item.total_used_free_rights;
          acc.total_unused_free_rights += item.total_unused_free_rights;
          acc.daily_total_orders += item.daily_total_orders;
          acc.daily_total_used_free_rights += item.daily_total_used_free_rights;
          acc.monthly_total_orders += item.monthly_total_orders;

          return acc;
        },
        {
          total_orders: 0,
          total_used_free_rights: 0,
          total_unused_free_rights: 0,
          daily_total_orders: 0,
          daily_total_used_free_rights: 0,
          monthly_total_orders: 0,
        }
      );

      const weeklyTotalOrders = brandData[0].brand_branch.reduce<{
        [key: string]: number;
      }>((acc, item) => {
        if (
          item.weekly_total_orders &&
          typeof item.weekly_total_orders === "object" &&
          !Array.isArray(item.weekly_total_orders)
        ) {
          Object.keys(item.weekly_total_orders).forEach((day) => {
            const value = (item.weekly_total_orders as { [key: string]: number })[
              day
            ];
            if (typeof value === "number") {
              if (!acc[day]) {
                acc[day] = 0;
              }
              acc[day] += value;
            }
          });
        }
        return acc;
      }, {});

      setBrandBranchesDetails({
        dailyTotalOrders: calculatedData.daily_total_orders,
        dailyTotalUsedFreeRights: calculatedData.daily_total_used_free_rights,
        weeklyTotalOrders,
        monthlyTotalOrders: calculatedData.monthly_total_orders,
        totalOrders: calculatedData.total_orders,
        totalUsedFreeRights: calculatedData.total_used_free_rights,
        totalUnusedFreeRights: calculatedData.total_unused_free_rights
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

  const infoListData: { title: string; value: string }[] = [
    { title: "Toplam sipariş sayısı", value: brandBranchesDetails.totalOrders?.toString() },
    {
      title: "Bu ay verilen sipariş sayısı",
      value: brandBranchesDetails.monthlyTotalOrders?.toString(),
    },
    {
      title: "Bugün verilen sipariş sayısı",
      value: brandBranchesDetails.dailyTotalOrders?.toString(),
    },
    {
      title: "Bugün kullanılan ödül sayısı",
      value: brandBranchesDetails.dailyTotalUsedFreeRights?.toString(),
    },
    {
      title: "Bugüne kadar kullanılmış ödüller",
      value: brandBranchesDetails.totalUsedFreeRights?.toString(),
    },
    {
      title: "Bekleyen ödüllerin sayısı",
      value: brandBranchesDetails.totalUnusedFreeRights?.toString() || "0",
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
        weeklyTotalOrders={brandBranchesDetails.weeklyTotalOrders}
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

export default AdminHome;
