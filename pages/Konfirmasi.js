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
  ToastAndroid,
  Dimensions,
  SafeAreaView,
  BackHandler,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";

const COLORS = { primary: "#1E319D", white: "#FFFFFF" };
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

const Konfirmasi = () => {
  // const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());
  const navigation = useNavigation();

  const [userSession, setUserSession] = useState([
    {
      uid: "",
    },
  ]);

  const [obat, setObat] = useState([
    {
      id_obat_detail: null,
      id_jenis_obat_detail: null,
      id_fase_detail: null,
      obat: null,
      fase: null,
      jenis_obat: null,
      waktu_minum: null,
    },
  ]);

  const [hari, setHari] = useState([]);

  const getUser = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getUser", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userData[0].id_user,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        const result = [];

        result.push({
          uid: resp.id_user,
          id_fase_detail: resp.id_fase_detail,
          fase: resp.fase,
        });

        setUserSession(result);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getHari = async () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getHari", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userSession[0].uid,
        fase: userSession[0].id_fase_detail,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp.msg == "riwayat") {
          var a = parseFloat(resp.hari) + 1;
          setHari(a);
        } else {
          var b = parseFloat(resp.hari);
          setHari(b);
        }
      })
      .catch((e) => {
        console.warn("error");
      });
  };

  const getObat = async () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getObat", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fase: userSession[0].id_fase_detail,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        setObat(resp);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const onSubmit = async () => {
    const date = new Date();
    const id = userSession[0].uid;
    const day = hari;
    const tgl = moment(date).format("YYYY-MM-DD");
    const fase = userSession[0].id_fase_detail;

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=submitAlarm", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        hari: day,
        tgl: tgl,
        fase: fase,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        // setLoading(true);
        // setTimeout(() => {
        if (resp == "1") {
          // setLoading(false);
          ToastAndroid.show("Konfirmasi Berhasil!", ToastAndroid.SHORT);
          navigation.navigate("AlarmScreen");
        } else {
          // setLoading(false);
          ToastAndroid.show("Konfirmasi Gagal!", ToastAndroid.SHORT);
        }
        // }, 500);
      });
  };

  useEffect(() => {
    // setTimeout(() => {
    getUser();
    getHari();
    getObat();
    // }, 1000);
  }, [userSession]);

  useFocusEffect(
    React.useCallback(() => {
      // setLoading(true);
      // setTimeout(() => {
      //   // getUser();
      //   // getHari();
      //   // getObat();
      //   setLoading(false);
      // }, 3000);

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
    }, [refresh])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {loading == true && (
        // <Modal animationType="fade" transparent={true} visible={loading}>
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            height: 60,
            width: "40%",
            left: "30%",
            top: "40%",
            backgroundColor: "white",
            borderRadius: 10,
            borderColor: "#ddd",
            borderBottomWidth: 0,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.9,
            shadowRadius: 3,
            elevation: 5,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ fontFamily: "Poppins-Regular" }}>Loading</Text>
        </View>
        // </Modal>
      )}

      {/* <View
        style={{
          height: 50,
          width: width,
          flexDirection: "row",
          marginBottom: 15,
          // backgroundColor: "grey",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("AlarmScreen")}
          style={{
            width: "15%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <AntDesign name="arrowleft" size={25} color={COLORS.primary} />
        </TouchableOpacity>
        <View
          style={{
            width: "70%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: "Poppins-Medium",
              fontSize: 20,
            }}
          >
            Konfirmasi
          </Text>
        </View>
      </View> */}
      <View style={styles.box}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.judul_style}>
            <Text style={styles.judul_isi}>Hari Ke</Text>
          </View>
          <View style={styles.ket_style}>
            <Text style={styles.ket_isi}>: {hari}</Text>
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.judul_style}>
            <Text style={styles.judul_isi}>Fase </Text>
          </View>
          <View style={styles.ket_style}>
            {userSession[0].id_fase_detail == "1" && (
              <Text style={styles.ket_isi}>: Fase Insentif</Text>
            )}
            {userSession[0].id_fase_detail == "2" && (
              <Text style={styles.ket_isi}>: Fase Lanjutan</Text>
            )}
            {userSession[0].id_fase_detail == "3" && (
              <Text style={styles.ket_isi}>: Fase Extend</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.box_2}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.judul_style}>
            <Text style={styles.judul_isi}>Obat</Text>
          </View>
          <View style={styles.ket_style}>
            {obat != null &&
              obat.map((item) => (
                <View key={item.id_obat_detail}>
                  <Text style={styles.ket_isi}>: {item.obat}</Text>
                </View>
              ))}
          </View>
        </View>
      </View>

      <View style={styles.box}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.judul_style}>
            <Text style={styles.judul_isi}>Jenis Obat</Text>
          </View>
          {obat != null && (
            <View style={styles.ket_style}>
              <Text style={styles.ket_isi}>: {obat[0].jenis_obat}</Text>
            </View>
          )}
        </View>
      </View>
      {/* <View style={styles.box}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View style={styles.judul_style}>
            <Text style={styles.judul_isi}>Waktu Minum Obat</Text>
          </View>
          {obat != null && (
            <View style={styles.ket_style}>
              <Text style={[styles.ket_isi, { textTransform: "capitalize" }]}>
                : {obat[0].waktu_minum}
              </Text>
            </View>
          )}
        </View>
      </View> */}

      <TouchableOpacity onPress={onSubmit} style={styles.floatingbutton}>
        <Text
          style={{
            color: COLORS.white,
            fontFamily: "Poppins-Regular",
            fontSize: 16,
          }}
        >
          Konfirmasi
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Konfirmasi;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },

  textbtn: {
    fontSize: 16,
    color: "white",
  },
  floatingbutton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 20,
    // // right: 20,
    width: width - 50,
    // marginHorizontal: 20,
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },
  box: {
    backgroundColor: "#FFFFFF",
    width: width * 0.95,
    paddingHorizontal: "2%",
    marginTop: 2,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    // borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.4,

    elevation: 5,
  },
  box_2: {
    backgroundColor: "#FFFFFF",
    width: width * 0.95,
    paddingHorizontal: "2%",
    marginTop: 2,
    padding: 10,
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.4,
    elevation: 5,
  },
  box_image: {
    // backgroundColor: 'grey',
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  img_style: { height: 20, width: 20, tintColor: "black" },
  img_style_2: { height: 20, width: 20 },
  judul_style: {
    // backgroundColor: 'green',
    width: "40%",
    // justifyContent: "center",
  },
  judul_isi: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "grey",
  },
  ket_style: {
    // backgroundColor: 'blue',
    justifyContent: "center",
    paddingRight: 5,
  },
  ket_isi: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "left",
    color: COLORS.primary,
  },
});
