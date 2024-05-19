import { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, Linking, TouchableOpacity, ScrollView } from "react-native";

import HomeHeader from "../../components/customer/home/HomeHeader";
import RenderTicket from "../../components/customer/home/RenderTicket";

import useUserStore from "../../store/userStore";
import useBrandStore from "../../store/brandStore";
import useBrandBranchStore from "../../store/brandBranchStore";
import supabase from "../../lib/supabase";
import { heightConstant } from "../../ui/responsiveScreen";
import colors from "../../ui/colors";

import { Video, ResizeMode } from 'expo-av';

import Carousel from "../../components/customer/home/CustomCarousel/Carousel";
import useBrandBranchDetailsStore from "../../store/brandBranchDetailsStore";

const CustomerHome = () => {
  const [totalTicketOrders, setTotalTicketOrders] = useState<number>(0);
  const userId = useUserStore((state) => state.user.id);
  const brand = useBrandStore((state) => state.brand);
  const brandId = useBrandStore((state) => state.brand.id);
  const brandBranch = useBrandBranchStore((state) => state.brandBranch);
  const brandBranchId = useBrandBranchStore((state) => state.brandBranch.id);
  const brandBranchDetails = useBrandBranchDetailsStore((state) => state.brandBranchDetails);
  const campaigns = useBrandBranchStore((state) => state.brandBranch.campaigns)?.map((campaign: any) => {
    return {
      image: campaign.campaign_image.replace("ipfs://", "https://ipfs.io/ipfs/"),
      favourite: campaign.favourite
    };
  })
  const brandBranchVideoUrl = useBrandBranchStore((state) => state.brandBranch.videoUrl);



  const decodeTurkishCharacters = (text: string) => {
    return text
      .replace(/Ğ/gim, "g")
      .replace(/Ü/gim, "u")
      .replace(/Ş/gim, "s")
      .replace(/I/gim, "i")
      .replace(/İ/gim, "i")
      .replace(/Ö/gim, "o")
      .replace(/Ç/gim, "c")
      .replace(/ğ/gim, "g")
      .replace(/ü/gim, "u")
      .replace(/ş/gim, "s")
      .replace(/ı/gim, "i")
      .replace(/ö/gim, "o")
      .replace(/ç/gim, "c")
      .replace(" ", "-");
  }

  const convertedBrandName = decodeTurkishCharacters(decodeURI(brand.brandName));
  const convertedBrandBranchName = decodeTurkishCharacters(decodeURIComponent(brandBranch.branchName));

  const { data: brandBranchMenu } = supabase
    .storage
    .from("menus")
    .getPublicUrl(`${convertedBrandName.toLowerCase()}-${convertedBrandBranchName.toLowerCase()}-menu.pdf`);

  const renderTickets = async () => {
    try {
      const { data } = await supabase
        .from("user_orders")
        .select("total_user_orders,total_ticket_orders")
        .eq("user_id", userId)
        .eq("brand_id", brandId)
        .eq("branch_id", brandBranchId);
      if (data && data.length > 0) {
        setTotalTicketOrders(data[0].total_ticket_orders);
      } else {
        setTotalTicketOrders(0);
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  // @todo - renderTickets() fonksiyonunu her brands'e girişte iki defa renderlıyor. Düzeltilmesi gerekiyor.
  useEffect(() => {
    renderTickets();
  }, [brand, totalTicketOrders]);

  useEffect(() => {
    const orders = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          setTotalTicketOrders(payload.new.total_ticket_orders);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(orders);
    };
  }, [totalTicketOrders]);

  const video = useRef(null);
  const [status, setStatus] = useState({});

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HomeHeader />
      <ScrollView>
        <RenderTicket totalTicketOrders={totalTicketOrders} ticketIpfsUrl={brand.ticketIpfsUrl} />
        <TouchableOpacity style={styles.menuButton} onPress={() => { console.log(brandBranchMenu.publicUrl); Linking.openURL(decodeTurkishCharacters(brandBranchMenu.publicUrl)) }}>
          <Text style={styles.menuText}>
            Menü
          </Text>
        </TouchableOpacity>
        {campaigns &&
          <Carousel data={campaigns} />
        }
        {brandBranchVideoUrl &&
          <View style={styles.container}>
            <Video
              ref={video}
              style={styles.video}
              source={{
                uri: brandBranchVideoUrl,
              }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          </View>
        }
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 20 * heightConstant,
  },
  menuButton: {
    padding: 10,
    paddingRight: 40,
    paddingLeft: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.white,
    alignSelf: 'center',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    color: colors.white,
    fontSize: 20
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomerHome;
