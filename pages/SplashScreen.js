import {
  StyleSheet,
  PermissionsAndroid,
  Text,
  Image,
  View,
  Animated,
  Alert,
  StatusBar,
  BackHandler,
} from "react-native";
import React, { useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PushNotification from "react-native-push-notification";
const COLORS = { primary: "#1E319D", white: "#FFFFFF" };
const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const configNotification = async () => {
    PushNotification.configure({
      onNotification: function (notification) {
        if (notification.userInteraction) {
          navigation.navigate("Konfirmasi");
          // Handle notification click
        }
      },

      onAction: function (notification) {
        console.log("asd");
      },
    });
  };
  useEffect(() => {
    configNotification();
    fadeIn();
    navig();

    const backAction = () => {
      Alert.alert("", "Apakah Anda yakin ingin keluar dari aplikasi?", [
        {
          text: "Batal",
          onPress: () => null,
          style: "cancel",
        },
        { text: "Keluar", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4500,
      useNativeDriver: true,
    }).start();
  };

  const navig = async () => {
    const loggedIn = await AsyncStorage.getItem("loggedIn");
    const intro = await AsyncStorage.getItem("intro");
    setTimeout(async () => {
      if (intro == 1 && loggedIn == 1) {
        navigation.navigate("AlarmScreen");
      } else if (intro != 1 && loggedIn != 1) {
        navigation.navigate("IntroScreen");
      } else if (intro == 1 && loggedIn != 1) {
        navigation.navigate("LoginScreen");
      } else {
        navigation.navigate("IntroScreen");
      }
    }, 3000);
  };

  // const cekAsync = async () => {
  //   const intro = await AsyncStorage.getItem("intro");
  //   const user = await AsyncStorage.getItem("loggedIn");

  //   console.warn(intro);
  // };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary}></StatusBar>
      <Image
        style={{ width: 170, height: 158 }}
        source={require("../assets/icon/app.png")}
      ></Image>

      <View style={styles.kotak}>
        {/* <Text style={styles.text2}>Design By</Text> */}
        <Text style={styles.text}>PPMO TBC</Text>
      </View>

      {/* <Text style={styles.splash_title}>PPMO TBC</Text> */}
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  splash_title: {
    fontSize: 30,
    // fontWeight: "bold",
    color: "white",
    marginTop: "5%",
    fontFamily: "Poppins-LightItalic",
  },
  text: {
    fontSize: 20,
    fontFamily: "Poppins-Medium",
    color: "white",
  },
  text2: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "white",
  },
  kotak: {
    position: "absolute",
    bottom: 70,
    alignItems: "center",
  },
});
