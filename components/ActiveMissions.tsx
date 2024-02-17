import { useState, useRef, useContext, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Text,
  ActivityIndicator,
} from "react-native";
import Svg, {
  Path,
  LinearGradient,
  Stop,
  Defs,
  Ellipse,
  G,
} from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import ConfettiCannon from "react-native-confetti-cannon";
import { getTimeZone } from "react-native-localize";

import { TokenContext } from "./context/TokenContext";
import Calendar from "./customs/calendar";
import Confetti from "./customs/confetti";
import { api } from "./utils/api";

import { useMissionsStore, MissionFields } from "./store/missionsStore";

const { width } = Dimensions.get("screen");
const missionItemHeight = width / 3.8333;

function ActiveMissions() {
  const [filteredMissions, setFilteredMissions] = useState<MissionFields[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false);
  const { tokens } = useContext(TokenContext);
  const confettiCannonRef = useRef<ConfettiCannon>(null);
  const missions: MissionFields[] = useMissionsStore((state) => state.missions);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getMissions = async () => {
    try {
      const url = `/user/mission_list?local_time=${new Date()
        .toISOString()
        .slice(0, -1)}&timezone=${getTimeZone()}`;
      const headers = {
        Authorization: `Bearer ${tokens?.access}`,
      };
      const response = await api.get(url, { headers });
      missions.length = 0;
      missions.push(...response.data);
      setFilteredMissions(response.data);
    } catch (error: any) {
      Alert.alert("Oops! 😬", String(error.response.data.errorMessage[0]));
    }
  };

  const completeMission = async (id: number) => {
    try {
      setIsLoading(true);
      setConfettiVisible(true);
      const url = `/mission/complete/${id}/`;
      const headers = {
        Authorization: `Bearer ${tokens?.access}`,
      };
      await api.patch(
        url,
        {
          local_time: new Date().toISOString().slice(0, -1),
          timezone: getTimeZone(),
        },
        { headers }
      );
      await getMissions().finally(() => confettiCannonRef.current?.start());
      Alert.alert(
        "You are rocking!",
        "You completed today's mission. Keep up the good work! As your reward, we sent LDT token to your account🥳🎉"
      );
    } catch (error: any) {
      Alert.alert(
        "You completed today's mission!",
        "This is good news, but you can't finish it again today. Come back for tomorrow. We will be waiting for you! 🏆🕒"
      );
    }
    setIsLoading(false);
  };

  /**
   * Handles the change event of the date picker.
   * Filters the missions based on the selected date.
   * @param {Date} date - The selected date.
   */
  const onChangeDate = (date: Date) => {
    const changedDate = new Date(date);
    changedDate.setHours(0, 0, 0, 0);
    setFilteredMissions(
      missions.filter(
        (mission) =>
          mission.startDate != null &&
          isWithinRange(mission.startDate, changedDate)
      )
    );
  };

  /**
   * Checks if a given date is within a range of 21 days from a start date.
   * @param startDate - The start date of the range in string format.
   * @param changedDate - The date to check if it falls within the range.
   * @returns True if the changed date is within the range, false otherwise.
   */
  const isWithinRange = (startDate: string, changedDate: Date) => {
    const missionStartDate: Date = new Date(startDate);
    missionStartDate.setHours(0, 0, 0, 0);
    const missionEndDate: Date = new Date(missionStartDate);
    missionEndDate.setDate(missionEndDate.getDate() + 21);
    return missionStartDate <= changedDate && changedDate <= missionEndDate;
  };

  useFocusEffect(
    useCallback(() => {
      getMissions();
    }, [])
  );

  const missionsRenderItem = ({ item }: any) => {
    return (
      <View style={styles.missionItemContainer}>
        <Svg
          width={width}
          height={107}
          viewBox="0 0 414 107"
          fill="none"
          style={{ position: "absolute" }}
        >
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
              gradientUnits="userSpaceOnUse"
            >
              <Stop stopColor="#B80DCA" />
              <Stop offset={1} stopColor="#4035CB" />
            </LinearGradient>
          </Defs>
        </Svg>
        <View style={styles.missionsItem}>
          <TouchableOpacity
            style={styles.missionsItemCheckBox}
            onPress={() => completeMission(item.id)}
          >
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
                    gradientUnits="userSpaceOnUse"
                  >
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
            <Text style={styles.missionText}>{item.title}</Text>
            <View style={{ flex: 2.5 }}></View>
          </View>
          <View style={styles.missionNumber}>
            <Text style={styles.missionNumberText}>{item.numberOfDays}</Text>
            <Text style={styles.missionNumberText}>{21}</Text>
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
          <Text style={styles.missionsListHeaderText}>Active Missions</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {confettiVisible && (
        <Confetti
          ref={confettiCannonRef}
          onAnimationEnd={() => setConfettiVisible(false)}
        />
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} color={"#B80DCA"} />
        </View>
      )}
      <View style={{ height: 100 }}>
        <Calendar
          onChangeDate={(date) => {
            const formattedDate = `${date.yearIndex + 2024}-${
              date.monthIndex + 1
            }-${date.dayIndex + 1}`;

            setSelectedDate(new Date(formattedDate));
            onChangeDate(new Date(formattedDate));
          }}
        />
      </View>

      <View style={{ flex: 1, paddingBottom: 46, marginBottom: 15 }}>
        <FlatList
          data={filteredMissions}
          extraData={filteredMissions}
          renderItem={({ item, index }) => missionsRenderItem({ item, index })}
          style={styles.missionsList}
          contentContainerStyle={{ alignItems: "center" }}
          ListHeaderComponent={missionsHeaderComponent()}
        />
      </View>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get("screen").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
    paddingBottom: 40,
    paddingTop: StatusBar.currentHeight,
    height: 40,
  },
  text: {
    color: "#fff",
  },
  missionsList: {
    paddingTop: 40,
    paddingBottom: 50,
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
    color: "#fff",
    fontSize: 25,
  },
  missionsListAddButton: {
    color: "#fff",
    fontSize: 50,
  },
  missionItemContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    minHeight: missionItemHeight,
  },
  missionsItem: {
    minHeight: 110,
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
  missionNumber: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
    left: 0,
  },
  missionNumberText: {
    color: "#4035CB",
    fontSize: 18,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
  },
});

export default ActiveMissions;
