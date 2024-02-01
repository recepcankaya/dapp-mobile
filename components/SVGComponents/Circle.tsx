import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Circle() {
  return (
    <LinearGradient
      colors={["#B80DCA", "#4035CB"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.circle}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    transform: [{ rotate: "-179.736deg" }],
    borderWidth: 5,
    borderColor: "#B80DCA",
    backgroundColor: "solid",
    position: "absolute",
    top: -545,
    alignSelf: "center",
    width: 650.637,
    height: 739.49,
    borderRadius: 739.49,
  },
});
