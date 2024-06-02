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
import useBrandBranchesDetailsStore, { BrandBranchesDetailsProps } from "../../store/brandBranchesDetailsStore";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const brand = useBrandStore((state) => state.brand);
  const setBrand = useBrandStore((state) => state.setBrand);
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  const setBrandBranch = useBrandBranchStore((state) => state.setBrandBranch);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const setBrandBranchesDetails = useBrandBranchesDetailsStore(state => state.setBrandBranchesDetails);

  const submitForm = async () => {
    if (!email || !password) {
      Alert.alert("Giriş Hatası", "Mail ve şifre alanları boş bırakılamaz.");
      return;
    }
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('data', data);

    if (!data.user) {
      Alert.alert("Giriş Hatası", "Mail veya şifre hatalı.");
      return;
    }

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
      .eq("id", data.user.id);

    console.log('brandData', brandData);

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
    } else {
      // If the user is a branch
      const { data: brandBranchData } = await supabase
        .from("brand_branch")
        .select(
          "id, brand_id, branch_name, total_orders, total_used_free_rights, daily_total_orders, daily_total_used_free_rights, monthly_total_orders, weekly_total_orders"
        )
        .eq("id", data.user.id)
        .single();
      console.log('brandBranchData', brandBranchData);
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
    }

    setEmail("");
    setPassword("");

    return navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Branch Home" }],
      })
    );
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
