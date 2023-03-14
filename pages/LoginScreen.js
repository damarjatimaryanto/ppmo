import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
  BackHandler,
} from "react-native";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { StatusBar } from "react-native";

const blue_icon = "#9695C0";
const black = "#3d3d3d";
const blue_input = "#F2F3FC";
const grey = "#5C5F68";
const grey_input = "#D4D4D4";
const grey_label = "#DAD9DC";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF" };

const LoginScreen = () => {
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

  const navigation = useNavigation();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  let [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Regular": require("./../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("./../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-LightItalic": require("./../assets/fonts/Poppins-LightItalic.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const onSubmit = async () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setLoading(true);
        setTimeout(async () => {
          // console.log(response);
          if (response != 0) {
            const uid = response.id_user;
            const id_fase = response.id_fase_detail;
            const nama = response.nama;
            const username = response.username;
            const fase = response.fase;

            AsyncStorage.setItem("loggedIn", "1");

            AsyncStorage.setItem("userData", JSON.stringify(response));
            // AsyncStorage.setItem("uid", uid);
            // AsyncStorage.setItem("id_fase_detail", id_fase);
            // AsyncStorage.setItem("nama", nama);
            // AsyncStorage.setItem("username", username);
            // AsyncStorage.setItem("fase", fase);

            setLoading(false);
            navigation.navigate("AlarmScreen");
          } else {
            Alert.alert("", "Login Gagal!");
            setLoading(false);
          }
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <Modal
        animationType="fade"
        transparent={true}
        visible={loading}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModal(false);
        }}
      >
        <View style={styles.modal_lodaing_style}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ fontFamily: "Poppins-Regular" }}>Loading...</Text>
        </View>
      </Modal>

      <View style={styles.imgContainer}>
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 30,
            fontFamily: "Poppins-Bold",
          }}
        >
          Login
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.h1}>
          Silakan login dengan username dan password yang anda miliki
        </Text>
        <Text style={styles.h2}>Username</Text>
        <View style={styles.inputContainer}>
          <View style={{ width: "15%", alignItems: "center" }}>
            <Image
              style={{ width: 24, height: 24, tintColor: blue_icon }}
              source={require("./../assets/icon/person_fill.png")}
            />
          </View>
          <View style={{ width: "85%" }}>
            <TextInput
              style={styles.input}
              placeholderTextColor={blue_icon}
              onChangeText={setUsername}
              value={username}
              placeholder="Masukan Username"
            />
          </View>
        </View>

        <Text style={styles.h2}>Password</Text>

        <View style={styles.inputContainer}>
          <View style={{ width: "15%", alignItems: "center" }}>
            <Image
              style={{ width: 24, height: 24, tintColor: blue_icon }}
              source={require("./../assets/icon/lock.png")}
            />
          </View>
          <View style={{ width: "85%" }}>
            <TextInput
              style={styles.input}
              placeholderTextColor={blue_icon}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              placeholder="Masukan Password"
            />
          </View>
        </View>

        <View style={styles.btn_Container}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              onSubmit();
            }}
          >
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer_2}>
          <Text style={styles.kamu_nanya}>Belum punya akun ? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.kamu_nanya_2}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  imgContainer: {
    paddingHorizontal: width * 0.095,
    // justifyContent: "center",
    // alignItems: "center",
    paddingTop: "30%",
    // height: "30%",
  },
  formContainer: {
    paddingHorizontal: width * 0.095,
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 15,
    flexDirection: "row",
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F3FC",
    borderRadius: 5,
  },
  inputContainer_2: {
    marginVertical: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 40,
    // position: "absolute",
    // marginHorizontal: 20,
    // width: width,
  },
  btn_Container: {
    marginVertical: 35,
  },
  h1: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: grey,
    // textAlign: "center",
    marginBottom: 15,
  },
  h2: {
    fontSize: 14,
    color: grey,
    fontFamily: "Poppins-Medium",
    justifyContent: "center",
    alignItems: "center",
  },
  kamu_nanya: {
    fontSize: 16,
    color: "black",
    fontFamily: "Poppins-Regular",
    justifyContent: "center",
    alignItems: "center",
  },
  kamu_nanya_2: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: "Poppins-SemiBold",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    // borderWidth: 2,
    // borderColor: COLORS.primary,
    // paddingVertical: width * 0.013,
    // paddingHorizontal: width * 0.04,
    height: 50,
    borderRadius: 10,
    color: "black",
    paddingTop: 6,
    // backgroundColor: "#D4D4D4",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  inputselect: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: "100%",
    height: 45,
    borderRadius: 5,
    color: black,
    backgroundColor: "white",
  },
  inputTextselect: {
    color: "grey",
    textAlign: "left",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },
  dropdownStyle: {
    backgroundColor: "white",
    borderRadius: 15,
    paddingVertical: 2,
  },
  rowStyle: {
    borderBottomColor: COLORS.primary,
    backgroundColor: "white",
  },
  rowtext: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    textAlign: "left",
    marginLeft: 15,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  btnText: {
    fontSize: width * 0.035,
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
  copyText: {
    fontFamily: "Poppins-SemiBold",
    color: "#B5B5B5",
  },
  ownerText: {
    color: "#F7B44C",
    fontWeight: "bold",
  },
  modal_lodaing_style: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: "40%",
    left: "30%",
    top: "40%",
    backgroundColor: "white",
    borderRadius: 5,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
  },
});
