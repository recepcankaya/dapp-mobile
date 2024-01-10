import { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { TokenContext, TokenProvider } from "./context/TokenContext";
import { RouteProp, useNavigation } from "@react-navigation/native";
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

const AddTask = ({ route }: { route: AddTaskRouteProp }) => {
  const { username } = useContext(UserContext) || {}; // Add null check and default empty object
  const { user_id } = useContext(UserIdContext);

  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { tokens } = useContext(TokenContext); // replace AuthContext with your actual context

  const createMission = () => {
    const url = "/mission/create/";
    const data = {
      user: user_id,
      title: title,
    };

    const headers = {
      Authorization: `Bearer ${tokens?.access}`,
    };

    api
      .post(url, data, { headers })
      .then((response) => {
        if (response.status === 201) {
          //console.log(response.data);
          Alert.alert("Success", "Mission created");
          setTitle("");
        } else {
          // Handle other status codes here
        }
      })
      .catch((error) => {
        console.log(error.response);
        setErrorMessage(error.message);
      });
  };

  return (
    <TokenProvider>
      <UserIdProvider>
        <View style={styles.container}>
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
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={createMission}>
                <Svg width="168" height="157" viewBox="0 0 177 157" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M109.119 6.28364C125.645 9.54071 136.874 23.7587 151.609 32.0213C167.73 41.0608 191.703 40.3053 199.769 57.1128C207.807 73.8619 191.716 92.3733 189.443 110.861C187.111 129.843 196.896 151.2 186.264 166.995C175.554 182.907 154.52 188.842 135.635 190.807C118.409 192.598 103.331 181.459 86.4893 177.372C68.4574 172.996 47.9926 177.249 33.1719 165.941C17.2693 153.808 5.09061 134.639 4.04704 114.473C3.02277 94.6792 18.9714 79.1193 27.7632 61.4214C36.1565 44.526 39.0109 23.3912 54.5136 12.8845C70.0737 2.33886 90.7526 2.66378 109.119 6.28364Z"
                    fill="#050505"
                    stroke="url(#gradient)"
                    strokeWidth="7"
                  />
                  <Defs>
                    <SvgLinearGradient
                      id="gradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0">
                      <Stop offset="0%" stopColor="#B80DCA" />
                      <Stop offset="100%" stopColor="#4035CB" />
                    </SvgLinearGradient>
                  </Defs>
                  {/* @todo - link the font later */}
                  <SvgText
                    fill="#efeeee"
                    fontSize="32"
                    fontFamily="rosarivo"
                    x="55%" // center and a little bit right horizontally
                    y="55%" // center and a little bit bottom vertically
                    textAnchor="middle" // align text to the middle
                    alignmentBaseline="middle" // align text vertically
                  >
                    Done
                  </SvgText>
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </UserIdProvider>
    </TokenProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#050505",
  },
  attachContainer: {
    margin: "auto",
    alignItems: "center",
  },
  formContainer: {
    marginTop: 150,
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
    marginTop: -80,
    zIndex: -2,
  },
  formGradientBorder: {
    padding: 3,
    borderRadius: 20,
    height: 427,
    width: 364,
  },
  form: {
    height: 420,
    width: 357,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
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
    alignItems: "flex-end",
  },
});

export default AddTask;
