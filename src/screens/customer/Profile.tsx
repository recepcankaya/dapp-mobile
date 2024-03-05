import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import {
  heightConstant,
  radiusConstant,
  widthConstant,
} from "../../ui/responsiveScreen";
import useUserStore from "../../store/userStore";

export default function Profile() {
  const [selectedTab, setSelectedTab] = useState("Waiting");
  const username = useUserStore((state) => state.user.username);

  const waitingIcons = [{ key: "1", source: require("../../assets/Star.png") }];

  const collectionIcons = [
    { key: "1", source: require("../../assets/Arab.png") },
    { key: "2", source: require("../../assets/Mean.png") },
    { key: "3", source: require("../../assets/Mio.png") },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{username}</Text>
      <View style={styles.tabsContainer}>
        <TouchableOpacity onPress={() => setSelectedTab("Waiting")}>
          <Text
            style={[
              styles.waitingTabText,
              selectedTab === "Waiting" && styles.selectedTab,
            ]}>
            Waiting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Your Collection")}>
          <Text
            style={[
              styles.collectionTabText,
              selectedTab === "Your Collection" && styles.selectedTab,
            ]}>
            Your Collection
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.iconContainer}>
        {selectedTab === "Waiting" && (
          <FlatList
            data={waitingIcons}
            renderItem={({ item }) => (
              <Image source={item.source} style={styles.icon} />
            )}
            keyExtractor={(item) => item.key}
            numColumns={2}
          />
        )}
        {selectedTab === "Your Collection" && (
          <FlatList
            data={collectionIcons}
            renderItem={({ item }) => (
              <Image source={item.source} style={styles.icon} />
            )}
            keyExtractor={(item) => item.key}
            numColumns={2}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },
  header: {
    fontFamily: "Arial",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    lineHeight: 35 * heightConstant,
    letterSpacing: 0.05,
    textAlign: "left",
    width: 159 * widthConstant,
    height: 53 * heightConstant,
    top: 100 * heightConstant,
    left: 28 * widthConstant,
    color: "#FFFFFF",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    top: 200 * heightConstant,
    left: 35 * widthConstant,
  },
  waitingTabText: {
    fontFamily: "Rosarivo",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    lineHeight: 30 * heightConstant,
    letterSpacing: 0.15,
    textAlign: "left",
    width: 101 * widthConstant,
    height: 35 * heightConstant,
    color: "#FFFFFF",
  },
  collectionTabText: {
    fontFamily: "Rosarivo",
    fontSize: 28 * radiusConstant,
    fontWeight: "400",
    lineHeight: 30 * heightConstant,
    letterSpacing: 0.15,
    textAlign: "left",
    width: 203 * widthConstant,
    height: 35 * heightConstant,
    color: "#FFFFFF",
    right: 28 * widthConstant,
  },
  iconContainer: {
    marginTop: 250 * heightConstant,
    marginLeft: -45 * widthConstant,
  },
  icon: {
    width: 125 * widthConstant,
    height: 125 * heightConstant,
    marginLeft: 90 * widthConstant,
    marginTop: 40 * heightConstant,
  },
  selectedTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFFFFF",
  },
});
