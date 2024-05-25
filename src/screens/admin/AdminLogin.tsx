import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import colors from "../../ui/colors";
import supabase from "../../lib/supabase";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const brand = useBrandStore((state) => state.brand);
  const setBrand = useBrandStore((state) => state.setBrand);
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  const setBrandBranch = useBrandBranchStore((state) => state.setBrandBranch);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const submitForm = async () => {
    if (!email || !password) {
      Alert.alert("Giriş Hatası", "Mail ve şifre alanları boş bırakılamaz.");
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data) {
      if (data.user) {
        const { data: brandData, error: brandError } = await supabase
          .from("brand")
          .select("id,brand_name, contract_address, required_number_for_free_right")
          .eq("id", data.user.id)
          .single();
        console.log("brandData", brandData);
        if (brandData) {
          setBrand({
            ...brand,
            id: brandData.id,
            brandName: brandData.brand_name,
            contractAddress: brandData.contract_address,

            requiredNumberForFreeRight: brandData.required_number_for_free_right
          });
          const { data: brandBranchData } = await supabase
            .from("brand_branch")
            .select("id,branch_name, total_order, total_used_free_rights, daily_total_orders, daily_total_used_free_rights, monthly_total_orders, total_unused_free_rights, monthly_total_orders_with_years, weekly_total_orders")
            .eq("brand_id", brandData.id)
            .single();
          console.log("brandBranchData", brandBranchData);
          if (brandBranchData) setBrandBranch({
            ...brandBranch,
            id: brandBranchData.id,
            branchName: brandBranchData.branch_name,
            totalOrders: brandBranchData.total_order,
            totalUsedFreeRights: brandBranchData.total_used_free_rights,
            dailyTotalOrders: brandBranchData.daily_total_orders,
            dailyTotalUsedFreeRights: brandBranchData.daily_total_used_free_rights,
            monthlyTotalOrders: brandBranchData.monthly_total_orders,
            totalUnusedFreeRights: brandBranchData.total_unused_free_rights,
            monthlyTotalOrdersWithYears: brandBranchData.monthly_total_orders_with_years,
            weeklyTotalOrders: brandBranchData.weekly_total_orders
          });
        } else {
          const { data: brandBrancData } = await supabase
            .from("brand_branch")
            .select("id, brand_id,branch_name, total_orders, total_used_free_rights, daily_total_orders, daily_total_used_free_rights, monthly_total_orders")
            .eq("id", data.user.id)
            .single();
          if (brandBrancData) {
            setBrandBranch({
              ...brandBranch,
              id: brandBrancData.id,
              brandId: brandBrancData.brand_id,
              branchName: brandBrancData.branch_name,
              totalOrders: brandBrancData.total_orders,
              totalUsedFreeRights: brandBrancData.total_used_free_rights,
              dailyTotalOrders: brandBrancData.daily_total_orders,
              dailyTotalUsedFreeRights: brandBrancData.daily_total_used_free_rights,
              monthlyTotalOrders: brandBrancData.monthly_total_orders
            });
            const { data: brandData } = await supabase
              .from("brand")
              .select("brand_name, contract_address, required_number_for_free_right")
              .eq("id", brandBrancData.brand_id)
              .single();
            if (brandData) {
              setBrand({
                ...brand,
                id: brandBrancData.brand_id,
                brandName: brandData.brand_name,
                contractAddress: brandData.contract_address,
                requiredNumberForFreeRight: brandData.required_number_for_free_right
              });
            }
          }
        }
        // Check if it's the first login
        if (data.user.last_sign_in_at === null) {
          navigation.navigate("Admin New Password");
        } else {
          setEmail("");
          setPassword("");
          return navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Admin Home" }],
            })
          );
        }
      }
    }
    if (error) {
      console.error(error);
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Giriş Yap</Text>
        <View style={styles.inputContainer}>
          <TextInput
            inputMode="email"
            placeholder="Mailiniz"
            style={styles.input}
            placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Şifreniz"
            secureTextEntry={true}
            style={styles.input}
            placeholderTextColor="#000"
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={submitForm}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    width: "80%",
    height: 600,
    alignItems: "stretch",
    justifyContent: "center",
  },
  header: {
    color: colors.white,
    fontSize: 24,
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%",
    gap: 40,
    marginBottom: 100,
  },
  input: {
    backgroundColor: colors.pink,
    width: "100%",
    height: 60,
    borderRadius: 20,
    paddingLeft: 20,
    fontSize: 18,
  },
  continueButton: {
    borderWidth: 2,
    borderColor: colors.pink,
    width: "80%",
    height: 70,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: 24,
    color: colors.white,
  },
});
export default AdminLogin;
