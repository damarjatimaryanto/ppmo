import {
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  Image,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  ToastAndroid,
  FlatList,
  ImageBackground,
  BackHandler,
} from "react-native";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment, { min } from "moment";
import Modal from "react-native-modal";
import * as Notifications from "expo-notifications";
// import getAlarm from "./function/getAlarm";
import addInsentif from "./function/addInsentif";
import addExtend from "./function/addExtend";
import addLanjutan from "./function/addLanjutan";
import { SafeAreaView } from "react-native";
import pushNotification from "./function/pushNotification";
import pushScheduled from "./function/pushScheduled";
import PushNotification from "react-native-push-notification";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF", abu1: "#F6F6F6" };
const blue = "#0D4AA7";
const black = "#3d3d3d";
const red = "#C74B4C";
const grey = "#5C5F68";
const blue_icon = "#9695C0";
const AlarmScreen = () => {
  const navigation = useNavigation();
  const dataHari = [
    {
      key: 0,
      hari: "Min",
    },
    {
      key: 1,
      hari: "Sen",
    },
    {
      key: 2,
      hari: "Sel",
    },
    {
      key: 3,
      hari: "Rab",
    },
    {
      key: 4,
      hari: "Kam",
    },
    {
      key: 5,
      hari: "Jum",
    },
    {
      key: 6,
      hari: "Sab",
    },
  ]; // data hari untuk loop pada form
  const selectedDate = new Date(); // tanggal skrg pada datepicker

  // loading
  const [loading, setLoading] = useState(false); // loading activityindicator

  // refresh
  const [refresh, setRefresh] = useState(Math.random()); // refresh bukan refreshcontrol
  const [refreshing, setRefreshing] = useState(false); // refresh refreshcontrol

  // modal
  const [isModalVisible, setModalVisible] = useState(false); // modal tambah data
  const [isFaseKaton, setFaseKaton] = useState(false); // modal fase pada form
  const [datePickerVisible, setDatePickerVisible] = useState(false); // menampilkan jam picker
  const [isModalMetu, setModalMetu] = useState(false);

  // simpan data
  const [dataFase, setDataFase] = useState([]); // menyimpan data fase untuk ditampilkan pada form
  const [data, setData] = useState(null); // menyimpan data alarm

  // data yang dipilih dari form
  const [jam, setJam] = useState("00 : 00"); // menyimpan jam alarm yang dipilih untuk disimpan ke database>alarm>jam
  const [hours, setHours] = useState(); // menyimpan jam untuk dikirim ke notifikasi
  const [minutes, setMinutes] = useState(); // menyimpan menit untuk dikirim ke notifikasi

  const [hariAlarm, setHariAlarm] = useState([]); // menyimpan hari yang dipilih dari form
  const [labelHariSatu, setLabelHariSatu] = useState(null); // menyimpan nama hari ke satu
  const [labelHariDua, setLabelHariDua] = useState(null); // menyimpan nama hari ke dua
  const [labelHariTiga, setLabelHariTiga] = useState(null); // menyimpan nama hari ke tiga

  const [fase, setFase] = useState(); // menyimpan id fase yang dipilih
  const [faseLabel, setFaseLabel] = useState(null); // menyimpan jenis nama fase yang dipilih

  const [hari, setHari] = useState("1"); // menyimpan dan menginisialisasi hari ke berapa

  const [lamaPengobatan, setLamaPengobatan] = useState(null); // menyimpan lama pengobatan pada form

  const [selisih, setSelisih] = useState(false);

  const [today, setToday] = useState("null");
  const lastNotificationResponse = Notifications.useLastNotificationResponse(); // ambil notifikasi yang muncul

  const infoModal = async () => {
    setModalMetu(!isModalMetu);

    AsyncStorage.removeItem("alarm");
    setData(null);

    setSelisih(false);
  };
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      getToday();
      setTimeout(() => {
        getSelisih();
        getAlarm();
        loadAsync();
        setLoading(false);
      }, 1500);

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

  const getSelisih = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getAlarm", {
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
      .then(async (resp) => {
        const selisihSession = await AsyncStorage.getItem("selisihSession");

        if (resp != "0") {
          const start = moment(resp.start).format("YYYY-MM-DD");
          // const end = moment("2023-03-01").format("YYYY-MM-DD");
          const end = moment(resp.end).format("YYYY-MM-DD");

          const date = moment(new Date()).subtract(1, "days");
          const newDate = moment(date).format("YYYY-MM-DD");

          const dateNow = moment(new Date()).format("YYYY-MM-DD");

          if (newDate == end) {
            setModalMetu(true);
          } else if (dateNow == start) {
            setModalMetu(false);
          }
        }
      });
  };

  const getAlarm = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getAlarm", {
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
        setTimeout(async () => {
          const alarmSession = await AsyncStorage.getItem("alarmSession");

          if (resp != 0) {
            const startDate = resp.start;
            const endDate = resp.end;
            const dateNow = moment(new Date()).format("2024-01-01");
            // const dateNow = moment(new Date()).format("YYYY-MM-DD");

            const id_alarm = resp.id_alarm;
            const id_user = resp.id_user;
            const jam = resp.jam;
            const hari = resp.hari;
            const hrs = resp.hour;
            const min = resp.minute;
            const result = [];

            // insentif
            if (resp.id_fase == "1") {
              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                id_fase: resp.id_fase,
                jam: jam,
                hari: hari,
                startDate: startDate,
                endDate: endDate,
              });

              if (alarmSession == null) {
                pushNotification(hrs, min);

                AsyncStorage.setItem("alarmSession", "1");
              }

              // lanjutan
            } else if (resp.id_fase == "2") {
              dataHari.map((item, index) => {
                // if (resp.hari_satu)
                if (resp.hari_satu == dataHari[index].key) {
                  AsyncStorage.setItem("labelHariSatu", item.hari);
                }
                if (resp.hari_dua == dataHari[index].key) {
                  AsyncStorage.setItem("labelHariDua", item.hari);
                }
                if (resp.hari_tiga == dataHari[index].key) {
                  AsyncStorage.setItem("labelHariTiga", item.hari);
                }
              });

              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                id_fase: resp.id_fase,
                jam: jam,
                hari_satu: resp.hari_satu,
                hari_dua: resp.hari_dua,
                hari_tiga: resp.hari_tiga,
                startDate: startDate,
                endDate: endDate,
              });
              if (alarmSession == null) {
                pushScheduled(
                  parseFloat(resp.hour),
                  parseFloat(resp.minute),
                  parseFloat(resp.hari_satu)
                );
                pushScheduled(
                  parseFloat(resp.hour),
                  parseFloat(resp.minute),
                  parseFloat(resp.hari_dua)
                );
                pushScheduled(
                  parseFloat(resp.hour),
                  parseFloat(resp.minute),
                  parseFloat(resp.hari_tiga)
                );

                AsyncStorage.setItem("alarmSession", "1");
              }
              // extend
            } else {
              dataHari.map((item, index) => {
                if (resp.hari_satu == dataHari[index].key) {
                  AsyncStorage.setItem("labelHariSatu", item.hari);
                }
                if (resp.hari_dua == dataHari[index].key) {
                  AsyncStorage.setItem("labelHariDua", item.hari);
                  // console.warn("hari sesuai");
                }
                if (resp.hari_tiga == dataHari[index].key) {
                  AsyncStorage.setItem("labelHariTiga", item.hari);
                }
              });

              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                id_fase: resp.id_fase,
                jam: jam,
                hari_satu: resp.hari_satu,
                hari_dua: resp.hari_dua,
                hari_tiga: resp.hari_tiga,
                startDate: startDate,
                endDate: endDate,
                lama_pengobatan: resp.lama_pengobatan,
                fase: resp.fase,
              });

              if (alarmSession == null) {
                pushScheduled(
                  parseFloat(resp.hour),
                  parseFloat(resp.minute),
                  parseFloat(resp.hari_satu)
                );
                pushScheduled(
                  parseFloat(resp.hour),
                  parseFloat(resp.minute),
                  parseFloat(resp.hari_dua)
                );
                pushScheduled(
                  parseFloat(resp.hour),
                  parseFloat(resp.minute),
                  parseFloat(resp.hari_tiga)
                );

                AsyncStorage.setItem("alarmSession", "1");
              }
            }
            setData(result);
          } else {
            setData(null);
          }
        }, 0);
      })
      .catch((e) => {
        ToastAndroid.show("Koneksi bermasalah!", ToastAndroid.SHORT);
      });
  };

  const getToday = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getToday", {
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
        setToday(resp);
      });
  };

  useEffect(() => {
    if (lastNotificationResponse) {
      const route = JSON.stringify(
        lastNotificationResponse.notification.request.content.data.path
      );
      navigation.navigate("Konfirmasi");
      Notifications.dismissNotificationAsync(
        lastNotificationResponse.notification.request.identifier
      );
    }

    setRefresh(Math.random());
  }, [lastNotificationResponse]);

  const modalFase = () => {
    setFaseKaton(!isFaseKaton);
  };

  const modalInfo = async () => {
    AsyncStorage.setItem("info", "1");

    setModalMetu(false);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    const time = moment(date).format("HH : mm");
    const hrs = moment(date).format("HH");
    const min = moment(date).format("mm");
    setJam(time);
    setHours(hrs);
    setMinutes(min);

    hideDatePicker();
  };

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    getFase();
    getToday();
    getAlarm();
    getSelisih();
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getFase = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFase", {})
      .then((res) => res.json())
      .then((response) => {
        setDataFase(response);
      });
  };

  const getLamaPengobatan = (id) => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFaseDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((a) => a.json())
      .then((b) => {
        setLamaPengobatan(b[0].lama_pengobatan);
      });
  };

  const pilihHari = (hariNumb) => {
    if (hariAlarm.length < 3) {
      hariAlarm.push(hariNumb);
      setHariAlarm(hariAlarm);
    } else {
      ToastAndroid.show(
        "Jumlah hari yang dipilih sudah mencapai maximal!",
        ToastAndroid.SHORT
      );
    }
  };

  const renderFase = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{
          height: 40,
          backgroundColor: "white",
          justifyContent: "center",
          borderRadius: 10,
          marginVertical: 4,
          alignItems: "center",
        }}
        onPress={() => {
          setFase(item.id_fase_detail);
          setFaseLabel(item.fase);
          setFaseKaton(false);
          getLamaPengobatan(item.id_fase_detail);
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: "black",
            // paddingLeft: 70,
            paddingVertical: 8,
            // borderColor: "grey",
            // borderWidth: 1,
            width: "100%",
            borderRadius: 10,
            backgroundColor: "white",
            textAlign: "center",
          }}
        >
          {item.fase}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const loadAsync = async () => {
    const asyncData = await AsyncStorage.getItem("alarm");
    const labelSatu = await AsyncStorage.getItem("labelHariSatu");
    const labelDua = await AsyncStorage.getItem("labelHariDua");
    const labelTiga = await AsyncStorage.getItem("labelHariTiga");

    setData(JSON.parse(asyncData));
    setLabelHariSatu(labelSatu);
    setLabelHariDua(labelDua);
    setLabelHariTiga(labelTiga);
  };

  const LabelHari = async () => {
    return (
      <View>
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: COLORS.primary,
            // backgroundColor: "grey",
            marginHorizontal: 5,
          }}
        >
          asdasds
        </Text>
      </View>
    );
  };
  return (
    <ScrollView
      style={[styles.container]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={COLORS.white}
      ></StatusBar>

      <ImageBackground
        style={{ flex: 1, height: height, width: width }}
        resizeMode="cover"
        source={require("./../assets/icon/bg4.png")}
      >
        {/* <View
            style={{
              height: 50,
              width: width,
              flexDirection: "row",
              marginBottom: 15,
            }}
          >
            <View
              style={{
                width: "100%",
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
                Alarm
              </Text>
            </View>
          </View> */}
        {/* // !-----------------------------------------------------  Modal Info ------------------------------------------------------------*/}
        <Modal
          isVisible={isModalMetu}
          onBackdropPress={() => setModalVisible(false)}
          animationOutTiming={2000}
          animationInTiming={2000}
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
          // deviceHeight={height}
          // deviceWidth={width}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              flex: 1,
              margin: -20,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                // backgroundColor: "grey",
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 140,
                  tintColor: COLORS.primary,
                  backgroundColor: "white",
                  borderRadius: 90,
                  // borderWidth: 2,
                  // borderColor: COLORS.white,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    width: "95%",
                    height: "95%",
                    // tintColor: COLORS.primary,
                    // backgroundColor: "grey",
                  }}
                  source={require("./../assets/icon/modal_info.png")}
                />
              </View>
            </View>

            <View
              style={{
                height: 150,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 18,
                }}
              >
                Fase Sebelumnya Telah Selesai
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins-LightItalic",
                  fontSize: 16,
                  color: "grey",
                  textAlign: "center",
                  paddingHorizontal: 20,
                }}
              >
                Silakan setting ulang kembali alarm anda untuk fase selanjutnya.
              </Text>
            </View>

            <View
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                bottom: 50,
              }}
            >
              <TouchableOpacity style={styles.btn3} onPress={infoModal}>
                <Text
                  style={{
                    color: COLORS.white,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Tutup
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* // TODO ------------------------- Modal LOADING ------------------------------------------------------------------*/}
        <Modal animationType="fade" transparent={true} visible={loading}>
          <View style={styles.modal_lodaing_style}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={{ fontFamily: "Poppins-Regular" }}>Loading . . .</Text>
          </View>
        </Modal>
        {/* //! ------------------------------------------jika loading selesai dan tidak ada data alarm -------------------------------------*/}
        {loading != true && data == null && (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "40%",
              // width: "90%",
              // paddingHorizontal: 10,
            }}
          >
            <Image
              style={{ width: 230, height: 187 }}
              source={require("../assets/icon/illus_alarm.png")}
            />
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 100,
                width: "90%",
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 18,
                  fontFamily: "Poppins-Medium",
                }}
              >
                Ayo Mulai !
              </Text>
              <Text
                style={{
                  color: "grey",
                  fontSize: 14,
                  textAlign: "center",
                  fontFamily: "Poppins-LightItalic",
                }}
              >
                Track record harian anda dalam kepatuhan meminum obat akan
                muncul disini.
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.floatingbutton, { marginTop: 20 }]}
              // onPress={toggleModal}
              onPress={() => navigation.navigate("TambahAlarm")}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: COLORS.white,
                    margin: 10,
                    fontFamily: "Poppins-Regular",
                  }}
                >
                  Tambah Alarm
                </Text>
              </View>
            </TouchableOpacity>

            {/* <View
            style={{
              flexDirection: "row",
              marginTop: 70,
              justifyContent: "space-evenly",
              width: width - 20,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("TestScreen")}
              style={{
                backgroundColor: COLORS.primary,
                width: "20%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Desain 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("TestScreen_2")}
              style={{
                backgroundColor: COLORS.primary,
                width: "20%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Desain 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("TestScreen_3")}
              style={{
                backgroundColor: COLORS.primary,
                width: "20%",
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white" }}>Desain 3</Text>
            </TouchableOpacity>
          </View> */}

            {/* <TouchableOpacity
                style={[styles.floatingbutton, { marginTop: 20 }]}
                // onPress={toggleModal}
                onPress={infoModal}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: COLORS.white,
                      margin: 10,
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    INFO
                  </Text>
                </View>
              </TouchableOpacity> */}
          </View>
        )}
        {/* //! ------------------- jika loading selesai dan  ada data alarm -----------------------------------------------------------*/}
        {loading != true && data != null && (
          <View
            style={{
              // backgroundColor: "#FFFFFF",
              width: "90%",
              marginLeft: "5%",
              borderRadius: 10,
              marginTop: 2,
              paddingVertical: 20,
              justifyContent: "center",
              alignItems: "center",
              marginTop: "25%",
            }}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",

                width: "100%",
                borderRadius: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: COLORS.primary,
                }}
              >
                {moment().format("dddd, Do MMMM YYYY")}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Konfirmasi")}
                disabled={today != "null" ? true : false}
              >
                <Image
                  style={{ width: 300, height: 300, marginTop: 30 }}
                  source={
                    today != "null"
                      ? require("../assets/icon/alarm_yellow.png")
                      : require("../assets/icon/alarm_blue.png")
                  }
                />
              </TouchableOpacity>
              <View
                style={{
                  borderRadius: 30,
                  width: 250,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 15,
                }}
              >
                <Text
                  style={{
                    color: COLORS.primary,
                    fontFamily: "Quantico-Bold",

                    fontSize: 70,

                    textAlignVertical: "center",
                  }}
                >
                  {data[0].jam}
                </Text>
              </View>
              {data[0].id_fase == "1" && (
                <Text
                  style={{
                    color: COLORS.primary,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    backgroundColor: "#F2F3FC",
                    // height: 110,
                    textAlignVertical: "center",
                    borderRadius: 3,
                    paddingHorizontal: 4,
                  }}
                >
                  Fase Insentif
                </Text>
              )}
              {data[0].id_fase == "2" && (
                <Text
                  style={{
                    color: COLORS.primary,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    backgroundColor: "#F2F3FC",
                    // height: 110,
                    textAlignVertical: "center",
                    borderRadius: 3,
                    paddingHorizontal: 4,
                  }}
                >
                  Fase Lanjutan
                </Text>
              )}
              {data[0].id_fase == "3" && (
                <Text
                  style={{
                    color: COLORS.primary,
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    backgroundColor: "#F2F3FC",
                    // height: 110,
                    textAlignVertical: "center",
                    borderRadius: 3,
                    paddingHorizontal: 4,
                  }}
                >
                  Fase Extend
                </Text>
              )}
              {/* {data[0].id_fase == "1" && (
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: COLORS.primary,
                    // backgroundColor: "grey",
                    marginHorizontal: 5,
                  }}
                >
                  Setiap Hari
                </Text>
              )} */}

              {/* {data[0].id_fase != "1" && <LabelHari />} */}
              {/* {
                data[0].id_fase != "1" && {
                  if (data[0].hari_satu) {

                  }
                }
                // {data[0].hari_satu}, {data[0].hari_dua}, {data[0].hari_tiga} 
              {/* } */}
            </View>
          </View>
        )}
      </ImageBackground>
    </ScrollView>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  btn: {
    backgroundColor: "#25376A",
    paddingVertical: 10,
    width: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textbtn: {
    fontSize: 16,
    color: "white",
  },
  floatingbutton: {
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  box: {
    backgroundColor: COLORS.white,
    height: 650,

    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
  },
  jam: {
    justifyContent: "center",
    alignItems: "center",
  },
  keterangan: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gmbar_container: {
    justifyContent: "center",
    alignItems: "center",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    paddingTop: 85,
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    marginVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  centeredView_2: {
    justifyContent: "center",
    alignItems: "center",
    width: width - 20,
    height: height - 30,
    backgroundColor: "yellow",
    width: width,
    height: height,
  },
  modalView_2: {
    width: width - 20,
    height: height - 30,
    paddingTop: 85,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  inputContainer: {
    marginVertical: 20,
    paddingTop: 50,
  },
  inputhorizontal: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 10,
  },

  btn_Container: {
    marginVertical: 15,
  },

  input_horizontal: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: width * 0.013,
    paddingHorizontal: width * 0.04,
    width: "47%",
    height: 45,
    borderRadius: 5,
    color: "grey",
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    justifyContent: "center",
    alignItems: "center",
  },

  input_horizontal_2: {
    backgroundColor: COLORS.primary,
    paddingVertical: width * 0.013,
    paddingHorizontal: width * 0.04,
    width: "82%",
    height: 45,
    borderRadius: 5,

    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  btn: {
    width: "48%",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btn1: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
  },
  btn2: {
    backgroundColor: "grey",
    borderRadius: 5,
  },
  btn3: {
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 50,
    fontFamily: "Poppins-Medium",
  },
  imgContainer: {
    paddingHorizontal: width * 0.095,
    paddingTop: "30%",
  },
  formContainer: {
    paddingHorizontal: width * 0.095,
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F3FC",
    borderRadius: 5,
  },
  input: {
    height: 50,
    borderRadius: 10,
    color: "black",
    paddingTop: 6,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  h1: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    color: grey,
    marginBottom: 15,
  },
  h2: {
    fontSize: 14,
    color: grey,
    fontFamily: "Poppins-Medium",
    justifyContent: "center",
    alignItems: "center",
  },
  icon_style: {
    width: 18,
    height: 18,
    tintColor: blue_icon,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "85%",
  },
  btnText: {
    fontSize: width * 0.035,
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
  boxhari_blue: {
    backgroundColor: COLORS.primary,
    width: 33,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderRadius: 50,
  },
  boxhari_grey: {
    backgroundColor: "#F2F3FC",
    width: 33,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
    borderRadius: 50,
  },
  fase_container: {
    backgroundColor: "#F2F3FC",
    width: "100%",
    height: "100%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  fase_text: {
    color: "black",
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  fase_judul: {
    color: "black",
    fontFamily: "Poppins-Medium",
    fontSize: 12,
  },
  hari_container: {
    backgroundColor: "#F2F3FC",
    width: "100%",
    height: "100%",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  hari_text: {
    width: "30%",
    justifyContent: "center",
    height: 45,
    marginTop: 20,
  },
  logo_modalalarm: {
    width: 140,
    height: 140,
    tintColor: COLORS.primary,
    backgroundColor: "white",
    borderRadius: 90,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: "absolute",
    zIndex: 1,
    bottom: 35,
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  modal_lodaing_style: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: "40%",
    left: "30%",
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 3,
    elevation: 5,
  },
});
