import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "react-native/Libraries/NewAppScreen";
import CustomText from "./customs/CustomText";
import Svg, {
  Path,
  LinearGradient,
  Stop,
  Defs,
  Ellipse,
  G,
} from "react-native-svg";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { TokenContext } from "./context/TokenContext";
import Calendar from "./customs/calendar";

const { width } = Dimensions.get("screen");
const missionItemHeight = width / 3.8333;

function ActiveMissions() {
  const { tokens } = useContext(TokenContext);
  const [missions, setMissions] = useState<any[]>([]);
  const [copyOfMissions, setCopyOfMissions] = useState<any[]>(missions);
  const [filteredMissions, setFilteredMissions] = useState<any[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    console.log("selectedDate", selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    console.log("filteredMissions", filteredMissions);
    console.log("missions", missions);
    setFilteredMissions(missions);
  }, [filteredMissions, missions]);

  const api = axios.create({
    baseURL: "https://akikoko.pythonanywhere.com/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const onChangeDate = (date: Date) => {
    console.log("test", new Date());
    console.log(
      "new Date()",
      new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
    );
    console.log(
      "filteredMissions",
      copyOfMissions.filter((mission) => mission.startDate > date)
    );
    setFilteredMissions(
      copyOfMissions.filter(
        (mission) =>
          mission.startDate > date &&
          mission.startDate <
            new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1)
      )
    );

    // setFilteredMissions(copyOfMissions);
  };

  const getMissions = async () => {
    const url = "/user/mission_list/"; // replace with the actual endpoint

    const headers = {
      Authorization: `Bearer ${tokens?.access}`,
    };

    try {
      const response = await api.get(url, { headers });
      console.log("missions", response.data);
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
            {item.isCompleted ? (
              <Svg width={47} height={50} viewBox="0 0 47 50" fill="none">
                <G filter="url(#filter0_di_479_3)">
                  <G filter="url(#filter1_f_479_3)">
                    <Ellipse
                      cx={23.5}
                      cy={23}
                      rx={19.5}
                      ry={19}
                      fill="#D9D9D9"
                    />
                  </G>
                  <G filter="url(#filter2_d_479_3)">
                    <Ellipse
                      cx={23.5}
                      cy={23}
                      rx={19.5}
                      ry={19}
                      fill="#D9D9D9"
                      fillOpacity={0.7}
                      // shapeRendering="crispEdges"
                    />
                  </G>
                  <Path
                    d="M32.047 10l-2.373 2.948-9.562 11.383-2.786-3.194-2.476-2.948L10 23.962l2.476 2.948 5.16 6.142L20.009 36l2.476-2.948 12.039-14.33L37 15.772 32.047 10z"
                    fill="url(#paint0_linear_479_3)"
                  />
                </G>
                <Defs>
                  <LinearGradient
                    id="paint0_linear_479_3"
                    x1={23.5}
                    y1={10}
                    x2={23.5}
                    y2={36}
                    gradientUnits="userSpaceOnUse">
                    <Stop stopColor="#B80DCA" />
                    <Stop offset={1} stopColor="#4035CB" />
                  </LinearGradient>
                </Defs>
              </Svg>
            ) : (
              <Svg width={39} height={38} viewBox="0 0 39 38" fill="none">
                <Ellipse
                  cx={19.5}
                  cy={19}
                  rx={19.5}
                  ry={19}
                  fill="#B80DCA"
                  fillOpacity={0.1}
                />
                <Path
                  d="M28.047 6l-2.373 2.948-9.562 11.383-2.786-3.194-2.476-2.948L6 19.962l2.476 2.948 5.16 6.142L16.009 32l2.476-2.948 12.039-14.33L33 11.772 28.047 6z"
                  fill="#D9D9D9"
                  fillOpacity={0.1}
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <Calendar
        onChangeDate={(date) => {
          console.log("date-active missions", date);
          setSelectedDate(date);
          onChangeDate(date);
        }}
      />
      {/* <View style={{ height: 120 }}>
        <Agenda
          selected={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
        />
      </View> */}
      <FlatList
        data={filteredMissions}
        extraData={filteredMissions}
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
