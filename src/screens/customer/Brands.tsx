import { useEffect, useState } from "react";
import { StyleSheet, FlatList, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import Geolocation, {
  GeolocationResponse,
} from "@react-native-community/geolocation";

import BrandsSearch from "../../components/customer/brands/BrandsSearch";

import { secretSupabase } from "../../lib/supabase";
import { haversine } from "../../lib/haversine";
import { heightConstant } from "../../ui/responsiveScreen";
import { errorToast } from "../../ui/toast";
import colors from "../../ui/colors";
import useBrandBranchDetailsStore from "../../store/brandBranchDetailsStore";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";
import BrandBranchesList from "../../components/customer/brands/BrandBranchesList";

const Brands = () => {
  const brand = useBrandStore((state) => state.brand);
  const setBrand = useBrandStore((state) => state.setBrand);
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  const setBrandBranch = useBrandBranchStore((state) => state.setBrandBranch);

  const [brandBrachDetails, setBrandBranchDetails] = useState<BrandBranchDetails[]>([] as BrandBranchDetails[]);
  const [sortedBrandBranchesDetails, setSortedBrandBranchesDetails] = useState<BrandBranchDetails[]>([] as BrandBranchDetails[]);
  const [searchedBrandBranchDetails, setSearchedBrandBranchDetails] = useState<string>("");
  const [customerLocation, setCustomerLocation] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const updateBrandBranchDetails = useBrandBranchDetailsStore((state) => state.setBrandBranchDetails);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const fetchBrandBranchesDetails = async () => {
    try {
      const { data, error } = await secretSupabase
        .from("brand_branch")
        .select("id, branch_name, coords, campaigns, video_url, brand( id, brand_name, brand_logo_ipfs_url, ticket_ipfs_url, nft_src, contract_address, required_number_for_free_right, free_right_image_url )")
      console.log('data', data);

      if (error) {
        errorToast(
          "Kafeleri gösterirken bir sorun oluştu.",
          "Lütfen tekrar dener misiniz 👉👈."
        );
      } else {
        const brandBranchesDetails: BrandBranchDetails[] = data.map((item) => ({
          id: item.id,
          branchName: item.branch_name,
          coords: {
            lat: item.coords.lat,
            long: item.coords.long,
          },
          campaigns: item.campaigns,
          videoUrl: item.video_url,
          brandId: item.brand.id,
          brandName: item.brand.brand_name,
          brandLogoIpfsUrl: item.brand.brand_logo_ipfs_url,
          ticketIpfsUrl: item.brand.ticket_ipfs_url,
          nftSrc: item.brand.nft_src,
          contractAddress: item.brand.contract_address,
          requiredNumberForFreeRight: item.brand.required_number_for_free_right,
          freeRightImageUrl: item.brand.free_right_image_url,
        }));
        if (searchedBrandBranchDetails.length > 0) {
          const filteredBrandBranches = brandBranchesDetails.filter(searchBrandBranchesDetails);
          setBrandBranchDetails(filteredBrandBranches);
        } else {
          setBrandBranchDetails(brandBranchesDetails);
        }
      }
    } catch (error) {

      errorToast(
        "Bunu biz de beklemiyorduk 🤔",
        "Lütfen tekrar dener misiniz 👉👈"
      );
    }
  }
  /**
    * Searches for a brandBranchDetails based on the brand name.
     * @param brandBranchDetails - The brandBranchDetails object to search.
     * @returns True if the brandBranchDetials's brand name includes the searched brandBranchDetails, false otherwise.
     */
  const searchBrandBranchesDetails = (brandBranchDetails: BrandBranchDetails) => {
    return brandBranchDetails.brandName.toLowerCase().includes(searchedBrandBranchDetails.toLowerCase());
  }

  /**
   * Selects a brandBranchDetails and updates the brandBranchDetails state.
   * @param item - The selected brandBranchDetails item.
   * @param index - The index of the selected brandBranchDetails item.
   */

  const selectBrandBranchDetails = async (item: BrandBranchDetails, index: number) => {
    updateBrandBranchDetails(item);
    setBrand({
      ...brand,
      id: item.brandId,
      brandName: item.brandName,
      brandLogoIpfsUrl: item.brandLogoIpfsUrl,
      ticketIpfsUrl: item.ticketIpfsUrl,
      nftSrc: item.nftSrc,
      contractAddress: item.contractAddress,
      requiredNumberForFreeRight: item.requiredNumberForFreeRight,
      freeRightImageUrl: item.freeRightImageUrl,
    });
    setBrandBranch({
      ...brandBranch,
      id: item.id,
      branchName: item.branchName,
      coords: item.coords,
      campaigns: item.campaigns,
      videoUrl: item.videoUrl,
    });
    navigation.navigate("TabNavigator", { screen: "Home" });
  }

  useEffect(() => {
    Geolocation.getCurrentPosition((info: GeolocationResponse) => {
      setCustomerLocation({
        lat: info.coords.latitude,
        long: info.coords.longitude,
      });
    });
    fetchBrandBranchesDetails();
  }, [searchedBrandBranchDetails]);

  /**
   * Sorts the array of admins based on their distance from the customer's location.
   * @param admins - The array of admins to be sorted.
   * @param customerLocation - The coordinates of the customer's location.
   * @returns The sorted array of admins.
   */
  useEffect(() => {
    if (!customerLocation) return;
    const sorted: BrandBranchDetails[] = [...brandBrachDetails].sort((a, b): any => {
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
    setSortedBrandBranchesDetails(sorted);
  }, [customerLocation, brandBrachDetails]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.black} />
      <BrandsSearch
        searchedAdmin={searchedBrandBranchDetails}
        setSearchedAdmin={setSearchedBrandBranchDetails}
      />
      <FlatList
        data={customerLocation ? sortedBrandBranchesDetails : brandBrachDetails}
        extraData={customerLocation ? sortedBrandBranchesDetails : brandBrachDetails}
        renderItem={({ item, index }: { item: BrandBranchDetails; index: number }) => (
          <BrandBranchesList item={item} index={index} selectBrandBranch={selectBrandBranchDetails} />
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
