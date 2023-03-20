import {
  StyleSheet,
  Button,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import * as Battery from "expo-battery";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF", abu1: "#F6F6F6" };
const Settings = () => {
  const [battery, setBattery] = useState(false);
  useEffect(() => {
    onCek();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      onCek();
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
    }, [battery])
  );

  const navigation = useNavigation();
  const onCek = async () => {
    const opt = await Battery.isBatteryOptimizationEnabledAsync();
    if (opt == false) {
      setBattery(true);
      navigation.navigate("LoginScreen");
    }
  };


  const onSetting = async () => {
    // startActivityAsync(ActivityAction.IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
    // console.log(opt);
    Linking.openSettings();
  };

  const onSkip = async () => {
    const loggedIn = await AsyncStorage.getItem("loggedIn");

    if (loggedIn != 1) {
      navigation.navigate('LoginScreen')
    } else {
      navigation.navigate('AlarmScreen')
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={{ alignItems: "center" }}>
        <Image
          style={{
            width: 100,
            height: 100,
            tintColor: COLORS.primary,
            marginBottom: 50,
          }}
          source={require("../assets/icon/warning.png")}
        />
      </View>
      <Text
        style={{
          fontFamily: "Poppins-Regular",
          //   textAlign: "center",
          //   paddingHorizontal: 20,
        }}
      >
        Untuk pengalaman lebih baik, matikan pengaturan yang membatasi aplikasi
        berjalan di latar belakang.
      </Text>
      <View style={{ justifyContent: "flex-start" }}>
        <Text style={{ fontFamily: "Poppins-Regular", marginVertical: 10 }}>
          Ikuti langkah - langkah di bawah ini :
        </Text>
      </View>

      <View>
        <Text style={{ fontFamily: "Poppins-Regular" }}>
          1. Tekan tombol{" "}
          <Text style={{ fontFamily: "Poppins-Bold", color: COLORS.primary }}>
            "pengaturan baterai"{" "}
          </Text>{" "}
          di bawah ini.
        </Text>
        <View style={{ alignItems: "center", marginVertical: 10 }}>
          <TouchableOpacity
            onPress={onSetting}
            style={{
              backgroundColor: COLORS.primary,
              width: 200,
              height: 45,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", fontFamily: "Poppins-Regular" }}>
              Pengaturan Baterai
            </Text>
          </TouchableOpacity>
        </View>
        {/* <Button
          style={styles.btn}
          title="Pengaturan Baterai"
          onPress={onSetting}
        /> */}
        <Text style={{ fontFamily: "Poppins-Regular" }}>
          2. Masuk ke dalam menu baterai.
        </Text>
        <Text style={{ fontFamily: "Poppins-Regular" }}>
          3. Pilih{" "}
          <Text style={{ fontFamily: "Poppins-Bold", color: COLORS.primary }}>
            "Tidak dibatasi"
          </Text>
          .
        </Text>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Image
            style={{
              width: "95%",
              height: 200,
              //   tintColor: COLORS.primary,
              marginBottom: 50,
            }}
            source={require("../assets/icon/batre.jpeg")}
          />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity style={{ width: '30%', paddingVertical: 10, alignItems: 'flex-end' }} onPress={onSkip}>
            <Text style={{ fontFamily: "Poppins-Regular" }}>Lewati</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    paddingHorizontal: "10%",
    paddingTop: "30%",
  },
  btn: {
    backgroundColor: COLORS.primary,
  },
});
