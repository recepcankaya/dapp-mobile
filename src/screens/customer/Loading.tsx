import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import useUserStore from "../../store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, AppState, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import colors from "../../ui/colors";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const Loading = () => {
  const userUpdate = useUserStore((state) => state.setUser);

  const brand = useBrandStore(state => state.brand);
  const setBrand = useBrandStore(state => state.setBrand);

  const brandBranch = useBrandBranchStore(state => state.brandBranch);
  const setBrandBranch = useBrandBranchStore(state => state.setBrandBranch);


  const [session, setSession] = useState<Session | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkLogin(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const checkLogin = async (session: Session | null) => {
    if (session && session.user) {
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (user) {
        userUpdate({
          id: user.id.toString(),
          username: user.username,
          lastLogin: user.last_login,
          walletAddr: user.wallet_addr,
        });
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "TabNavigator" }],
          })
        );
      } else {
        const { data: brandData } = await supabase
          .from("brand")
          .select("id,brand_name, contract_address, required_number_for_free_right, brand_logo_ipfs_url")
          .eq("id", session.user.id)
          .single();
        if (brandData) {
          setBrand({
            ...brand,
            id: brandData.id,
            brandName: brandData.brand_name,
            contractAddress: brandData.contract_address,
            requiredNumberForFreeRight: brandData.required_number_for_free_right,
            brandLogoIpfsUrl: brandData.brand_logo_ipfs_url
          });
          const { data: brandBranchData, error } = await supabase
            .from("brand_branch")
            .select("id, branch_name, total_orders, total_used_free_rights, daily_total_orders, daily_total_used_free_rights, monthly_total_orders, total_unused_free_rights, monthly_total_orders_with_years, weekly_total_orders")
            .eq("brand_id", brandData.id)
            .single();
          if (brandBranchData) setBrandBranch({
            ...brandBranch,
            id: brandBranchData.id,
            branchName: brandBranchData.branch_name,
            totalOrders: brandBranchData.total_orders,
            totalUsedFreeRights: brandBranchData.total_used_free_rights,
            dailyTotalOrders: brandBranchData.daily_total_orders,
            dailyTotalUsedFreeRights: brandBranchData.daily_total_used_free_rights,
            monthlyTotalOrders: brandBranchData.monthly_total_orders,
            totalUnusedFreeRights: brandBranchData.total_unused_free_rights,
            monthlyTotalOrdersWithYears: brandBranchData.monthly_total_orders_with_years,
            weeklyTotalOrders: brandBranchData.weekly_total_orders
          });
        }
        else {
          setBrand({ ...brand, id: session.user.id });
          setBrandBranch({ ...brandBranch, id: session.user.id });
        }
        return navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Admin Home" }],
          })
        );
      }
    }
    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator color={colors.purple} size={"large"} />
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.black,
  },
});
