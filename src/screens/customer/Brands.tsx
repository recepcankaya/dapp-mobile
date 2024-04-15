import { useEffect, useState } from "react";
import { StyleSheet, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Geolocation, {
  GeolocationResponse,
} from "@react-native-community/geolocation";

import BrandsList from "../../components/customer/brands/BrandsList";
import BrandsSearch from "../../components/customer/brands/BrandsSearch";

import useAdminStore, { Admin } from "../../store/adminStore";
import { secretSupabase } from "../../lib/supabase";
import { haversine } from "../../lib/haversine";
import { heightConstant } from "../../ui/responsiveScreen";
import { errorToast } from "../../ui/toast";
import colors from "../../ui/colors";

const Brands = () => {
  const [admins, updateAdmins] = useState<Admin[]>([]);
  const [sortedAdmins, setSortedAdmins] = useState<Admin[]>([]);
  const [searchedAdmin, setSearchedAdmin] = useState<string>("");
  const [customerLocation, setCustomerLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const updateAdmin = useAdminStore((state) => state.updateAdmin);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchAdmins = async () => {
    try {
      // @todo - auth yapmak için users ile adminsi bağlayalım
      const { data, error } = await secretSupabase
        .from("admins")
        .select(
          "id, brand_name, brand_logo_ipfs_url, number_for_reward, nft_src, contract_address, not_used_nft_src, not_used_contract_address, coords"
        );
      if (error) {
        errorToast(
          "Kafeleri gösterirken bir sorun oluştu.",
          "Lütfen tekrar dener misiniz 👉👈."
        );
      } else {
        const admins: Admin[] = data.map((item) => ({
          id: item.id,
          brandName: item.brand_name,
          brandLogo: item.brand_logo_ipfs_url,
          numberForReward: item.number_for_reward,
          NFTSrc: item.nft_src,
          contractAddress: item.contract_address,
          notUsedNFTSrc: item.not_used_nft_src,
          notUsedContractAddress: item.not_used_contract_address,
          coords: {
            lat: item.coords.lat,
            long: item.coords.long,
          },
        }));
        if (searchedAdmin.length > 0) {
          const filteredAdmins = admins.filter(searchAdmin);
          updateAdmins(filteredAdmins);
        } else {
          updateAdmins(admins);
        }
      }
    } catch (error) {
      errorToast(
        "Bunu biz de beklemiyorduk 🤔",
        "Lütfen tekrar dener misiniz 👉👈"
      );
    }
  };

  /**
   * Searches for an admin based on the brand name.
   * @param admin - The admin object to search.
   * @returns True if the admin's brand name includes the searched admin, false otherwise.
   */
  const searchAdmin = (admin: Admin) => {
    return admin.brandName.toLowerCase().includes(searchedAdmin.toLowerCase());
  };

  /**
   * Selects a brand and updates the admin state.
   * @param item - The selected admin item.
   * @param index - The index of the selected admin item.
   */
  const selectBrand = async (item: Admin, index: number) => {
    updateAdmin(item);
    navigation.navigate("CustomerHome");
  };

  useEffect(() => {
    Geolocation.getCurrentPosition((info: GeolocationResponse) => {
      setCustomerLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude,
      });
    });
    fetchAdmins();
  }, [searchedAdmin]);

  /**
   * Sorts the array of admins based on their distance from the customer's location.
   * @param admins - The array of admins to be sorted.
   * @param customerLocation - The coordinates of the customer's location.
   * @returns The sorted array of admins.
   */
  useEffect(() => {
    if (!customerLocation) return;
    const sorted: Admin[] = [...admins].sort((a, b): any => {
      const distanceA = haversine(
        { lat: customerLocation.lat, lng: customerLocation.long },
        { lat: a.coords.lat, lng: a.coords.long }
      );
      const distanceB = haversine(
        { lat: customerLocation.lat, lng: customerLocation.long },
        { lat: b.coords.lat, lng: b.coords.long }
      );
      return distanceA - distanceB;
    });
    setSortedAdmins(sorted);
  }, [customerLocation, admins]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.black} />
      <BrandsSearch
        searchedAdmin={searchedAdmin}
        setSearchedAdmin={setSearchedAdmin}
      />
      <FlatList
        data={customerLocation ? sortedAdmins : admins}
        extraData={customerLocation ? sortedAdmins : admins}
        renderItem={({ item, index }: { item: Admin; index: number }) => (
          <BrandsList item={item} index={index} selectBrand={selectBrand} />
        )}
        keyExtractor={(item, index) => index.toString()}
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
    paddingTop: 50 * heightConstant,
  },
});

export default Brands;
