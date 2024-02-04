import { useState, useContext } from "react";
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
import {heightConstant, radiusConstant, widthConstant} from "./customs/CustomResponsiveScreen";

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
  // const { categoryType }: any = route.params;
  const categoryType: any = "Art";
  console.log("category", categoryType);
  const { username } = useContext(UserContext) || {}; // Add null check and default empty object
  const { user_id } = useContext(UserIdContext);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { tokens } = useContext(TokenContext); // replace AuthContext with your actual context

  const [taskDate, setTastDate] = useState<string>(
    new Date().toISOString().slice(0, -1)
  );

  const createMission = () => {
    const url = "/mission/create/";
    const data = {
      user: user_id,
      title: title,
      local_time: taskDate,
      category: categoryType,
    };

    const headers = {
      Authorization: `Bearer ${tokens?.access}`,
    };

    api
      .post(url, data, { headers })
      .then((response) => {
        if (response.status === 201) {
          console.log(new Date().toISOString().slice(0, -1));
          Alert.alert("Success", "Mission created");
          setTitle("");
          navigation.navigate("Active Missions");
        } else {
          // Handle other status codes here
        }
      })
      .catch((error) => {
        console.log(error.response);
        setErrorMessage(error.message);
        console.log(new Date().toISOString().slice(0, -1));
      });
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
                style={styles.formGradientBorder}>
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
    top: -20 * heightConstant,
  },
  formContainer: {
    // marginTop: 10,
  },

  gradientFormContainer: {
    alignItems: "center",
    marginTop: -100 * heightConstant,
    zIndex: -2,
  },
  formGradientBorder: {
    padding: 3.5 * widthConstant,
    borderRadius: 25 * radiusConstant,
    height: 347 * heightConstant, //height of the form
    width: 364 * widthConstant,
    zIndex: 0,
  },
  form: {
    height: 340 * heightConstant, //height of the form
    width: 357 * widthConstant,
    backgroundColor: "#1E1E1E",
    borderRadius: 20 * radiusConstant,
    zIndex: 0,
  },
  textHeading: {
    color: "#EFEEEE",
    fontSize: 35 * radiusConstant,
    marginTop: 80 * heightConstant,
    textAlign: "center",
  },
  missionInput: {
    width: 275 * widthConstant,
    height: 60 * heightConstant,
    backgroundColor: "#EFEEEE",
    borderRadius: 25 * radiusConstant,
    alignSelf: "center",
    marginTop: 50 * heightConstant,
    paddingLeft: 20 * widthConstant,
    fontSize: 18 * radiusConstant,
  },
  buttonContainer: {
    alignSelf: "flex-end",
    right: -20*widthConstant,
  },
});

export default AddTask;
