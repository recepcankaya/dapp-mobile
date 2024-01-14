import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Categories({ navigation }: { navigation: any }) {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>Choose Your Interest</Text>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate("Add Task")}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}>
              <Text style={styles.leftText}>Art</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Add Task")}>
          <View style={[styles.container, { marginRight: -15 }]}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}>
              <Text style={styles.rightText}>Working</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, { marginTop: 30 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("Add Task")}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}>
              <Text style={styles.leftText}>Sport</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Add Task")}>
          <View style={[styles.container, { marginRight: -15 }]}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}>
              <Text style={styles.rightText}>Language</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
      <View style={[styles.row, { marginTop: 30 }]}>
        <TouchableOpacity onPress={() => navigation.navigate("Add Task")}>
          <View style={styles.container}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}>
              <Text style={styles.leftText}>Literature</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Add Task")}>
          <View style={[styles.container, { marginRight: -15 }]}>
            <LinearGradient
              colors={["rgba(184, 13, 202, 0.50)", "rgba(64, 53, 203, 0.50)"]}
              style={styles.rectangle}>
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
    width: 225,
    height: 23,
    color: "#FFF",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
    marginTop: 44,
    alignSelf: "center",
    marginLeft: 50,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    marginLeft: -15,
  },
  rectangle: {
    width: 130,
    height: 105,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  leftText: {
    width: 108,
    height: 30,
    flexShrink: 0,
    color: "#D9D9D9",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
    marginLeft: 40,
  },
  rightText: {
    width: 108,
    height: 30,
    flexShrink: 0,
    color: "#D9D9D9",
    fontFamily: "Inter",
    fontSize: 20,
    fontStyle: "italic",
    fontWeight: "600",
  },
});
