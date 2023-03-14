import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
  Animated,
  Alert,
  StatusBar,
  Button,
  BackHandler,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import Modal from "react-native-modal";

const COLORS = { primary: "#1E319D", white: "#FFFFFF" };
const IntroScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
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

  // const [fontsLoaded] = useFonts({
  //   "Poppins-Bold": require("./../assets/fonts/Poppins-Bold.ttf"),
  //   "Poppins-Regular": require("./../assets/fonts/Poppins-Regular.ttf"),
  //   "Poppins-SemiBold": require("./../assets/fonts/Poppins-SemiBold.ttf"),

  //   "Poppins-LightItalic": require("./../assets/fonts/Poppins-LightItalic.ttf"),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

  const onStart = async () => {
    try {
      await AsyncStorage.setItem("intro", "1");
      navigation.navigate("LoginScreen");
    } catch (e) {
      // saving error
    }
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.logo_container}>
        <Image
          style={{ width: 150, height: 150 }}
          source={require("../assets/icon/app.png")}
        ></Image>
      </View>
      <View style={{ width: "100%", height: "20%", alignItems: "center" }}>
        <Text
          style={{
            fontFamily: "Poppins-Medium",
            color: COLORS.white,
            fontSize: 40,
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Selamat Datang
        </Text>
        <Text style={styles.subtitle}>
          Tekan tombol mulai untuk masuk ke dalam aplikasi PPMO TBC
        </Text>
      </View>
      <View style={{ top: 40 }}>
        <TouchableOpacity
          style={[styles.btn]}
          onPress={() => {
            onStart();
          }}
        >
          <Text
            style={{
              fontSize: 20,
              // fontWeight: "bold",
              color: COLORS.white,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Mulai
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Button
        style={{ marginTop: 30 }}
        title="Show modal"
        onPress={toggleModal}
      />

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationOutTiming={1000}
        animationInTiming={1000}
      >
        <View style={{ backgroundColor: "blue" }}>
          <Text>Hello!</Text>

          <Button title="Hide modal" onPress={toggleModal} />
        </View>
      </Modal> */}
    </View>
  );
};

export default IntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,

    alignItems: "center",
  },
  logo_container: {
    height: "45%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "30%",
  },

  splash_title: {
    fontSize: 35,
    fontWeight: "bold",
    color: COLORS.primary,
    marginTop: "5%",
    fontFamily: "Poppins-Regular",
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    maxWidth: "90%",
    textAlign: "center",
    // lineHeight: 23,
    fontFamily: "Poppins-LightItalic",
  },
  title: {
    color: COLORS.primary,
    fontSize: 45,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  btn: {
    borderRadius: 10,
    height: 50,
    width: 200,
    borderColor: COLORS.white,
    borderWidth: 2,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    // fontFamily: "Poppins-Regular",
  },
});
