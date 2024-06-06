import { Alert } from "react-native";
import supabase from "./supabase";
import useBrandBranchesDetailsStore from "../store/brandBranchesDetailsStore";

export const brandLogin = async (brandId: SupabaseBrand["id"]) => {
  console.log("brandId", brandId);
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

    const setBrandBranchesDetails = useBrandBranchesDetailsStore(
      (state) => state.setBrandBranchesDetails
    );

    setBrandBranchesDetails({
      dailyTotalOrders: calculatedData.daily_total_orders,
      dailyTotalUsedFreeRights: calculatedData.daily_total_used_free_rights,
      weeklyTotalOrders,
      monthlyTotalOrders: calculatedData.monthly_total_orders,
      totalOrders: calculatedData.total_orders,
      totalUsedFreeRights: calculatedData.total_used_free_rights,
      totalUnusedFreeRights: calculatedData.total_unused_free_rights,
    });
  } catch (error) {
    console.log("Admin Login Error", error);
  }
};
