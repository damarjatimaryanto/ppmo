import {
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  View,
  Alert,
  TouchableOpacity,
  Button,
  StatusBar,
  Dimensions,
  SafeAreaView,
  ToastAndroid,
  FlatList,
  TextInput,
  ImageBackground,
  ScrollView,
  BackHandler,
} from "react-native";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment, { min } from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";
import PushNotification from "react-native-push-notification";

import getAlarm from "./function/getAlarm";
import addInsentif from "./function/addInsentif";
import addExtend from "./function/addExtend";
import addLanjutan from "./function/addLanjutan";
import pushSchedule from "./alarm/pushSchedule";
import pushNotification from "./alarm/pushNotification";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = {
  primary: "#1E319D",
  white: "#FFFFFF",
  abu1: "#F6F6F6",
  blue_bg: "#F2F3FC",
  blue: "#0D4AA7",
  blue_icon: "#9695C0",
};

const TambahAlarm = () => {
  const navigation = useNavigation();
  const [isHourVisible, setHourVisible] = useState(false);
  const [isMinuteVisible, setMinuteVisible] = useState(false);
  const [refresh, setRefresh] = useState(Math.random());
  const [refreshing, setRefreshing] = useState(false);
  const [pressedSatu, setPressedSatu] = useState(false);
  const [pressedDua, setPressedDua] = useState(false);
  const [pressedTiga, setPressedTiga] = useState(false);
  const [pressedEmpat, setPressedEmpat] = useState(false);
  const [pressedLima, setPressedLima] = useState(false);
  const [pressedEnam, setPressedEnam] = useState(false);
  const [pressedTujuh, setPressedTujuh] = useState(false);

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalMetu, setModalMetu] = useState(false);
  const [isFaseKaton, setFaseKaton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [dataFase, setDataFase] = useState([]);
  const [fase, setFase] = useState();
  const [faseLabel, setFaseLabel] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [lamaPengobatan, setLamaPengobatan] = useState(null);

  const [hariAlarm, setHariAlarm] = useState([]);

  const [userData, setUserData] = useState([
    {
      fase: "",
      id_kat: "",
      id_fase: "",
    },
  ]);
  const [hari, setHari] = useState("1");
  const [jam, setJam] = useState("00 : 00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");

  const modalHours = () => {
    setHourVisible(!isHourVisible);
  };
  const modalMinutes = () => {
    setMinuteVisible(!isMinuteVisible);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
  const getFase = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFase", {})
      .then((res) => res.json())
      .then((response) => {
        setDataFase(response);
      });
  };

  const onReset = () => {
    setHariAlarm([]);
    setPressedSatu(false);
    setPressedDua(false);
    setPressedTiga(false);
    setPressedEmpat(false);
    setPressedLima(false);
    setPressedEnam(false);
    setPressedTujuh(false);
  };
  useEffect(() => {
    setTimeout(() => {
      getAlarm();
      getFase();
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
  });
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

          if (item.id_fase_detail == "1") {
            setPressedSatu(true);
            setPressedDua(true);
            setPressedTiga(true);
            setPressedEmpat(true);
            setPressedLima(true);
            setPressedEnam(true);
            setPressedTujuh(true);
          } else {
            setPressedSatu(false);
            setPressedDua(false);
            setPressedTiga(false);
            setPressedEmpat(false);
            setPressedLima(false);
            setPressedEnam(false);
            setPressedTujuh(false);
          }
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

  var myloop = [];
  var myHour = [];

  for (let i = 0; i <= 59; i++) {
    myloop.push(
      <TouchableOpacity
        key={i}
        style={{
          backgroundColor: COLORS.blue_bg,
          marginVertical: 5,
          // flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "30%",
          height: 50,
          borderRadius: 10,
        }}
        onPress={() => {
          setMinutes(i);
          setMinuteVisible(false);
        }}
      >
        <Text
          style={{ color: "black", fontSize: 25, fontFamily: "Poppins-Medium" }}
        >
          {i}
        </Text>
      </TouchableOpacity>
    );
  }

  for (let hour = 0; hour <= 24; hour++) {
    myHour.push(
      <TouchableOpacity
        key={hour}
        style={{
          backgroundColor: COLORS.blue_bg,
          marginVertical: 5,
          // flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "30%",
          height: 50,
          borderRadius: 10,
        }}
        onPress={() => {
          setHours(hour);
          setHourVisible(false);
        }}
      >
        <Text
          style={{ color: "black", fontSize: 25, fontFamily: "Poppins-Medium" }}
        >
          {hour}
        </Text>
      </TouchableOpacity>
    );
  }

  var jamArr = [];

  const onChangeJam = (h) => {
    if (h <= 24) {
      const fristChar = h.slice(0, 1);
      const scndChar = h.slice(1, 2);
      if (fristChar == 0) {
        setHours(scndChar);
        jamArr.push(scndChar + ":00");

        setJam(jamArr[0]);
      } else {
        setHours(h);
        jamArr.push(h + ":00");
        setJam(jamArr[0]);
      }
    } else {
      ToastAndroid.show("Jam tidak dapat melebihi 24!", ToastAndroid.SHORT);
    }
  };

  const onChangeMenit = (m) => {
    if (m <= 59) {
      // const fristChar = m.slice(0, 1);
      // const scndChar = m.slice(1, 2);

      // if (m == "00") {
      //   setMinutes("00");
      // } else if (fristChar == "0") {
      //   setMinutes(scndChar);
      //   jamArr.push(hours + ":0" + scndChar);

      //   setJam(jamArr[0]);
      // } else {
      //   setMinutes(m);
      jamArr.push(hours + ":" + m);

      setJam(jamArr[0]);
      // }
    } else {
      ToastAndroid.show("Menit tidak boleh melebihi 59!", ToastAndroid.SHORT);
    }
  };
  return (
    <View style={styles.container}>
      {/* <ImageBackground
        style={{ flex: 1, height: height }}
        resizeMode="cover"
        source={require("./../assets/icon/bg4.png")}
      > */}
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
      {/* // ? ---------------------------------- Modal FASE PENGOBATAN -------------------------------------*/}
      <Modal
        isVisible={isFaseKaton}
        onBackdropPress={() => setFaseKaton(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        // animationOutTiming={1500}
        // animationInTiming={1500}
      >
        <View style={{ alignItems: "center", flex: 0.3 }}>
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "yellow",
              width: width * 0.7,
              borderRadius: 10,
              height: 200,
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
      {/* //? MODAL MENIT -----------------------------------------------------------------------------------------------*/}
      <Modal
        isVisible={isMinuteVisible}
        onBackdropPress={() => setMinuteVisible(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
      >
        <View>
          <ScrollView style={{ height: 300, borderRadius: 20 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                // backgroundColor: "pink",
              }}
            >
              {myloop}
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* //? MODAL JAM -----------------------------------------------------------------------------------------------*/}
      <Modal
        isVisible={isHourVisible}
        onBackdropPress={() => setHourVisible(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        // animationOutTiming={1500}
        // animationInTiming={1500}
      >
        <View>
          <Text
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "Poppins-Medium",
            }}
          >
            Scroll Ke Bawah
          </Text>
          <ScrollView style={{ height: 300, borderRadius: 20 }}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                // backgroundColor: "pink",
              }}
            >
              {myHour}
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* //? Tampilan FASE HARI KE LAMA HARI -----------------------------------------------------------------------------------------------*/}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: width - 30,
          // paddingTop: "10%",
        }}
      >
        <View style={{ width: "45%" }}>
          <Text style={styles.input_top_label}>Fase</Text>
          <TouchableOpacity onPress={modalFase} style={styles.fase_style}>
            <View style={styles.fase_container}>
              {fase == null && <Text style={styles.fase_text}>Pilih Fase</Text>}
              {fase != null && (
                <Text style={styles.fase_text}>{faseLabel}</Text>
              )}
            </View>
            <View style={styles.fase_img_container}>
              <Image
                source={require("./../assets/icon/down_2.png")}
                style={styles.fase_img_style}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: "20%" }}>
          <Text style={styles.input_top_label}>Hari Ke</Text>
          <View style={styles.harike_container}>
            <TextInput
              style={styles.input_harike}
              placeholderTextColor={"black"}
              keyboardType="number-pad"
              placeholder="0"
              onChangeText={setHari}
              value={hari}
            ></TextInput>
          </View>
        </View>

        <View style={{ width: "20%" }}>
          <Text style={styles.input_top_label}>Lama (H)</Text>
          <View style={styles.lamahari_style}>
            {fase == "1" && (
              <TextInput
                style={styles.lamahari_input}
                placeholderTextColor={"black"}
                keyboardType="number-pad"
                placeholder="60"
                editable={false}
                selectTextOnFocus={false}
              />
            )}
            {fase == "2" && (
              <TextInput
                style={styles.lamahari_input}
                placeholderTextColor={"black"}
                keyboardType="number-pad"
                placeholder="120"
                editable={false}
                selectTextOnFocus={false}
              />
            )}
            {fase == "3" && (
              <TextInput
                style={styles.lamahari_input}
                placeholderTextColor={"black"}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setLamaPengobatan}
                value={lamaPengobatan}
              />
            )}
            {fase != "1" && fase != "2" && fase != "3" && (
              <TextInput
                style={styles.lamahari_input}
                placeholderTextColor={"black"}
                keyboardType="number-pad"
                placeholder="0"
                editable={false}
                selectTextOnFocus={false}
              />
            )}
          </View>
        </View>
      </View>
      {/* //? Tampilan Setting Waktu Alarm -----------------------------------------------------------------------------------------------*/}
      <View style={{ marginTop: "15%", marginBottom: "10%" }}>
        <View
          style={{
            flexDirection: "row",
            // backgroundColor: "grey",
            height: 200,
            width: width - 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "40%" }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 12,
                color: "black",
              }}
            >
              Jam
            </Text>
            <View
              // onPress={modalHours}
              style={styles.alarm_set_style}
            >
              <TextInput
                style={{
                  width: "80%",
                  height: "80%",
                  // backgroundColor: "yellow",
                  textAlign: "center",
                  fontSize: 80,
                  // textAlignVertical: "center",
                  fontFamily: "Poppins-Bold",
                  // paddingTop: 25,
                  color: COLORS.primary,
                  borderRadius: 10,
                }}
                maxLength={2}
                placeholderTextColor={COLORS.primary}
                onChangeText={(value) => onChangeJam(value)}
                keyboardType="number-pad"
                placeholder="00"
              />
            </View>
          </View>

          <View style={styles.titikdua_style}>
            <Text style={styles.titikdua_text}>:</Text>
          </View>

          <View style={{ width: "40%" }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 12,
                color: "black",
              }}
            >
              Menit
            </Text>
            <View
              // onPress={modalMinutes}
              style={styles.alarm_set_style}
            >
              <TextInput
                style={{
                  width: "80%",
                  height: "80%",
                  // backgroundColor: "yellow",
                  textAlign: "center",
                  fontSize: 80,
                  // textAlignVertical: "center",
                  fontFamily: "Poppins-Bold",
                  paddingTop: 25,
                  color: COLORS.primary,
                  borderRadius: 10,
                }}
                onChangeText={(value) => onChangeMenit(value)}
                maxLength={2}
                placeholderTextColor={COLORS.primary}
                keyboardType="number-pad"
                placeholder="00"
              />
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "yellow",
          width: "70%",
          height: 40,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            fontFamily: "Poppins-Medium",
            width: "30%",
            // backgroundColor: "blue",

            // alignItems: "center",
          }}
        ></View>
        <View
          style={{
            fontFamily: "Poppins-Medium",
            width: "30%",
            // backgroundColor: "green",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              color: COLORS.primary,
            }}
          >
            Pilih Hari
          </Text>
        </View>
        <TouchableOpacity
          style={{
            fontFamily: "Poppins-SemiBold",
            width: "30%",
            opacity: fase == 1 ? 0.4 : 1,
            // backgroundColor: "green",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            // paddingRight: 20,
          }}
          onPress={() => {
            onReset();
          }}
          disabled={fase == 1 ? true : false}
        >
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              color: COLORS.primary,
              // backgroundColor: "yellow",
              paddingHorizontal: 2,
              // borderColor: COLORS.primary,
              // borderWidth: 1,
              borderRadius: 5,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>
      {/* //? Tampilan Setting Hari  -----------------------------------------------------------------------------------------------*/}
      <View
        style={{
          flexDirection: "row",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity
          style={pressedSatu ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(0);
              setPressedSatu(true);
            } else {
              pilihHari(0);
            }
          }}
          disabled={pressedSatu ? true : false}
        >
          <Text
            style={{
              color: pressedSatu ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pressedDua ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(1);
              setPressedDua(true);
            } else {
              pilihHari(1);
            }
          }}
          disabled={pressedDua ? true : false}
        >
          <Text
            style={{
              color: pressedDua ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            S
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pressedTiga ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(2);
              setPressedTiga(true);
            } else {
              pilihHari(2);
            }
          }}
          disabled={pressedTiga ? true : false}
        >
          <Text
            style={{
              color: pressedTiga ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            S
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pressedEmpat ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(3);
              setPressedEmpat(true);
            } else {
              pilihHari(3);
            }
          }}
          disabled={pressedEmpat ? true : false}
        >
          <Text
            style={{
              color: pressedEmpat ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            R
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pressedLima ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(4);
              setPressedLima(true);
            } else {
              pilihHari(4);
            }
          }}
          disabled={pressedLima ? true : false}
        >
          <Text
            style={{
              color: pressedLima ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            K
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pressedEnam ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(5);
              setPressedEnam(true);
            } else {
              pilihHari(5);
            }
          }}
          disabled={pressedEnam ? true : false}
        >
          <Text
            style={{
              color: pressedEnam ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            J
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={pressedTujuh ? styles.boxhari_blue : styles.boxhari_grey}
          onPress={() => {
            if (hariAlarm.length < 3) {
              pilihHari(6);
              setPressedTujuh(true);
            } else {
              pilihHari(6);
            }
          }}
          disabled={pressedTujuh ? true : false}
        >
          <Text
            style={{
              color: pressedTujuh ? COLORS.white : COLORS.primary,
              fontFamily: "Poppins-Regular",
            }}
          >
            S
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View
        style={{ backgroundColor: COLORS.primary, width: "80%", height: 1 }}
      ></View> */}

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => {
          setLoading(true);
          setTimeout(() => {
            const satu = hariAlarm[0];
            const dua = hariAlarm[1];
            const tiga = hariAlarm[2];

            if (hariAlarm.length == 3 && fase != 1) {
              if (fase == 2) {
                addLanjutan(
                  hours,
                  minutes,
                  lamaPengobatan,
                  hari,
                  jam,
                  fase,
                  hariAlarm,
                  satu,
                  dua,
                  tiga
                );
              } else if (fase == 3) {
                addExtend(
                  hours,
                  minutes,
                  lamaPengobatan,
                  hari,
                  jam,
                  fase,
                  hariAlarm,
                  satu,
                  dua,
                  tiga
                );
              }
            } else if (hariAlarm < 3 && fase != 1) {
              ToastAndroid.show(
                "Pilih hari sebanyak 3 hari!",
                ToastAndroid.SHORT
              );
            } else if (hariAlarm.length == 0 && fase == 1) {
              addInsentif(hours, minutes, lamaPengobatan, hari, jam, fase);
            } else if (hariAlarm.length == 0) {
              ToastAndroid.show("Anda belum memilih hari!", ToastAndroid.SHORT);
            }
            setLoading(false);
            navigation.navigate("AlarmScreen");
          }, 3000);

          // setLoadingAdd(true);
          // setTimeout(() => {
          //   // jika hari alarm berjumlah 3 dan fase bukan insentif (1)
          //   if (hariAlarm.length == 3 && fase != 1) {
          //     // fase lanjutan
          //     if (fase == 2) {
          //       addLanjutan(
          //         hours,
          //         minutes,
          //         lamaPengobatan,
          //         hari,
          //         jam,
          //         fase,
          //         hariAlarm
          //       );
          //       // fase extend
          //     } else if (fase == 3) {
          //       addExtend(
          //         hours,
          //         minutes,
          //         lamaPengobatan,
          //         hari,
          //         jam,
          //         fase,
          //         hariAlarm
          //       );
          //     }
          //   }

          //   // jika fase insentif (1)
          //   else if (fase == 1) {
          //     // fase insentif
          //     addInsentif(hours, minutes, lamaPengobatan, hari, jam, fase);
          //   }
          //   // jika blm pilih hari dan fase bukan insentif
          //   else if (hariAlarm.length <= 0 && fase != 1) {
          //     // peringatan blm pilih hari
          //     ToastAndroid.show("Anda belum memilih hari!", ToastAndroid.SHORT);
          //   } else if (hariAlarm.length < 3 && fase != 1) {
          //     // peringatan hari 3 kali
          //     ToastAndroid.show(
          //       "Pilih hari sebanyak 3 hari!",
          //       ToastAndroid.SHORT
          //     );
          //   }
          //   setLoadingAdd(false);
          //   navigation.navigate("AlarmScreen");
          // }, 3000);
        }}
      >
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TambahAlarm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: "10%",
    // justifyContent: "center",
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
    borderColor: COLORS.primary,
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    width: width * 0.85,
    // position: "absolute",
    // bottom: 40,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    // top: 100,
  },
  btnText: {
    fontSize: width * 0.035,
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
  input_top_label: { fontFamily: "Poppins-SemiBold", fontSize: 12 },
  fase_text: {
    // color: "black",
    fontFamily: "Poppins-SemiBold",
    // fontSize: 16,
    // textAlign: "center",
  },
  fase_style: {
    backgroundColor: COLORS.blue_bg,
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    paddingHorizontal: "2%",
  },
  fase_img_container: {
    width: "30%",
    // backgroundColor: grey,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fase_img_style: {
    width: 20,
    height: 10,
    marginLeft: 10,
    tintColor: COLORS.primary,
  },
  fase_container: {
    width: "65%",
    height: "80%",
    // backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  harike_container: {
    flexDirection: "row",
    backgroundColor: COLORS.blue_bg,
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  input_harike: {
    fontFamily: "Poppins-SemiBold",
    // fontSize: 12,
    color: "black",
    width: "100%",
    height: "100%",
    // backgroundColor: "yellow",
    textAlign: "center",
  },
  lamahari_style: {
    flexDirection: "row",
    backgroundColor: COLORS.blue_bg,
    width: "100%",
    height: 40,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  lamahari_input: {
    fontFamily: "Poppins-SemiBold",
    // fontSize: 12,
    color: "black",
    width: "100%",
    height: "100%",
    // backgroundColor: "yellow",
    textAlign: "center",
  },
  alarm_set_style: {
    backgroundColor: COLORS.blue_bg,
    width: "100%",
    height: 150,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    paddingTop: 10,
  },
  alarm_set_text: {
    fontSize: 100,
    // textAlignVertical: "center",
    fontFamily: "Poppins-Bold",
    // backgroundColor: "yellow",
    paddingTop: 17,
    color: COLORS.primary,
  },
  titikdua_style: {
    // backgroundColor: "yellow",
    width: 50,
    height: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 5,
  },
  titikdua_text: {
    fontFamily: "Poppins-Bold",
    fontSize: 50,
    color: COLORS.primary,
    paddingTop: 21,
  },
});
