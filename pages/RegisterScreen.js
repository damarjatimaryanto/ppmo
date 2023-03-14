import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  Image,
  View,
  Animated,
  Alert,
  Dimensions,
  TextInput,
  Button,
  StatusBar,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Modal from "react-native-modal";

const blue_icon = "#9695C0";
const black = "#3d3d3d";
const blue_input = "#F2F3FC";
const grey = "#5C5F68";
const grey_input = "#D4D4D4";
const grey_label = "#DAD9DC";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = { primary: "#1E319D", white: "#FFFFFF" };

const RegisterScreen = () => {
  const navigation = useNavigation();
  // const [fontsLoaded] = useFonts({
  //   "Poppins-Bold": require("./../assets/fonts/Poppins-Bold.ttf"),
  //   "Poppins-Regular": require("./../assets/fonts/Poppins-Regular.ttf"),
  //   "Poppins-SemiBold": require("./../assets/fonts/Poppins-SemiBold.ttf"),
  //   "Poppins-Medium": require("./../assets/fonts/Poppins-Medium.ttf"),
  //   "Poppins-LightItalic": require("./../assets/fonts/Poppins-LightItalic.ttf"),
  // });

  // if (!fontsLoaded) {
  //   return null;
  // }

  const [isModalVisible_2, setModalVisible_2] = useState(false);

  const toggleModal_2 = () => {
    setModalVisible_2(!isModalVisible_2);
  };

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [loading, setLoading] = useState(false);
  const [dataKat, setDataKat] = useState([]);
  const [dataFase, setDataFase] = useState([]);

  const [nama, setNama] = useState();
  const [fase, setFase] = useState();
  const [faseLabel, setFaseLabel] = useState("Fase Insentif");
  const [kat, setKat] = useState();
  const [katLabel, setKatLabel] = useState();

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    getKategori();
    getFase();

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

  const getKategori = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getKategori", {})
      .then((res) => res.json())
      .then((response) => {
        setDataKat(response);
      });
  };

  const getFase = () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getFase", {})
      .then((res) => res.json())
      .then((response) => {
        setDataFase(response);
      });
  };
  const onSubmit = async () => {
    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nama: nama,
        kategori: kat,
        fase: fase,
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((response) => {
        setLoading(true);
        setTimeout(() => {
          if (response == 1) {
            Alert.alert("", "Registrasi Berhasil!", [
              {
                onPress: () => {
                  navigation.navigate("LoginScreen");
                },
              },
            ]);
          } else {
            Alert.alert("", "Registrasi Gagal!");
            setLoading(false);
          }
        }, 3000);
      });
  };

  const renderItem = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{
          height: 40,
          backgroundColor: "white",
          justifyContent: "center",
          borderRadius: 10,
          marginVertical: 4,
        }}
        onPress={() => {
          setKat(item.id_kategori_detail);
          setKatLabel(item.kategori);
          setFase("1");
          setModalVisible(false);
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
          }}
        >
          {item.kategori}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFase = ({ item }) => (
    <View>
      <TouchableOpacity
        style={{
          height: 40,
          backgroundColor: "white",
          justifyContent: "center",
          borderRadius: 10,
          marginVertical: 4,
        }}
        onPress={() => {
          setFase(item.id_fase_detail);
          setFaseLabel(item.fase);
          setModalVisible_2(false);
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
          }}
        >
          {item.fase}
        </Text>
      </TouchableOpacity>
    </View>
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
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              width: width * 0.6,
              borderRadius: 10,
            }}
          >
            <FlatList
              data={dataKat}
              renderItem={renderItem}
              keyExtractor={(item) => item.id_kategori_detail}
            />
          </View>
        </View>
      </Modal>

      {/* Modal FASE PENGOBATAN */}
      <Modal
        isVisible={isModalVisible_2}
        onBackdropPress={() => setModalVisible_2(false)}
        animationOutTiming={1000}
        animationInTiming={1000}
      >
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              flexDirection: "row",
              width: width * 0.6,
              borderRadius: 10,
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

      <View style={styles.imgContainer}>
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 30,
            fontFamily: "Poppins-Bold",
          }}
        >
          Register
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.h1}>Inputkan data anda dengan benar</Text>

        <Text style={styles.h2}>Nama Lengkap</Text>
        <View style={styles.inputContainer}>
          <View style={{ width: "15%", alignItems: "center" }}>
            <Image
              style={styles.icon_style}
              source={require("./../assets/icon/person_fill.png")}
            />
          </View>
          <View style={{ width: "85%" }}>
            <TextInput
              style={styles.input}
              placeholderTextColor={blue_icon}
              onChangeText={setNama}
              value={nama}
              placeholder="Nama Lengkap"
            />
          </View>
        </View>

        <Text style={styles.h2}>Username</Text>
        <View style={styles.inputContainer}>
          {/* <Text style={styles.h2}>Username :</Text> */}
          <View style={{ width: "15%", alignItems: "center" }}>
            <Image
              style={styles.icon_style}
              source={require("./../assets/icon/person_fill.png")}
            />
          </View>
          <View style={{ width: "85%" }}>
            <TextInput
              style={styles.input}
              placeholderTextColor={blue_icon}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
            />
          </View>
        </View>

        <Text style={styles.h2}>Password</Text>
        <View style={styles.inputContainer}>
          <View style={{ width: "15%", alignItems: "center" }}>
            <Image
              style={styles.icon_style}
              source={require("./../assets/icon/lock.png")}
            />
          </View>
          <View style={{ width: "85%" }}>
            <TextInput
              style={styles.input}
              placeholderTextColor={blue_icon}
              onChangeText={setPassword}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
            />
          </View>
        </View>

        {kat == 2 && (
          <View>
            <Text style={styles.h2}>Fase Pengobatan</Text>
            <View style={styles.inputContainer}>
              {/* <Text style={styles.h2}>Fase Pengobatan :</Text> */}
              <View style={{ width: "15%", alignItems: "center" }}>
                <Image
                  style={styles.icon_style}
                  source={require("./../assets/icon/fase_fill.png")}
                />
              </View>
              <View style={{ width: "85%" }}>
                <TouchableOpacity
                  onPress={toggleModal_2}
                  style={[styles.input, { alignItems: "flex-start" }]}
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
                        color: "black",
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
        )}

        <View style={styles.btn_Container}>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              onSubmit();
            }}
          >
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer_2}>
          <Text style={styles.kamu_nanya}>Sudah punya akun ? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
            <Text style={styles.kamu_nanya_2}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  imgContainer: {
    justifyContent: "center",
    paddingTop: "20%",
    paddingHorizontal: width * 0.095,
  },
  formContainer: {
    paddingHorizontal: width * 0.095,
    paddingVertical: 10,
  },
  inputContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: blue_input,
    borderRadius: 5,
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
  input: {
    height: 50,
    borderRadius: 10,
    color: "black",
    paddingTop: 6,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    justifyContent: "center",
  },
  inputselect: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    width: "100%",
    height: 50,
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

  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    margin: width * 0.05,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  inputContainer_2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  icon_style: {
    width: 18,
    height: 18,
    tintColor: blue_icon,
  },
});
