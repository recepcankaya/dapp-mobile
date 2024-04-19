import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

import HomeHeader from "../../components/customer/home/HomeHeader";
import RenderTicket from "../../components/customer/home/ExRenderTicket";

import useUserStore from "../../store/userStore";
import useAdminStore from "../../store/adminStore";
import supabase from "../../lib/supabase";
import { heightConstant } from "../../ui/responsiveScreen";
import colors from "../../ui/colors";

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <HomeHeader />
      <RenderTicket userOrderNumber={userOrderNumber} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingTop: 20 * heightConstant,
  },
});

export default CustomerHome;
