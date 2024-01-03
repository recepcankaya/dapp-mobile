import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Font from "expo-font";
import axios from "axios";
import { TokenContext, TokenProvider } from "./context/TokenContext";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { UserContext } from "./context/UserContext";
import { UserIdContext,UserIdProvider } from "./context/UserIdContext";

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

type CustomTextProps = {
  style?: object;
  children: React.ReactNode;
};

const CustomText = (props: CustomTextProps) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        "custom-font": require("../assets/fonts/Inter-Regular.ttf"),
      });

      setFontLoaded(true);
    }

    loadFont();
  }, []);

  if (!fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <Text style={{ ...props.style, fontFamily: "Inter" }}>
      {props.children}
    </Text>
  );
};

const AddTask = ({ route }: { route: AddTaskRouteProp }) => {
  const { username } = useContext(UserContext) || {}; // Add null check and default empty object
  const { user_id } = useContext(UserIdContext);


  const navigation = useNavigation<AddTaskScreenNavigationProp>();
  const { tokens } = useContext(TokenContext); // replace AuthContext with your actual context
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

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
        console.log(error.response)
        setErrorMessage(error.message);
      });
  };

  return (
    <TokenProvider>
      <UserIdProvider>
      <View style={styles.container}>
        <LinearGradient
          colors={["#DC00C6", "#2400B4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.background}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.profileIconContainer}>
              <View style={styles.circle}>
                <Image
                  source={require("../assets/profile_pic.png")}
                  style={{ width: "100%", height: "100%", borderRadius: 50 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.rectanglesContainer}>
                <View style={styles.rectangle1}>
                  <CustomText style={styles.text}> {username}</CustomText>
                </View>
                <View style={styles.rectangle2}>
                  <CustomText style={styles.text}> Level 0</CustomText>
                </View>
              </View>
            </View>
            <View style={styles.taskInputHeaderContainer}>
              <LinearGradient
                colors={["#CE00DB", "#130090"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.taskInputHeader}>
                <CustomText style={styles.text}>Add Task</CustomText>
                <TextInput
                  style={styles.textInput}
                  placeholder=""
                  value={title}
                  onChangeText={setTitle}
                />
                <View style={styles.taskIconContainer}>
                  <TouchableOpacity
                    style={styles.taskIcon1}
                    onPress={createMission}>
                    <Image source={require("../assets/ic_positive.png")} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.taskIcon2}
                    onPress={() => setTitle("")}>
                    <Image source={require("../assets/ic_negative.png")} />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
      </UserIdProvider>
    </TokenProvider>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  container: {
    flex: 1,
  },
  profileIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    top: 0,
    position: "relative",
  },
  circle: {
    width: 73,
    height: 73,
    borderRadius: 73 / 2,
    backgroundColor: "lightblue",
    left: 10,
    elevation: 1,
    zIndex: 1,
  },
  text: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 15,
    fontStyle: "normal",
    //fontWeight: '300',
    lineHeight: 28,
    letterSpacing: 1.2,
  },
  rectanglesContainer: {
    flexDirection: "column",
    marginLeft: -5,
    elevation: 0,
  },
  rectangle1: {
    width: 133,
    height: 26,
    backgroundColor: "#AD00D1",
    borderRadius: 13,
    marginBottom: 0, // Adjust as needed
    //justifyContent: 'center',
    //alignItems: 'center',
  },
  rectangle2: {
    width: 133,
    height: 26,
    backgroundColor: "#AE03B9",
    borderRadius: 13,
    //justifyContent: 'center',
    //alignItems: 'center',
    marginLeft: -5,
  },
  taskInputHeaderContainer: {
    flexDirection: "column",
    marginTop: 10,
    alignItems: "center",
  },
  taskInputHeader: {
    width: 278,
    height: 31,
    borderRadius: 13,
  },
  textInput: {
    width: 337,
    height: 227,
    borderRadius: 46,
    backgroundColor: "#FFF",
    padding: 10, // Add padding to make the text not stick to the edge
    alignSelf: "center",
    textAlign: "center",
    fontSize: 25,
    fontFamily: "sans-serif",
  },
  taskIconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  taskIcon1: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFF",
    left: -35,
    justifyContent: "center",
    alignItems: "center",
  },
  taskIcon2: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#FFF",
    left: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddTask;
