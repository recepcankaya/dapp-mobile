import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CustomText from "./customs/CustomText";
import Svg, { Path, LinearGradient, Stop, Defs } from "react-native-svg";
import { Agenda } from "react-native-calendars";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { MissionContext } from "./context/MissionContext";
import { TokenContext } from "./context/TokenContext";
import { UserContext } from "./context/UserContext";

const { width } = Dimensions.get("screen");
const missionItemHeight = width / 3.8333;
function ActiveMissions() {
  const { tokens } = useContext(TokenContext);
  const [missions, setMissions] = useState<any[]>([]);
  const { username } = useContext(UserContext);

  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    console.log("selectedDate", selectedDate);
  }, [selectedDate]);

  // const [missions, setMissions] = useState([
  //   { isCompleted: false, title: "swim 1 hour" },
  //   { isCompleted: true, title: "Mission 2" },
  //   { isCompleted: false, title: "Mission 3" },
  //   { isCompleted: true, title: "Mission 2" },
  //   { isCompleted: false, title: "Mission 3" },
  //   { isCompleted: true, title: "Mission 2" },
  //   { isCompleted: false, title: "Mission 3" },
  // ]);
  //yorum satırı

  const api = axios.create({
    baseURL: "https://akikoko.pythonanywhere.com/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const onDayChange = (day: any) => {
    console.log(day);
  };

  const getMissions = async () => {
    const url = "/user/mission_list/"; // replace with the actual endpoint

    const headers = {
      Authorization: `Bearer ${tokens?.access}`,
    };

    try {
      const response = await api.get(url, { headers });
      setMissions(response.data);
    } catch (error) {
      console.error(error);
      if ((error as any).response) {
        console.log((error as any).response.data);
        console.log((error as any).response.status);
      } else if ((error as any).request) {
        console.log((error as any).request);
      } else {
        console.log("Error", (error as any).message);
        console.log(error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getMissions();
    }, [])
  );

  const completeMission = async (id: any) => {
    const url = `https://akikoko.pythonanywhere.com/api/mission/complete/${id}/`;
    const headers = {
      Authorization: `Bearer ${tokens?.access}`,
    };

    try {
      const response = await axios.patch(url, id, { headers });
      if (response.status === 200) {
        console.log(response.data);
        Alert.alert(response.data.message);
        getMissions();
      }
    } catch (error) {
      //console.error(error);
      if ((error as any).response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        Alert.alert((error as any).response.data.message);
        console.log((error as any).response.data);
        console.log((error as any).response.status);
      } else if ((error as any).request) {
        // The request was made but no response was received
        console.log((error as any).request);
        console.log(id);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", (error as any).message);
      }
    }
  };

  const missionsRenderItem = ({ item, index }: any) => {
    return (
      <View style={styles.missionItemContainer}>
        <Svg
          width={width}
          height={107}
          viewBox="0 0 414 107"
          fill="none"
          style={{ position: "absolute" }}>
          <Path
            d="M410.224 91.79c-.074 7.837-7.257 13.673-14.942 12.141L212.931 67.595a17.499 17.499 0 00-6.422-.078L17.314 100.461C9.621 101.8 2.597 95.836 2.671 88.027l.39-41.2a12.5 12.5 0 0110.48-12.218l193.963-31.74a12.499 12.499 0 014.319.05l188.592 35.313a12.501 12.501 0 0110.199 12.405l-.39 41.154z"
            fill="#0C0C0C"
            stroke="url(#paint0_linear_53_15)"
            strokeWidth={5}
          />
          <Defs>
            <LinearGradient
              id="paint0_linear_53_15"
              x1={722.523}
              y1={41.1111}
              x2={723.204}
              y2={-30.722}
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#B80DCA" />
              <Stop offset={1} stopColor="#4035CB" />
            </LinearGradient>
          </Defs>
        </Svg>
        <View style={styles.missionsItem}>
          <TouchableOpacity
            style={styles.missionsItemCheckBox}
            onPress={() => completeMission(item.id)}>
            {item.isCompleted && (
              <Svg width={27} height={26} viewBox="0 0 27 26" fill="none">
                <Path
                  d="M22.0471 0L19.6739 2.94803L10.1121 14.3307L7.32612 11.137L4.84968 8.18898L0 13.9622L2.47643 16.9102L7.63567 23.052L10.0089 26L12.4853 23.052L24.5236 8.72126L27 5.77323L22.0471 0Z"
                  fill="#9EE628"
                  fillOpacity={0.5}
                />
              </Svg>
            )}
          </TouchableOpacity>
          <View style={styles.missionTextContainer}>
            <View style={{ flex: 1 }}></View>
            <CustomText style={styles.missionText}>{item.title}</CustomText>
            <View style={{ flex: 2.5 }}></View>
          </View>
          <TouchableOpacity style={styles.missionsItemOptions}>
            <View style={styles.missionsItemOption}></View>
            <View style={[styles.missionsItemOption]}></View>
            <View style={[styles.missionsItemOption]}></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const missionsHeaderComponent = () => {
    return (
      <View style={styles.missionsListHeader}>
        <View style={styles.missionsListHeaderTop}>
          <CustomText style={styles.missionsListHeaderText}>
            Active Missions
          </CustomText>
        </View>
        <TouchableOpacity style={styles.missionsListHeaderBottom}>
          <CustomText style={styles.missionsListAddButton}>+</CustomText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View style={{ height: 120 }}>
        <Agenda
          selected={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
        />
      </View>
      <FlatList
        data={missions}
        extraData={missions}
        renderItem={({ item, index }) => missionsRenderItem({ item, index })}
        style={styles.missionsList}
        contentContainerStyle={{ alignItems: "center" }}
        ListHeaderComponent={missionsHeaderComponent()}
      />
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  text: {
    color: Colors.white,
  },
  missionsList: {
    paddingTop: 20,
  },
  missionsListHeader: { height: 100, width: screenWidth - 50 },
  missionsListHeaderTop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  missionsListHeaderBottom: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 10,
  },
  missionsListHeaderText: {
    color: Colors.white,
    fontSize: 25,
  },
  missionsListAddButton: {
    color: Colors.white,
    fontSize: 50,
  },
  missionItemContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    height: missionItemHeight,
  },
  missionsItem: {
    height: 110,
    width: screenWidth / 1.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
  },
  missionsItemCheckBox: {
    height: 35,
    width: 35,
    borderRadius: 20,
    backgroundColor: "#d9d9d94d",
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  missionTextContainer: {
    height: missionItemHeight,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  missionText: {
    color: "white",
    fontSize: 20,
  },
  missionsItemOptions: {
    borderRadius: 10,
    alignItems: "center",
    width: 20,
    marginTop: 17,
  },
  missionsItemOption: {
    height: 10,
    width: 10,
    borderRadius: 20,
    backgroundColor: "white",
    marginTop: 3,
    zIndex: 10,
    elevation: 10,
  },
});

export default ActiveMissions;
