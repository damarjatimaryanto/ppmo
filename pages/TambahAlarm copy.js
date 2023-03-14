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
} from "react-native";
import React, { useRef, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment, { min } from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { AntDesign } from "@expo/vector-icons";

import getAlarm from "./function/getAlarm";
import addInsentif from "./function/addInsentif";
import addExtend from "./function/addExtend";
import addLanjutan from "./function/addLanjutan";
const actions = [
  {
    text: "Buat Alarm",
    icon: require("../assets/icon/alarm.png"),
    name: "Buat Alarm",
    position: 2,
  },
];
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF", abu1: "#F6F6F6" };
const blue = "#0D4AA7";
const black = "#3d3d3d";
const red = "#C74B4C";
const grey = "#5C5F68";
const blue_icon = "#9695C0";
const TambahAlarm = () => {
  const navigation = useNavigation();
  const dataHari = [
    {
      key: 1,
      hari: "Min",
    },
    {
      key: 2,
      hari: "Sen",
    },
    {
      key: 3,
      hari: "Sel",
    },
    {
      key: 4,
      hari: "Rab",
    },
    {
      key: 5,
      hari: "Kam",
    },
    {
      key: 6,
      hari: "Jum",
    },
    {
      key: 7,
      hari: "Sab",
    },
  ];
  const [refresh, setRefresh] = useState(Math.random());
  const [refreshing, setRefreshing] = useState(false);
  const [pressedSatu, setPressedSatu] = useState(false);
  const [pressedDua, setPressedDua] = useState(false);
  const [pressedTiga, setPressedTiga] = useState(false);
  const [pressedEmpat, setPressedEmpat] = useState(false);
  const [pressedLima, setPressedLima] = useState(false);
  const [pressedEnam, setPressedEnam] = useState(false);
  const [pressedTujuh, setPressedTujuh] = useState(false);

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
  const [hours, setHours] = useState();
  const [minutes, setMinutes] = useState();

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
  useEffect(() => {
    setTimeout(() => {
      getAlarm();
      getFase();
    }, 3000);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      {/* <ImageBackground
        style={[styles.container]}
        resizeMode="cover"
        source={require("./../assets/icon/bg4.png")}
      > */}
      <DateTimePickerModal
        date={selectedDate}
        isVisible={datePickerVisible}
        mode="time"
        is24Hour
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      {/* // ! ---------------------------------- Modal FASE PENGOBATAN -------------------------------------*/}
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
      {/* 
      {loadingAdd == true && (
      )} */}

      <Modal animationType="fade" transparent={true} visible={loadingAdd}>
        <View style={styles.modal_lodaing_style}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={{ fontFamily: "Poppins-Regular" }}>Loading</Text>
        </View>
      </Modal>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={showDatePicker}
          style={{
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
              fontSize: 80,
            }}
          >
            {jam}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 22,
          }}
        >
          <Text
            style={{ color: COLORS.primary, fontFamily: "Poppins-Regular" }}
          >
            Pilih Hari
          </Text>
        </View>
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
                pilihHari(1);
                setPressedSatu(true);
              } else {
                pilihHari(1);
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
                pilihHari(2);
                setPressedDua(true);
              } else {
                pilihHari(2);
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
                pilihHari(3);
                setPressedTiga(true);
              } else {
                pilihHari(3);
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
                pilihHari(4);
                setPressedEmpat(true);
              } else {
                pilihHari(4);
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
                pilihHari(5);
                setPressedLima(true);
              } else {
                pilihHari(5);
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
                pilihHari(6);
                setPressedEnam(true);
              } else {
                pilihHari(6);
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
                pilihHari(7);
                setPressedTujuh(true);
              } else {
                pilihHari(7);
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

          {/* {dataHari.map((hr, index) => (
              <TouchableOpacity
                style={
                  // hariAlarm === index
                  styles.boxhari_blue
                  // : styles.boxhari_grey
                }
                key={hr.key}
                onPress={() => {
                  pilihHari(hr.key);
                }}
              >
                <Text
                  style={{
                    color: COLORS.white,

                    fontFamily: "Poppins-Regular",
                  }}
                >
                  {hr.hari[0]}
                </Text>
              </TouchableOpacity>
            ))} */}
        </View>
      </View>
      <View
        style={{
          height: 100,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: width * 0.9,
        }}
      >
        {/* //?-----------------JIKA FASE INTENSIF FASE CONTAINER -------------------------------------- */}
        {fase != "1" && fase != "2" && fase != "3" && (
          <View
            style={{
              height: 45,
              width: "50%",
            }}
          >
            <Text style={styles.fase_judul}>Fase</Text>
            <TouchableOpacity onPress={modalFase} style={styles.fase_container}>
              {fase == null && (
                <Text style={styles.fase_text}>Pilih Fase Pengobatan</Text>
              )}
              {fase != null && (
                <Text style={styles.fase_text}>{faseLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* //?-----------------JIKA FASE INTENSIF FASE CONTAINER -------------------------------------- */}
        {fase == "1" && (
          <View
            style={{
              height: 45,
              width: "50%",
            }}
          >
            <Text style={styles.fase_judul}>Fase</Text>
            <TouchableOpacity onPress={modalFase} style={styles.fase_container}>
              {fase == null && (
                <Text style={styles.fase_text}>Pilih Fase Pengobatan</Text>
              )}
              {fase != null && (
                <Text style={styles.fase_text}>{faseLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* //?-----------------JIKA FASE LANJUTAN FASE CONTAINER -------------------------------------- */}
        {fase == "2" && (
          <View
            style={{
              height: 45,
              width: "50%",
            }}
          >
            <Text style={styles.fase_judul}>Fase</Text>
            <TouchableOpacity onPress={modalFase} style={styles.fase_container}>
              {fase == null && (
                <Text style={styles.fase_text}>Pilih Fase Pengobatan</Text>
              )}
              {fase != null && (
                <Text style={styles.fase_text}>{faseLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* //?-----------------JIKA EXTEND FASE CONTAINER -------------------------------------- */}
        {fase == "3" && (
          <View
            style={{
              height: 45,
              width: "35%",
            }}
          >
            <Text style={styles.fase_judul}>Fase</Text>
            <TouchableOpacity onPress={modalFase} style={styles.fase_container}>
              {fase == null && (
                <Text style={styles.fase_text}>Pilih Fase Pengobatan</Text>
              )}
              {fase != null && (
                <Text style={styles.fase_text}>{faseLabel}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* //?-----------------JIKA FASE BELUM PILIH Hari Ke CONTAINER -------------------------------------- */}
        {fase != "1" && fase != "2" && fase != "3" && (
          <View style={styles.hari_text}>
            <Text style={styles.fase_judul}>Hari Ke</Text>
            <View style={styles.hari_container}>
              <TextInput
                textAlign="center"
                style={{
                  opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: "black",
                  width: 30,
                }}
                placeholderTextColor={black}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={hari}
              />
            </View>
          </View>
        )}

        {/* //?-----------------JIKA FASE INTENSIF Hari Ke CONTAINER -------------------------------------- */}
        {fase == "1" && (
          <View style={styles.hari_text}>
            <Text style={styles.fase_judul}>Hari Ke</Text>
            <View style={styles.hari_container}>
              <TextInput
                textAlign="center"
                style={{
                  opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: "black",
                  width: 30,
                }}
                placeholderTextColor={black}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={hari}
              />
            </View>
          </View>
        )}

        {/* //?----------------- JIKA FASE LANJUTAN Hari Ke CONTAINER -------------------------------------- */}
        {fase == "2" && (
          <View style={styles.hari_text}>
            <Text style={styles.fase_judul}>Hari Ke</Text>
            <View style={styles.hari_container}>
              <TextInput
                textAlign="center"
                style={{
                  opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: "black",
                  width: 30,
                }}
                placeholderTextColor={black}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={hari}
              />
            </View>
          </View>
        )}

        {/* //?-----------------Hari Ke CONTAINER -------------------------------------- */}
        {fase == "3" && (
          <View
            style={{
              width: "20%",
              justifyContent: "center",
              height: 45,
              marginTop: 20,
            }}
          >
            <Text style={styles.fase_judul}>Hari Ke</Text>
            <View style={styles.hari_container}>
              <TextInput
                textAlign="center"
                style={{
                  opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: "black",
                  width: 30,
                }}
                placeholderTextColor={black}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={hari}
              />
            </View>
          </View>
        )}

        {/* //?-----------------LAMA Hari  CONTAINER -------------------------------------- */}
        {fase == "3" && (
          <View
            style={{
              width: "25%",
              justifyContent: "center",
              height: 45,
              marginTop: 20,
            }}
          >
            <Text style={styles.fase_judul}>Lama (Hari)</Text>
            <View style={styles.hari_container}>
              <TextInput
                textAlign="center"
                style={{
                  opacity: userData[0].id_kat == 1 ? 0.6 : 1,
                  fontFamily: "Poppins-Medium",
                  fontSize: 16,
                  color: "black",
                  width: 30,
                }}
                placeholderTextColor={black}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setLamaPengobatan}
                value={lamaPengobatan}
              />
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => {
          setLoadingAdd(true);
          setTimeout(() => {
            // jika hari alarm berjumlah 3 dan fase bukan insentif (1)
            if (hariAlarm.length == 3 && fase != 1) {
              // fase lanjutan
              if (fase == 2) {
                addLanjutan(
                  hours,
                  minutes,
                  lamaPengobatan,
                  hari,
                  jam,
                  fase,
                  hariAlarm
                );
                // fase extend
              } else if (fase == 3) {
                addExtend(
                  hours,
                  minutes,
                  lamaPengobatan,
                  hari,
                  jam,
                  fase,
                  hariAlarm
                );
              }
            }

            // jika fase insentif (1)
            else if (fase == 1) {
              // fase insentif
              addInsentif(hours, minutes, lamaPengobatan, hari, jam, fase);
            }
            // jika blm pilih hari dan fase bukan insentif
            else if (hariAlarm.length <= 0 && fase != 1) {
              // peringatan blm pilih hari
              ToastAndroid.show("Anda belum memilih hari!", ToastAndroid.SHORT);
            } else if (hariAlarm.length < 3 && fase != 1) {
              // peringatan hari 3 kali
              ToastAndroid.show(
                "Pilih hari sebanyak 3 hari!",
                ToastAndroid.SHORT
              );
            }
            // if (hariAlarm.length == 3) {
            //   if (fase == "1") {
            //     addInsentif(hours, minutes, lamaPengobatan, hari, jam, fase);
            //   } else if (fase == "2") {
            //     addLanjutan(
            //       hours,
            //       minutes,
            //       lamaPengobatan,
            //       hari,
            //       jam,
            //       fase,
            //       hariAlarm
            //     );
            //   } else {
            //     addExtend(
            //       hours,
            //       minutes,
            //       lamaPengobatan,
            //       hari,
            //       jam,
            //       fase,
            //       hariAlarm
            //     );
            //   }
            //   setLoadingAdd(false);
            //   navigation.navigate("AlarmScreen");
            // } else if (hariAlarm.length <= 0 && fase != 1) {
            //   ToastAndroid.show(
            //     "Anda belum memilih hari!",
            //     ToastAndroid.SHORT
            //   );
            setLoadingAdd(false);

            navigation.navigate("AlarmScreen");
            // }
          }, 3000);
        }}
      >
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
};

export default TambahAlarm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // justifyContent: "center",
    alignItems: "center",
    // paddingTop: 10,
    height: height,
    width: width,
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
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "80%",
    // position: "absolute",
    // bottom: 70,
    marginTop: 50,
  },
  btnText: {
    fontSize: width * 0.035,
    color: "white",
    fontFamily: "Poppins-SemiBold",
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
