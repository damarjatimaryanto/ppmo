import {
  StyleSheet,
  // Modal,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  PermissionsAndroid,
  Text,
  Image,
  View,
  Animated,
  Alert,
  TextInput,
  TouchableOpacity,
  Button,
  StatusBar,
  AppRegistry,
  Dimensions,
  BackHandler,
  Linking,
  ScrollView,
  FlatList,
} from "react-native";
import { useFonts } from "expo-font";
import React, { useRef, useCallback, useEffect, useState } from "react";
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import moment, { min } from "moment";
import Modal from "react-native-modal";
import * as Notifications from "expo-notifications";

const countries = ["Fase Intensif (Ke 1)", "Fase Lanjutan ( Ke 2)"];
const kategori = ["Pasien Baru", "Pasien Lama"];

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

  const [refresh, setRefresh] = useState(Math.random());
  const [refreshing, setRefreshing] = useState(false);

  const [modal, setModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalMetu, setModalMetu] = useState(false);
  const [isFaseKaton, setFaseKaton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dataFase, setDataFase] = useState([]);
  const [fase, setFase] = useState();
  const [faseLabel, setFaseLabel] = useState("Fase Insentif");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [today, setToday] = useState(null);
  const [lamaPengobatan, setLamaPengobatan] = useState(null);

  const [userData, setUserData] = useState([
    {
      fase: "",
      kategori: "",
      id_kat: "",
      id_fase: "",
    },
  ]);
  const [hari, setHari] = useState("1");
  const [jam, setJam] = useState("00 : 00");
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  useEffect(() => {
    getFase();
  }, []);
  const modalFase = () => {
    setFaseKaton(!isFaseKaton);
  };

  const modalInfo = () => {
    setModalMetu(!isModalMetu);
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
    setRefreshing(true);
    getAlarm();
    getToday();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getAlarm = async () => {
    const uid = await AsyncStorage.getItem("uid");

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getAlarm", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uid,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        setLoading(true);

        setTimeout(async () => {
          const fase = await AsyncStorage.getItem("fase");
          const kategori = await AsyncStorage.getItem("kategori");
          const id_kat = await AsyncStorage.getItem("id_kat");
          const id_fase = await AsyncStorage.getItem("id_fase");

          const userSession = [];
          userSession.push({
            fase: fase,
            kategori: kategori,
            id_kat: id_kat,
            id_fase: id_fase,
          });

          setUserData(userSession);
          if (resp != 0) {
            // const dateNow = "2023-04-10";
            const startDate = resp.start;
            const endDate = resp.end;
            const dateNow = moment(new Date()).format("YYYY-MM-DD");
            const selisih = moment(dateNow).isAfter(endDate, "day");

            if (selisih == true) {
              setData(null);
              modalInfo();
            } else {
              const id_alarm = resp.id_alarm;
              const id_user = resp.id_user;
              const jam = resp.jam;
              const hari = resp.hari;

              const result = [];
              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                jam: jam,
                hari: hari,
                startDate: startDate,
                endDate: endDate,
              });

              setData(result);
            }

            setLoading(false);
          } else {
            setData(null);
            setLoading(false);
          }
        }, 2000);
      });
  };
  const onSubmit = async () => {
    const id_user = await AsyncStorage.getItem("uid");
    const hrs = parseFloat(hours);
    const min = parseFloat(minutes);
    const id_fase = await AsyncStorage.getItem("id_fase");
    const startDate = new Date();
    const newDate = moment(startDate).format("YYYY-MM-DD");
    const endDate = moment(startDate).add(lamaPengobatan, "days").toDate();
    const newEndDate = moment(endDate).format("YYYY-MM-DD");
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFaseDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id_fase,
      }),
    })
      .then((a) => a.json())
      .then((b) => {
        setLamaPengobatan(b[0].lama_pengobatan);
      });

    // insert
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=insAlarm", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id_user,
        hari: hari,
        jam: jam,
        fase: fase,
        start: newDate,
        end: newEndDate,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        setLoading(true);
        setTimeout(async () => {
          if (resp == 1) {
            Alert.alert("", "Alarm berhasil ditambahkan");
            setLoading(false);
            getAlarm();
            schedulePushNotification(hrs, min);
            setModalVisible(false);
          } else {
            Alert.alert("", "Alarm gagal ditambahkan");
            setLoading(false);
            setModalVisible(false);
          }
        }, 2000);
      });
  };

  // notif
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  async function schedulePushNotification(h, m) {
    await Notifications.setNotificationChannelAsync("Minum Obat", {
      name: "Notifikasi Pengingat Minum Obat",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "sound.wav", // Provide ONLY the base filename
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Waktunya Minum Obat",
        body: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        data: { path: "Konfirmasi" },
        shouldPlaySound: true,
        sound: "default",
      },
      trigger: {
        hour: h,
        minute: m,
        repeats: true,
        channelId: "ppmo-tbc-",
      },
    });
  }

  const getFase = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFase", {})
      .then((res) => res.json())
      .then((response) => {
        setDataFase(response);
      });
  };

  const renderFase = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{
          // width: "100%",
          height: 40,
          backgroundColor: "white",
          justifyContent: "center",
          // alignItems: "center",
          borderRadius: 10,
          marginVertical: 4,
        }}
        onPress={() => {
          setFase(item.id_fase_detail);
          setFaseLabel(item.fase);
          setFaseKaton(false);
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: "black",
            paddingLeft: 70,
            paddingVertical: 8,
            borderColor: "grey",
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: "white",
          }}
        >
          {item.fase}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getToday = async () => {
    const uid = await AsyncStorage.getItem("uid");

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getToday", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uid,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp != "null") {
          setToday(resp);
        } else {
          setToday(null);
        }
      });
  };
  const notificationListener = useRef();
  const responseListener = useRef();
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    getAlarm();
    getToday();
    if (lastNotificationResponse) {
      const route = JSON.stringify(
        lastNotificationResponse.notification.request.content.data.path
      );

      navigation.navigate("Konfirmasi");
    }

    setRefresh(Math.random());
  }, [lastNotificationResponse]);

  // useFocusEffect(() => {
  // });
  return (
    <ScrollView
      style={[styles.container, { padding: 15 }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={COLORS.white}
      ></StatusBar>

      {/* // ! Modal FASE PENGOBATAN */}
      <Modal
        isVisible={isFaseKaton}
        onBackdropPress={() => setFaseKaton(false)}
        animationOutTiming={1000}
        animationInTiming={1000}
      >
        <View style={{ alignItems: "center", flex: 0.175 }}>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "white",
              width: width * 0.6,
              borderRadius: 10,
              flex: 1,
            }}
          >
            <FlatList
              data={dataFase}
              renderItem={renderFase}
              keyExtractor={(item) => item.id_fase_detail}
            />
          </View>
        </View>
      </Modal>

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
            height: "100%",
            width: "100%",
          }}
        >
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </Modal>

      {/* // TODO Modal ALARM OPTIONAL*/}

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationOutTiming={1500}
        animationInTiming={1500}
        // animationIn={"fadeIn"}
        // animationOut={"fadeOut"}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            // flex: 1,
            // margin: -20,
            // justifyContent: "center",
            // alignItems: "center",
            // height: 600,
            borderRadius: 10,
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "yellow",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity onPress={toggleModal}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 10,
                  marginRight: 10,
                }}
                source={require("./../assets/icon/delete2.png")}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 80,
            }}
          >
            <View
              style={{
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
              }}
            >
              <Image
                style={{
                  width: "95%",
                  height: "95%",
                }}
                source={require("./../assets/icon/bellblue.png")}
              />
            </View>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={showDatePicker}
              style={{
                // backgroundColor: "#F2F3FC",
                height: 120,
                width: "80%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontFamily: "Poppins-Bold",
                  fontSize: 100,
                }}
              >
                {jam}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 50,
              // backgroundColor: "yellow",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <TouchableOpacity style={styles.boxhari_grey}>
              <Text
                style={{ color: COLORS.primary, fontFamily: "Poppins-Regular" }}
              >
                M
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boxhari_grey}>
              <Text
                style={{ color: COLORS.primary, fontFamily: "Poppins-Regular" }}
              >
                S
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boxhari_blue}>
              <Text
                style={{ color: COLORS.white, fontFamily: "Poppins-Regular" }}
              >
                S
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boxhari_blue}>
              <Text
                style={{ color: COLORS.white, fontFamily: "Poppins-Regular" }}
              >
                R
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boxhari_grey}>
              <Text
                style={{ color: COLORS.primary, fontFamily: "Poppins-Regular" }}
              >
                K
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.boxhari_blue}>
              <Text
                style={{ color: COLORS.white, fontFamily: "Poppins-Regular" }}
              >
                J
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boxhari_grey}>
              <Text
                style={{ color: COLORS.primary, fontFamily: "Poppins-Regular" }}
              >
                S
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              // width: "80%",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              width: "100%",
              // backgroundColor: "yellow",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#F2F3FC",
                width: "80%",
                height: "100%",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: blue_icon,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Pilih Fase Pengobatan
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              // width: "80%",
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              width: "100%",
              marginTop: 20,
              // backgroundColor: "yellow",
            }}
          >
            <Text
              style={{
                color: blue_icon,
                fontFamily: "Poppins-Medium",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Hari Ke :
            </Text>
            <View
              style={{
                backgroundColor: "#F2F3FC",
                width: "20%",
                height: "100%",
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextInput
                textAlign="center"
                style={{
                  opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: blue_icon,
                }}
                placeholderTextColor={grey}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={userData[0].id_kat == 1 ? "1" : hari}
                editable={userData[0].id_kat == 1 ? false : true}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              height: 50,
              width: "100%",
              marginTop: 30,
              // backgroundColor: "yellow",
            }}
          >
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => {
                onSubmit();
              }}
            >
              <Text style={styles.btnText}>Simpan Alarm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* // ! Modal ALARM */}

      {/* <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationOutTiming={1500}
        animationInTiming={1500}
        // animationIn={"fadeIn"}
        // animationOut={"fadeOut"}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            // flex: 1,
            // margin: -20,
            // justifyContent: "center",
            // alignItems: "center",
            borderRadius: 10,
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "yellow",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity onPress={toggleModal}>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 10,
                  marginRight: 10,
                }}
                source={require("./../assets/icon/delete2.png")}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 80,
            }}
          >
            <View
              style={{
                width: 140,
                height: 140,
                tintColor: COLORS.primary,
                backgroundColor: "white",
                borderRadius: 90,
                borderWidth: 2,
                borderColor: COLORS.white,
                position: "absolute",
                zIndex: 1,
                bottom: 380,
                padding: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  width: "95%",
                  height: "95%",
                }}
                source={require("./../assets/icon/bellblue.png")}
              />
            </View>
            <View style={styles.formContainer}>
              <View>
                <Text style={styles.h2}>Jam</Text>
                <View style={styles.inputContainer}>
                  <View style={{ width: "15%", alignItems: "center" }}>
                    <Image
                      style={styles.icon_style}
                      source={require("./../assets/icon/jam_hari.png")}
                    />
                  </View>
                  <View style={{ width: "85%" }}>
                    <TouchableOpacity
                      onPress={showDatePicker}
                      style={[
                        styles.input,
                        { alignItems: "flex-start", justifyContent: "center" },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: blue_icon,
                          fontFamily: "Poppins-Regular",
                        }}
                      >
                        {jam}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Text style={styles.h2}>Hari ke</Text>
              <View style={styles.inputContainer}>
                <View style={{ width: "15%", alignItems: "center" }}>
                  <Image
                    style={{ width: 18, height: 18, tintColor: blue_icon }}
                    source={require("./../assets/icon/hari.png")}
                  />
                </View>
                <View style={{ width: "85%" }}>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                        fontFamily: "Poppins-Medium",
                      },
                    ]}
                    placeholderTextColor={blue_icon}
                    placeholder="inputkan hari"
                    keyboardType="number-pad"
                    onChangeText={setHari}
                    value={userData[0].id_kat == 1 ? "1" : hari}
                    editable={userData[0].id_kat == 1 ? false : true}
                  />
                </View>
              </View>

              <View>
                <Text style={styles.h2}>Fase Pengobatan</Text>
                <View style={styles.inputContainer}>
                  <View style={{ width: "15%", alignItems: "center" }}>
                    <Image
                      style={styles.icon_style}
                      source={require("./../assets/icon/fase_fill.png")}
                    />
                  </View>
                  <View style={{ width: "85%" }}>
                    <TouchableOpacity
                      onPress={modalFase}
                      style={[
                        styles.input,
                        { alignItems: "flex-start", justifyContent: "center" },
                      ]}
                    >
                      {fase == null && (
                        <Text
                          style={{
                            fontSize: 16,
                            color: blue_icon,
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          Pilih Fase Pengobatan
                        </Text>
                      )}
                      {fase != null && (
                        <Text
                          style={{
                            fontSize: 16,
                            color: blue_icon,
                            fontFamily: "Poppins-Regular",
                          }}
                        >
                          {faseLabel}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.btn_Container}>
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => {
                    onSubmit();
                  }}
                >
                  <Text style={styles.btnText}>Simpan Alarm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* // ?cModal Alarm LAMA */}
      {/*  <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationOutTiming={2000}
        animationInTiming={2000}
        // animationIn={"fadeIn"}
        // animationOut={"fadeOut"}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 140,
                  tintColor: COLORS.primary,
                  backgroundColor: "white",
                  borderRadius: 90,
                  borderWidth: 2,
                  borderColor: COLORS.white,
                  position: "absolute",
                  zIndex: 1,
                  bottom: 1,
                  padding: 4,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{
                    width: "95%",
                    height: "95%",
                    // tintColor: COLORS.primary,
                  }}
                  source={require("./../assets/icon/bellblue.png")}
                />
              </View>
            </View>

            <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16 }}>
              {" "}
              Atur waktu alarm anda sendiri.
            </Text>

            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "black",
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                }}
              >
                Jam :
              </Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[styles.input_horizontal, { alignItems: "center" }]}
              >
                <Text
                  style={{
                    color: "black",
                    fontFamily: "Poppins-Medium",
                    fontSize: 16,
                    textAlign: "center",
                  }}
                >
                  {jam}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "black",
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Hari Ke- :
              </Text>
              <TextInput
                textAlign="center"
                style={[
                  styles.input_horizontal,
                  {
                    opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                    fontFamily: "Poppins-Medium",
                  },
                ]}
                placeholderTextColor={grey}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={userData[0].id_kat == 1 ? "1" : hari}
                editable={userData[0].id_kat == 1 ? false : true}
              />
            </View>

            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "black",
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                }}
              >
                Fase :
              </Text>
              <TouchableOpacity
                onPress={modalFase}
                style={[styles.input_horizontal, { alignItems: "center" }]}
              >
                {fase == null && (
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "Poppins-Medium",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Pilih Fase
                  </Text>
                )}
                {fase != null && (
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "Poppins-Medium",
                      fontSize: 12,
                      textAlign: "center",
                    }}
                  >
                    {faseLabel}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.inputhorizontal,
                { justifyContent: "space-between" },
              ]}
            >
              <TouchableOpacity
                style={[styles.btn, styles.btn2]}
                onPress={toggleModal}
              >
                <Text
                  style={{ color: COLORS.white, fontFamily: "Poppins-Regular" }}
                >
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.btn1]}
                onPress={() => {
                  onSubmit();
                }}
              >
                <Text
                  style={[
                    { color: COLORS.white, fontFamily: "Poppins-Regular" },
                  ]}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}

      {/* // ! Modal Info */}
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
            backgroundColor: COLORS.abu1,
            flex: 1,
            margin: -20,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                width: 140,
                height: 140,
                tintColor: COLORS.primary,
                backgroundColor: "white",
                borderRadius: 90,
                borderWidth: 2,
                borderColor: COLORS.white,
                // position: "absolute",
                // zIndex: 1,
                // bottom: 1,
                // padding: 4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                style={{
                  width: "95%",
                  height: "95%",
                  // tintColor: COLORS.primary,
                }}
                source={require("./../assets/icon/about.png")}
              />
            </View>
          </View>

          <View
            style={{
              height: 150,
              width: "100%",
              // backgroundColor: "yellow",
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
              Fase intensif telah selesai
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
              Silakan setting ulang kembali alarm anda untuk fase lanjutan.
            </Text>
          </View>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styles.btn3} onPress={modalInfo}>
              <Text
                style={{ color: COLORS.white, fontFamily: "Poppins-Regular" }}
              >
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        date={selectedDate}
        isVisible={datePickerVisible}
        mode="time"
        is24Hour
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* jika loading selesai dan tidak ada data alarm */}

      {loading != true && data == null && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "35%",
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
              Track record harian anda dalam kepatuhan meminum obat akan muncul
              disini.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.floatingbutton, { marginTop: 20 }]}
            onPress={toggleModal}
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
        </View>
      )}

      {/* jika loading selesai dan  ada data alarm */}
      {loading != true && data != null && (
        <TouchableOpacity
          onPress={() => navigation.navigate("Konfirmasi")}
          style={styles.box}
          disabled={today != null ? true : false}
        >
          <View style={styles.jam}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 30,
                color: COLORS.primary,
              }}
            >
              {data[0].jam}
            </Text>
          </View>
          <View style={styles.keterangan}>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 20,
                color: COLORS.primary,
              }}
            >
              {userData[0].kategori}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 16,
                color: COLORS.primary,
              }}
            >
              {userData[0].fase}
            </Text>
          </View>
          <View style={styles.gmbar_container}>
            {today == null && (
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../assets/icon/bell_normal.png")}
              />
            )}

            {today != null && (
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../assets/icon/bell_check.png")}
              />
            )}
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.abu1,
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
    // position: 'absolute',
    // bottom: 90,
    // right: 20,
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
    height: 100,

    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%",
    marginTop: 15,
    shadowColor: "black",
    // borderRadius: 5,
    shadowOffset: {
      width: 6,
      height: 4,
    },
    shadowOpacity: 4,
    shadowRadius: 10,

    elevation: 5,
  },
  jam: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'yellow',
  },
  keterangan: {
    // backgroundColor: 'grey',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gmbar_container: {
    // backgroundColor: 'red',
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
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width - 20,
    height: height - 30,
    backgroundColor: "yellow",
    width: width,
    height: height,
  },
  modalView_2: {
    // margin: 20,
    width: width - 20,
    height: height - 30,
    paddingTop: 85,
    backgroundColor: "white",
    borderRadius: 10,

    // marginVertical: 40,
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
    // backgroundColor: "yellow",
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
    // borderWidth: 2,
    // borderColor: COLORS.primary,
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
    backgroundColor: "#07D3B0",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    fontFamily: "Poppins-Medium",
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
  icon_style: {
    width: 18,
    height: 18,
    tintColor: blue_icon,
    // backgroundColor: blue_icon,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "80%",
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
    marginHorizontal: 5,
    borderRadius: 50,
  },
  boxhari_grey: {
    backgroundColor: "#F2F3FC",
    width: 33,
    height: 33,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 50,
  },
});
