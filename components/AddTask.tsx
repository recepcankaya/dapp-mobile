import { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { TokenContext, TokenProvider } from "./context/TokenContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import AddMissionAttachment from "./SVGComponents/AddMissionAttachment";
import * as Font from "expo-font";
import { UserContext } from "./context/UserContext";
import { UserIdContext, UserIdProvider } from "./context/UserIdContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Calendar from "./customs/calendar";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomGradientButton from "./customs/CustomGradientButton";
import { getTimeZone } from "react-native-localize";
import { MissionFields, useMissionsStore } from "./store/missionsStore";

const { width, height } = Dimensions.get("window");

type TabParamList = {
  Profile: { username: string; tokens: Int32Array }; // Define parameters for Profile route here
  "Tasks List": undefined;
  "Add Task": undefined;
  // Other routes...
};

type AddTaskScreenNavigationProp = BottomTabNavigationProp<
  TabParamList,
  "Add Task"
>;

type AddTaskRouteProp = RouteProp<TabParamList, "Add Task">;

const api = axios.create({
  baseURL: "https://akikoko.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const AddTask = () => {
  const route = useRoute();
  const { categoryType }: any = route.params;
  const { username } = useContext(UserContext) || {}; // Add null check and default empty object
  const { user_id } = useContext(UserIdContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { tokens } = useContext(TokenContext); // replace AuthContext with your actual context
  const missions = useMissionsStore((state) => state.missions);

  const [taskDate, setTastDate] = useState<string>(
    new Date().toISOString().slice(0, -1)
  );

  const checkMissionsNameExist = (title: string) => {
    return missions.some(
      (mission: MissionFields) =>
        mission.title?.toLowerCase().replace(/\s/g, "") ===
        title.toLowerCase().replace(/\s/g, "")
    );
  };

  const createMission = async () => {
    if (checkMissionsNameExist(title)) {
      Alert.alert(
        "Oops!",
        "You've already added this task. 🙈 Try adding something new!"
      );
      return;
    }
    const url = "/mission/create/";
    const data = {
      user: user_id,
      title: title,
      local_time: taskDate,
      category: categoryType,
      timezone: getTimeZone(),
    };

    const headers = {
      Authorization: `Bearer ${tokens?.access}`,
    };

    // api
    //   .post(url, data, { headers })
    //   .then((response) => {
    //     if (response.status === 201) {
    //       console.log(new Date().toISOString().slice(0, -1));
    //       Alert.alert("Success", "Mission created");
    //       setTitle("");
    //       navigation.navigate("Active Missions");
    //     } else {
    //       // Handle other status codes here
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error.response);
    //     setErrorMessage(error.message);
    //     console.log(new Date().toISOString().slice(0, -1));
    //   });

    try {
      const response = await api.post(url, data, { headers });
      if (response.status === 201) {
        console.log(new Date().toISOString().slice(0, -1));
        Alert.alert("Success", "Mission created");
        setTitle("");
        navigation.navigate("Active Missions");
      } else {
        // Handle other status codes here
      }
    } catch (error: any) {
      console.log(error.response);
      setErrorMessage(error.message);
      console.log(new Date().toISOString().slice(0, -1));
    }
  };

  const onChangeDate = (date: { year: string; month: string; day: string }) => {
    const year = parseInt(date.year);
    const month = parseInt(date.month) - 1;
    const day = parseInt(date.day) + 1;
    const newDate = new Date(year, month, day);
    console.log("onChangeDate", date);
    console.log("New Date", newDate.toISOString().slice(0, -1));
    setTastDate(newDate.toISOString().slice(0, -1));
  };

  return (
    <TokenProvider>
      <UserIdProvider>
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
          <Calendar onChangeDate={(date) => console.log("date", date)} />
          <View style={styles.formContainer}>
            <View style={styles.attachContainer}>
              <AddMissionAttachment />
            </View>
            <View style={styles.gradientFormContainer}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={["#B80DCA", "#4035CB"]}
                style={styles.formGradientBorder}
              >
                <View style={styles.form}>
                  <Text style={styles.textHeading}>Add Mission</Text>
                  <TextInput
                    placeholder="Start building yourself"
                    placeholderTextColor="#0C0C0C"
                    style={styles.missionInput}
                    value={title}
                    onChangeText={setTitle}
                  />
                </View>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={createMission}>
              <CustomGradientButton text="Add" isLoading={false} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </UserIdProvider>
    </TokenProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#050505",
    justifyContent: "space-between",
  },
  attachContainer: {
    margin: "auto",
    alignItems: "center",
    top: -20,
  },
  formContainer: {
    // marginTop: 10,
  },
  circleContainer: {
    flexDirection: "row",
    gap: 65,
    marginTop: -80,
    zIndex: -1,
  },
  circle: {
    height: 90,
    width: 90,
    backgroundColor: "#050505",
    borderRadius: 50,
  },
  gradientFormContainer: {
    alignItems: "center",
    marginTop: -100,
    zIndex: -2,
  },
  formGradientBorder: {
    padding: 3,
    borderRadius: 20,
    height: 327, //height of the form
    width: 364,
    zIndex: 0,
  },
  form: {
    height: 320, //height of the form
    width: 357,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    zIndex: 0,
  },
  textHeading: {
    color: "#EFEEEE",
    fontSize: 35,
    marginTop: 80,
    textAlign: "center",
  },
  missionInput: {
    width: 275,
    height: 60,
    backgroundColor: "#EFEEEE",
    borderRadius: 25,
    alignSelf: "center",
    marginTop: 50,
    paddingLeft: 20,
    fontSize: 18,
  },
  buttonContainer: {
    alignSelf: "flex-end",
  },
});

export default AddTask;
