import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {heightConstant, radiusConstant, widthConstant} from "../customs/CustomResponsiveScreen";

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
    borderWidth: 5*radiusConstant,
    borderColor: "#B80DCA",
    backgroundColor: "solid",
    position: "absolute",
    top: -545*heightConstant,
    alignSelf: "center",
    width: 650.637*widthConstant,
    height: 739.49*heightConstant,
    borderRadius: 739.49*radiusConstant,
  },
});
