import {
  StyleSheet,
  PermissionsAndroid,
  Modal,
  ActivityIndicator,
  Text,
  Image,
  View,
  Animated,
  Alert,
  TouchableOpacity,
  Button,
  StatusBar,
  AppRegistry,
  Dimensions,
  SafeAreaView,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const COLORS = { primary: "#1E319D", white: "#FFFFFF" };
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const Test = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.extraSpaceUp}></View>
      <View style={styles.boxLayout}>
        <View style={styles.leftContainer}>
          <View style={styles.leftBox1}></View>
          <View style={styles.leftBox2}></View>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.rightBox1}></View>
          <View style={styles.rightBox2}></View>
        </View>
      </View>
      <View style={styles.extraSpaceDown}></View>

      <Button
        title="back"
        onPress={() => navigation.navigate("AkunScreen")}
      ></Button>
    </View>
  );
};

export default Test;

const styles = StyleSheet.create({
  container: { flex: 1 },
  extraSpaceUp: { flex: 1, backgroundColor: "white" },
  boxLayout: { flex: 3, backgroundColor: "white", flexDirection: "row" },
  leftContainer: {
    flex: 1,
    backgroundColor: "white",
    marginRight: "2.5%",
    marginLeft: "7%",
    marginVertical: "2%",
  },
  leftBox1: {
    flex: 1,
    backgroundColor: "white",
    marginBottom: "8%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  leftBox2: {
    flex: 2,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  rightContainer: {
    flex: 1,
    backgroundColor: "white",
    marginLeft: "2.5%",
    marginRight: "7%",
    borderRadius: 15,
    marginVertical: "2%",
  },
  rightBox1: {
    flex: 2,
    backgroundColor: "white",
    marginBottom: "8%",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  rightBox2: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  extraSpaceDown: { flex: 1, backgroundColor: "white" },
});
