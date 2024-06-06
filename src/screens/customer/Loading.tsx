import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import useUserStore from "../../store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, AppState, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CommonActions } from "@react-navigation/native";
import colors from "../../ui/colors";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";
import useBrandBranchesDetailsStore from "../../store/brandBranchesDetailsStore";

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

  const setBrandBranchesDetails = useBrandBranchesDetailsStore(state => state.setBrandBranchesDetails);


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
          .eq("id", session.user.id);
        if (brandData && brandData.length > 0) {
          setBrand({
            ...brand,
            id: brandData[0].id,
            brandName: brandData[0].brand_name,
            brandLogoIpfsUrl: brandData[0].brand_logo_ipfs_url,
            contractAddress: brandData[0].contract_address,
            requiredNumberForFreeRight: brandData[0].required_number_for_free_right,
          });

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

          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Admin Home" }],
            })
          );

        }
        else {
          const { data: brandBranchData } = await supabase
            .from("brand_branch")
            .select(
              "id, brand_id, branch_name, total_orders, total_used_free_rights, daily_total_orders, daily_total_used_free_rights, monthly_total_orders, weekly_total_orders"
            )
            .eq("id", session.user.id)
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

          const { data: brandData } = await supabase
            .from("brand")
            .select("brand_name, brand_logo_ipfs_url, contract_address, required_number_for_free_right")
            .eq("id", brandBranchData.brand_id)
            .single();

          if (!brandData) {
            Alert.alert(
              "Bir sorun oluştur",
              "Şubenize ait bir marka bulunamadı. Lütfen tekrar giriş yapınız."
            );
            return;
          }
          setBrand({
            ...brand,
            id: brandBranchData.brand_id,
            brandName: brandData.brand_name,
            brandLogoIpfsUrl: brandData.brand_logo_ipfs_url,
            contractAddress: brandData.contract_address,
            requiredNumberForFreeRight: brandData.required_number_for_free_right,
          });
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Branch Home" }],
            })
          );
        }
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
