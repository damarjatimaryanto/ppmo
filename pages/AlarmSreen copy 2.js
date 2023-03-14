import {
  StyleSheet,
  // Modal,
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
} from "react-native";
import { useFonts } from "expo-font";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Modal from "react-native-modal";

const countries = ["Fase Intensif (Ke 1)", "Fase Lanjutan ( Ke 2)"];
const kategori = ["Pasien Baru", "Pasien Lama"];

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF" };
const blue = "#0D4AA7";
const black = "#3d3d3d";
const red = "#C74B4C";
const grey = "#5C5F68";
const AlarmScreen = () => {
  const navigation = useNavigation();
  // let [fontsLoaded] = useFonts({
  //   "Poppins-Bold": require("./../assets/fonts/Poppins-Bold.ttf"),
  //   "Poppins-Regular": require("./../assets/fonts/Poppins-Regular.ttf"),
  //   "Poppins-SemiBold": require("./../assets/fonts/Poppins-SemiBold.ttf"),

  //   "Poppins-LightItalic": require("./../assets/fonts/Poppins-LightItalic.ttf"),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }
  const [modal, setModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState([
    {
      fase: "",
      kategori: "",
      id_kat: "",
      id_fase: "",
    },
  ]);
  const [hari, setHari] = useState();
  const [jam, setJam] = useState("00:00");

  const onSubmit = async () => {
    const id_user = await AsyncStorage.getItem("uid");

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
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        setLoading(true);
        setTimeout(() => {
          if (resp == 1) {
            Alert.alert("", "Alarm berhasil ditambahkan");
            setLoading(false);
            getAlarm();
            setModalVisible(false);
          } else {
            Alert.alert("", "Alarm gagal ditambahkan");
            setLoading(false);
            setModalVisible(false);
          }
        }, 2000);
      });
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    const time = moment(date).format("HH:mm");
    setJam(time);

    hideDatePicker();
  };

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
            });

            setData(result);
            setLoading(false);
          } else {
            setData(null);
            setLoading(false);
          }

          console.log(data);
        }, 2000);
      });
  };

  return (
    <View style={[styles.container, { padding: 15 }]}>
      <StatusBar
        barStyle={"light-content"}
        backgroundColor={COLORS.primary}
      ></StatusBar>
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

      {/* Modal Kategori Pasien */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        animationOutTiming={1000}
        animationInTiming={1000}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "grey",
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                }}
              >
                Jam
              </Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[styles.input_horizontal, { alignItems: "flex-start" }]}
              >
                <Text
                  style={{
                    color: "grey",
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                  }}
                >
                  {jam}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "grey",
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                }}
              >
                Hari Ke-
              </Text>
              <TextInput
                style={[
                  styles.input_horizontal,
                  { opacity: userData[0].id_kat == 1 ? 0.6 : 1 },
                ]}
                placeholderTextColor={grey}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={userData[0].id_kat == 1 ? "1" : hari}
                editable={userData[0].id_kat == 1 ? false : true}
              />
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
      </Modal>

      <DateTimePickerModal
        date={selectedDate}
        isVisible={datePickerVisible}
        mode="time"
        is24Hour
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModal(!modal);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "grey",
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                }}
              >
                Jam
              </Text>
              <TouchableOpacity
                onPress={showDatePicker}
                style={[styles.input_horizontal, { alignItems: "flex-start" }]}
              >
                <Text
                  style={{
                    color: "grey",
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                  }}
                >
                  {jam}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputhorizontal}>
              <Text
                style={{
                  color: "grey",
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                }}
              >
                Hari Ke-
              </Text>
              <TextInput
                style={[
                  styles.input_horizontal,
                  { opacity: userData[0].id_kat == 1 ? 0.6 : 1 },
                ]}
                placeholderTextColor={grey}
                keyboardType="number-pad"
                placeholder="0"
                onChangeText={setHari}
                value={userData[0].id_kat == 1 ? "1" : hari}
                editable={userData[0].id_kat == 1 ? false : true}
              />
            </View>
            <View
              style={[
                styles.inputhorizontal,
                { justifyContent: "space-between" },
              ]}
            >
              <TouchableOpacity
                style={[styles.btn, styles.btn2]}
                onPress={() => {
                  setModal(false);
                }}
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

      {/* jika loading selesai dan tidak ada data alarm */}

      {loading != true && data == null && (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "50%",
            // width: "90%",
            // paddingHorizontal: 10,
          }}
        >
          <Image
            style={{ width: 200, height: 157 }}
            source={require("../assets/icon/illus_alarm.png")}
          />
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 20,
              fontFamily: "Poppins-Regular",
            }}
          >
            Ayo Mulai!
          </Text>
          <Text
            style={{
              color: "grey",
              fontSize: 16,
              textAlign: "center",
              fontFamily: "Poppins-LightItalic",
            }}
          >
            Mulai untuk membuat notifikasi alarm untuk memengingatkan anda
            meminum obat
          </Text>
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
                  color: "white",
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
        <View>
          <View style={styles.box}>
            <View style={styles.jam}>
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 30,
                  color: "white",
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
                  color: "white",
                }}
              >
                {userData[0].kategori}
              </Text>
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 16,
                  color: "white",
                }}
              >
                {userData[0].fase}
              </Text>
            </View>
            <View style={styles.gmbar_container}>
              <Image
                style={{ width: 50, height: 50 }}
                source={require("../assets/icon/bell_check.png")}
              />

              {/* <Image
                style={{ width: 50, height: 50 }}
                source={require('./../assets/img/icon/bell_miss.png')}
              /> */}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AlarmScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
    alignItems: "center",
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
    width: 200,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  box: {
    backgroundColor: COLORS.primary,
    height: 100,
    width: "95%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "5%",
    marginTop: 15,
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.4,

    elevation: 10,
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
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    marginVertical: 40,
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
  },
  inputhorizontal: {
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
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
    width: "82%",
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
});
