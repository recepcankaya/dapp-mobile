import { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, StatusBar, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { TokenContext, TokenProvider } from "./context/TokenContext";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import Svg, {
  Mask,
  Rect,
  Path,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";
import AddMissionAttachment from "./SVGComponents/AddMissionAttachment";

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
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { tokens } = useContext(TokenContext); // replace AuthContext with your actual context
  const navigation = useNavigation<AddTaskScreenNavigationProp>();

  const createMission = () => {
    const url = "/mission/create/";
    const data = {
      user: tokens?.access,
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
        Alert.alert("One mission per day");
        setErrorMessage(error.message);
      });
  };

  return (
    <TokenProvider>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View>
            <AddMissionAttachment />
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#B80DCA", "#4035CB"]}
              style={styles.formGradientBorder}>
              <View style={styles.form}></View>
            </LinearGradient>
          </View>
          <View style={styles.buttonContainer}>
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
                <SvgLinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0%" stopColor="#B80DCA" />
                  <Stop offset="100%" stopColor="#4035CB" />
                </SvgLinearGradient>
              </Defs>
            </Svg>
            <Text style={styles.buttonText}>Done</Text>
          </View>
        </View>
      </View>
    </TokenProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: "#050505",
  },
  formContainer: {
    marginTop: 150,
  },
  formGradientBorder: {
    padding: 3,
    borderRadius: 20,
  },
  form: {
    height: 364,
    width: 364,
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "flex-end",
  },
  buttonText: {
    color: "#efeeee",
    fontSize: 25,
    fontFamily: "rosarivo",
  },
});

export default AddTask;
