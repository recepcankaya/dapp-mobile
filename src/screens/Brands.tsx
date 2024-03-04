import React, { useEffect } from "react";
import { StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../ui/colors";
import { widthConstant } from "../ui/responsiveScreen";
import useAdminStore, { Admin } from "../store/adminStore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import supabase from "../lib/supabase";


const Brands = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.from("admins").select("*");
      if (error) {
        console.log(error);
      } else {
        console.log('admin', data);
        updateAdmins(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchAdmins();
  }, []);

  const admins = useAdminStore(state => state.admins);
  const updateAdmin = useAdminStore(state => state.updateAdmin);
  const updateAdmins = useAdminStore(state => state.updateAdmins);

  const selectBrand = (item: any) => {
    updateAdmin({
      id: item.id,
      createdAt: item.created_at,
      brandName: item.brand_name,
      brandBranch: item.brand_branch,
      brandLogo: item.brand_logo,
      numberOfOrders: item.number_of_orders,
      usedNFTs: item.used_nfts,
      notUsedNFTs: item.not_used_nfts,
      numberForReward: item.number_for_reward,
      NFTSrc: item.nft_src,
      lastQRScanTime: item.last_qr_scan_time,
    })
    navigation.navigate("TabNavigator");
  }

  const brandListRenderItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => {
    return (
      <TouchableOpacity
        style={styles.brand}
        onPress={() => selectBrand(item)}>
        <Image source={{ uri: item.brandLogo }} style={styles.brandImage} />
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={admins}
        extraData={admins}
        renderItem={({ item, index }: { item: any; index: number }) =>
          brandListRenderItem({ item, index })
        }
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
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
  brand: {
    width: 130 * widthConstant,
    height: 130 * widthConstant,
    alignItems: "center",
    justifyContent: "center",
    margin: 30 * widthConstant,
  },
  brandImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderWidth: 2,
    borderRadius: 20,
    borderColor: colors.purple,
  },
});

export default Brands;
