import {
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  View,
  Modal,
  Animated,
  Alert,
  TouchableOpacity,
  Dimensions,
  TextInput,
  BackHandler,
  ImageBackground,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import { PieChart } from "react-native-gifted-charts";
// import PieChart from "react-native-expo-pie-chart";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF", abu1: "#F6F6F6" };

const AkunScreen = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [loadingDua, setLoadingDua] = useState(false);

  const pieData = [
    { value: 70, color: "#177AD5" },
    { value: 30, color: "lightgray" },
  ];

  const data = [
    {
      key: "First Data",
      count: 20,
      color: "grey",
    },
    {
      key: "Second Data",
      count: 40,
      color: COLORS.primary,
    },
    // {
    //   key: "Third Data",
    //   count: 40,
    //   color: "green",
    // },
    // {
    //   key: "Forth Data",
    //   count: 35,
    //   color: "orange",
    // },
  ];
  const [userSession, setUserSession] = useState([
    {
      uid: null,
      id_kat: null,
      kategori: null,
      nama: null,
      username: null,
    },
  ]);

  const [dataFase, setDataFase] = useState(null);
  const [extend, setExtend] = useState(null);

  const [total, setTotal] = useState([
    {
      key: "First Data",
      count: 15,
      color: "grey",
    },
    {
      key: "Second Data",
      count: 10,
      color: COLORS.primary,
    },
  ]);

  const [tInsentif, setTInsentif] = useState(null);
  const [tLanjutan, setTLanjutan] = useState(null);
  const [tExtend, setTExtend] = useState(null);

  const [lInsentif, setLInsentif] = useState(null);
  const [lLanjutan, setLLanjutan] = useState(null);
  const [lExtend, setLExtend] = useState(null);

  const [pInsentif, setPInsentif] = useState(null);
  const [pLanjutan, setPLanjutan] = useState(null);
  const [pExtend, setPExtend] = useState(null);

  const getSession = async () => {
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
          nama: resp.nama,
          username: resp.username,
        });

        setUserSession(result);
      })
      .catch((e) => {
        ToastAndroid.show("Logout berhasil!", ToastAndroid.SHORT);
      });
  };

  const onLogout = async () => {
    // await AsyncStorage.removeItem("loggedIn");
    LogBox.ignoreAllLogs(true);
    setLoadingDua(true);
    setTimeout(async () => {
      navigation.navigate("LoginScreen");
      setLoadingDua(false);
      AsyncStorage.clear();
    }, 2000);
  };

  const getPresentase = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getPresentase", {
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
        const lExtend = JSON.stringify(resp[2].lama);

        setTInsentif(resp[0].total);
        setTLanjutan(resp[1].total);
        setTExtend(resp[2].total);

        const pInsentif = ((tInsentif / lInsentif) * 100) / 100;
        const pLanjutan = ((tLanjutan / 48) * 100) / 100;

        const a = 0;
        if (lExtend == "null") {
          setPExtend(a.toFixed(2));
        } else if (lExtend != "null") {
          const lamaHari = (parseFloat(JSON.parse(lExtend)) / 7).toFixed(0) * 3;
          const pExtend = (tExtend / lamaHari) * (100 / 100);
          setPExtend(pExtend.toFixed(2));
        }

        setPInsentif(pInsentif.toFixed(2));
        setPLanjutan(pLanjutan.toFixed(2));
      })
      .catch((e) => {
        ToastAndroid.show("Logout berhasil!", ToastAndroid.SHORT);
      });
  };

  const getFase = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFase", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: 3,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setLInsentif(response[0].lama_pengobatan);
        setLLanjutan(response[1].lama_pengobatan);
        setLExtend(response[2].lama_pengobatan);
      });
  };

  const getFaseDetail = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFaseDetail", {})
      .then((res) => res.json())
      .then((response) => {
        setExtend(response);
      });
  };

  // useEffect(() => {
  //   getSession();
  //   getPresentase();
  //   getFase();
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 3000);
  // }, [userSession]);

  useFocusEffect(
    React.useCallback(() => {
      getSession();
      getPresentase();
      getFase();
      setTimeout(() => {
        setLoading(false);
      }, 3000);

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
    }, [userSession])
  );

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
          <Text style={{ fontFamily: "Poppins-Regular" }}>Loading . . .</Text>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={loadingDua}>
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
      </Modal>
      {loading != true && (
        <View>
          <View>
            <Text style={{ fontFamily: "Poppins-Regular", color: "grey" }}>
              Biodata
            </Text>
          </View>

          {/* <View style={styles.box_style}>
            <View
              style={{ flexDirection: "row", height: "100%", width: "100%" }}
            >
              <View
                style={{
                  // backgroundColor: "grey",
                  width: 65,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    width: "60%",
                    height: "60%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: COLORS.white,
                    }}
                    source={require("../assets/icon/nama_fill.png")}
                  />
                </View>
              </View>
              <View
                style={{
                  // backgroundColor: "yellow",
                  width: "70%",
                  height: "100%",
                  padding: 10,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    color: COLORS.primary,
                    fontSize: 16,
                  }}
                >
                  Nama Lengkap
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "grey",
                  }}
                >
                  {userSession[0].nama}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.box_style}>
            <View
              style={{ flexDirection: "row", height: "100%", width: "100%" }}
            >
              <View
                style={{
                  // backgroundColor: "grey",
                  width: 65,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    width: "60%",
                    height: "60%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: COLORS.white,
                    }}
                    source={require("../assets/icon/at_fill.png")}
                  />
                </View>
              </View>
              <View
                style={{
                  // backgroundColor: "yellow",
                  width: "70%",
                  height: "100%",
                  padding: 10,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    color: COLORS.primary,
                    fontSize: 16,
                  }}
                >
                  Username
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "grey",
                  }}
                >
                  {userSession[0].username}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.box_style}>
            <View
              style={{ flexDirection: "row", height: "100%", width: "100%" }}
            >
              <View
                style={{
                  // backgroundColor: "grey",
                  width: 65,
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: COLORS.primary,
                    width: "60%",
                    height: "60%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 5,
                  }}
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      tintColor: COLORS.white,
                    }}
                    source={require("../assets/icon/fase_pasien.png")}
                  />
                </View>
              </View>
              <View
                style={{
                  // backgroundColor: "yellow",
                  width: "70%",
                  height: "100%",
                  padding: 10,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    color: COLORS.primary,
                    fontSize: 16,
                  }}
                >
                  Fase Pengobatan
                </Text>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "grey",
                  }}
                >
                  {userSession[0].fase}
                </Text>
              </View>
            </View>
          </View> */}

          {/* <PieChart
            donut
            innerRadius={80}
            data={pieData}
            centerLabelComponent={() => {
              return <Text style={{ fontSize: 30 }}>70%</Text>;
            }}
          /> */}

          <View style={styles.box}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style}
                  source={require("../assets/icon/person_fill.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Nama</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}>{userSession[0].nama}</Text>
              </View>
            </View>
          </View>

          <View style={styles.box}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style}
                  source={require("./../assets/icon/at_fill.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Username</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}>{userSession[0].username}</Text>
              </View>
            </View>
          </View>

          <View style={styles.box}>
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style}
                  source={require("./../assets/icon/fase_pasien.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Fase</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}>{userSession[0].fase}</Text>
              </View>
            </View>
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: "grey",
                marginVertical: 15,
              }}
            >
              Presentase Kesembuhan
            </Text>
          </View>

          {/* // ?--------------------------------------------------- TIPE KETIGA ------------------------------------------------ */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 10,
            }}
          >
            <View style={styles.persen_container}>
              <View style={styles.persen_circle}>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Poppins-Medium",
                    fontSize: 30,
                  }}
                >
                  {pInsentif}%
                </Text>
              </View>
              <Text style={styles.persen_text}>Intensif</Text>
            </View>

            <View style={styles.persen_container}>
              <View style={styles.persen_circle}>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Poppins-Medium",
                    fontSize: 30,
                  }}
                >
                  {pLanjutan}%
                </Text>
              </View>
              <Text style={styles.persen_text}>Lanjutan</Text>
            </View>

            <View style={styles.persen_container}>
              <View style={styles.persen_circle}>
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Poppins-Medium",
                    fontSize: 30,
                  }}
                >
                  {pExtend}%
                </Text>
              </View>
              <Text style={styles.persen_text}>Extend</Text>
            </View>
          </View>

          {/* <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",

              // backgroundColor: "blue",
              // paddingVertical: 5,
              // paddingVertical: 15,
            }}
          >
            <View style={{ width: "30%", height: 130 }}>
              <ImageBackground
                style={{
                  flex: 1,
                  height: "100%",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "grey",
                }}
                resizeMode="cover"
                source={require("./../assets/icon/bg_persen.png")}
              >
                <Text>80%</Text>
              </ImageBackground>
            </View>
          </View> */}

          <View style={styles.box_keluar}>
            <TouchableOpacity
              onPress={() => {
                onLogout();
              }}
              style={{ flexDirection: "row", width: "100%" }}
            >
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style_2}
                  source={require("../assets/icon/logout.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Keluar</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}></Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.box_keluar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Test")}
              style={{ flexDirection: "row", width: "100%" }}
            >
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style_2}
                  source={require("../assets/icon/logout.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Test Page</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}></Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* <View style={styles.box_keluar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TestScreen")}
              style={{ flexDirection: "row", width: "100%" }}
            >
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style_2}
                  source={require("../assets/icon/logout.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>alarm</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}></Text>
              </View>
            </TouchableOpacity>
          </View> */}
          {/* <View style={styles.box_keluar}>
            <TouchableOpacity
              onPress={() => navigation.navigate("TestScreen_2")}
              style={{ flexDirection: "row", width: "100%" }}
            >
              <View style={styles.box_image}>
                <Image
                  style={styles.img_style_2}
                  source={require("../assets/icon/logout.png")}
                />
              </View>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>alarm</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}></Text>
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
      )}
    </View>
  );
};

export default AkunScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    alignItems: "center",
    paddingTop: 10,
  },
  box: {
    backgroundColor: "#FFFFFF",
    width: width - 15,
    paddingHorizontal: "2%",
    marginTop: 2,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },

  box_2: {
    backgroundColor: "#FFFFFF",
    width: width - 15,
    paddingHorizontal: "2%",
    marginBottom: 15,
    height: 330,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    // borderRadius: 5,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
  },
  box_keluar: {
    backgroundColor: "#FFFFFF",
    width: width - 15,
    paddingHorizontal: "2%",
    marginTop: 2,
    height: 45,
    // position: "absolute",
    // bottom: "-90%",
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
  box_image: {
    // backgroundColor: 'grey',
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  img_style: { height: 16, width: 16, tintColor: COLORS.primary },
  img_style_2: { height: 20, width: 20 },
  judul_style: {
    // backgroundColor: 'green',
    width: "40%",
    justifyContent: "center",
    paddingTop: 5,
  },
  judul_isi: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "grey",
  },
  ket_style: {
    // backgroundColor: 'blue',
    width: "50%",
    justifyContent: "center",
    paddingRight: 5,
    paddingTop: 5,
  },
  ket_isi: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "right",
    color: COLORS.primary,
  },
  persen_container: {
    width: "30%",
    height: 155,
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",

    flexDirection: "column",
  },
  persen_circle: {
    backgroundColor: COLORS.abu1,
    width: "100%",
    height: "75%",
    borderRadius: 160,
    justifyContent: "center",
    alignItems: "center",

    marginBottom: "5%",
    borderWidth: 15,
    borderColor: COLORS.primary,

    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
  },
  persen_text: {
    fontFamily: "Poppins-Regular",
    height: "20%",
    alignItems: "center",
    textAlignVertical: "center",
    textAlign: "center",
    // backgroundColor: "white",
    width: "100%",
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
    borderRadius: 5,

    // borderColor: "#ddd",
    // borderBottomWidth: 0,
    // shadowColor: "#000000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.9,
    // shadowRadius: 3,
    // elevation: 5,
  },
  box_style: {
    backgroundColor: "#FFFFFF",
    width: width - 15,
    // paddingHorizontal: "2%",
    marginTop: 5,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
});
