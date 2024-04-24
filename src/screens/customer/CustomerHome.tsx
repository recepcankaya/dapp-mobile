import { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Dimensions, View, Text, Image, Linking, TouchableOpacity, Button, ScrollView } from "react-native";

import HomeHeader from "../../components/customer/home/HomeHeader";
import RenderTicket from "../../components/customer/home/RenderTicket";

import useUserStore from "../../store/userStore";
import useAdminStore from "../../store/adminStore";
import supabase from "../../lib/supabase";
import { heightConstant } from "../../ui/responsiveScreen";
import colors from "../../ui/colors";

import { Video, ResizeMode } from 'expo-av';

const { width, height } = Dimensions.get("window");

import Carousel from "../../components/customer/home/CustomCarousel/Carousel";

const CustomerHome = () => {
  const [userOrderNumber, setUserOrderNumber] = useState<number>(0);
  const userID = useUserStore((state) => state.user.id);
  const admin = useAdminStore((state) => state.admin);

  const renderTickets = async () => {
    try {
      const { data } = await supabase
        .from("user_missions")
        .select("number_of_orders")
        .eq("user_id", userID)
        .eq("admin_id", admin.id);
      if (data && data.length > 0) {
        setUserOrderNumber(data[0].number_of_orders);
      } else {
        setUserOrderNumber(0);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  // @todo - renderTickets() fonksiyonunu her brands'e girişte iki defa renderlıyor. Düzeltilmesi gerekiyor.
  useEffect(() => {
    renderTickets();
  }, [admin, userOrderNumber]);

  useEffect(() => {
    const orders = supabase
      .channel("orders-change-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_missions",
          filter: `user_id=eq.${userID}`,
        },
        (payload: any) => {
          setUserOrderNumber(payload.new.number_of_orders);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(orders);
    };
  }, [userOrderNumber]);

  const video = useRef(null);
  const [status, setStatus] = useState({});

  const campaigns = useAdminStore((state) => state.admin.campaigns).map((campaign) => {
    return {
      image: campaign.campaign_image.replace("ipfs://", "https://ipfs.io/ipfs/"),
    };
  });

  const brandVideoUrl = useAdminStore((state) => state.admin.brandVideoUrl);

  useEffect(() => {
    console.log("brandVideoUrl", brandVideoUrl)
  }, [brandVideoUrl])

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HomeHeader />
      <ScrollView>
        <RenderTicket userOrderNumber={userOrderNumber} ticketImage={admin.ticketImage} />
        <TouchableOpacity style={styles.menuButton} onPress={() => Linking.openURL("http://claincoffe.com")}>
          <Text style={styles.menuText}>
            Menü
          </Text>
        </TouchableOpacity>
        <Carousel data={campaigns} />
        <View style={styles.container}>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: brandVideoUrl,
            }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        </View>
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
