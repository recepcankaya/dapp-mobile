import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {heightConstant, radiusConstant, widthConstant} from "./customs/CustomResponsiveScreen";

export default function Categories({ navigation }: { navigation: any }) {
  const navigateToAddTask = (categoryType: string) => {
    navigation.navigate("Add Task", {
      categoryType: categoryType,
    });
  };
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Choose Your Interest</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigateToAddTask("Art")}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}
            >
              <Text style={styles.leftText}>Art</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToAddTask("Working")}>
          <View style={[styles.container, { marginRight: -24.5 * widthConstant }]}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}
            >
              <Text style={styles.rightText}>Working</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, { marginTop: 45 * heightConstant }]}>
        <TouchableOpacity onPress={() => navigateToAddTask("Sport")}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}
            >
              <Text style={styles.leftText}>Sport</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToAddTask("Language")}>
          <View style={[styles.container, { marginRight: -24.5 * widthConstant }]}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}
            >
              <Text style={styles.rightText}>Language</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, { marginTop: 45 * heightConstant }]}>
        <TouchableOpacity onPress={() => navigateToAddTask("Literature")}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}
            >
              <Text style={styles.leftText}>Literature</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateToAddTask("Music")}>
          <View style={[styles.container, { marginRight: -24.5 * widthConstant }]}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}
            >
              <Text style={styles.rightText}>Music</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#0C0C0C",
    flex: 1,
  },
  title: {
    height: 40 * heightConstant,
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 30 * radiusConstant,
    fontStyle: "italic",
    fontWeight: "600",
    marginTop: 60 * heightConstant,
    alignSelf: "center",
    marginBottom: 40 * heightConstant,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    marginLeft: -25 * widthConstant,
  },
  rectangle: {
    width: 195 * widthConstant,
    height: 150 * heightConstant,
    borderRadius: 30 * radiusConstant,
    justifyContent: "center",
    alignItems: "center",
  },
  leftText: {
    width: 150 * widthConstant,
    height: 45 * heightConstant,
    flexShrink: 0,
    color: "#D9D9D9",
    fontFamily: "Inter",
    fontSize: 30 * radiusConstant,
    fontStyle: "italic",
    fontWeight: "600",
    marginLeft: 50 * widthConstant,
  },
  rightText: {
    width: 150 * widthConstant,
    height: 45 * heightConstant,
    flexShrink: 0,
    color: "#D9D9D9",
    fontFamily: "Inter",
    fontSize: 30 * radiusConstant,
    fontStyle: "italic",
    fontWeight: "600",
    marginLeft: 25 * widthConstant,
  },
});
