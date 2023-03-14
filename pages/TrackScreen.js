import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
import "moment/locale/id";
const COLORS = {
  primary: "#1E319D",
  white: "#FFFFFF",
  abu1: "#F6F6F6",
  blue_soft: "#F2F8FD",
};
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const TrackScreen = () => {
  LocaleConfig.locales["id"] = {
    monthNames: [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ],
    monthNamesShort: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agust",
      "Sept",
      "Okt",
      "Nov",
      "Des",
    ],
    dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
    dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
    today: "Hari ini",
  };
  LocaleConfig.defaultLocale = "id";
  const [data, setData] = useState([
    {
      hari: null,
      id_riwayat: null,
      id_status_detail: null,
      id_user: null,
      tgl: null,
    },
  ]);

  const [markedDate, setMarkedDate] = useState();
  const [selectedDate, setSelectedDate] = useState("");

  const onSelectDate = async (day) => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));

    fetch("https://afanalfiandi.com/ppmo/api/api.php?op=selectDate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userData[0].id_user,
        tgl: day.dateString,
      }),
    })
      .then((res) => res.json())
      .then((resp) => {
        if (resp != "null") {
          setSelectedDate(resp);
        } else {
          setSelectedDate(null);
        }
      });
  };

  const getAlarm = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem("userData"));
  };
  const getRiwayat = async () => {
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
      .then((a) => a.json())
      .then((b) => {
        fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getRiwayat", {
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
            if (resp != null) {
              const result = [];
              if (b.hari != 1) {
                const strtdate = moment()
                  .subtract(b.hari, "d")
                  .format("YYYY-MM-DD");

                for (var i = 1; i <= b.hari; i++) {
                  result.push({
                    [moment().subtract(i, "d").format("YYYY-MM-DD")]: {
                      disabled: true,
                      startingDay: true,
                      color: COLORS.primary,
                      endingDay: true,
                      textColor: "white",
                    },
                  });
                }

                resp.map((item, index) => {
                  result.push({
                    [item.tgl]: {
                      disabled: true,
                      startingDay: true,
                      color: COLORS.primary,
                      endingDay: true,
                      textColor: "white",
                    },
                  });

                  const output = Object.assign({}, ...result);

                  setMarkedDate(output);
                });
                console.log(result);
              } else {
                resp.map((item, index) => {
                  result.push({
                    [item.tgl]: {
                      disabled: true,
                      startingDay: true,
                      color: COLORS.primary,
                      endingDay: true,
                      textColor: "white",
                    },
                  });

                  const output = Object.assign({}, ...result);

                  setMarkedDate(output);
                });
              }
            } else {
              setMarkedDate(null);
            }
          });
      });
  };
  useEffect(() => {
    getAlarm();
    getRiwayat();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View
        style={{
          width: width - 20,
          // paddingTop: 10,
          shadowColor: "black",
          marginVertical: 15,
          // borderRadius: 5,
          // shadowOffset: {
          //   width: 0,
          //   height: 4,
          // },
          // shadowOpacity: 0.3,
          // shadowRadius: 0.4,

          // elevation: 5,
        }}
      >
        <Calendar
          style={{
            backgroundColor: "white",
            padding: 10,
            shadowColor: "black",
            borderRadius: 5,
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 0.4,

            elevation: 5,
            paddingTop: 15,
            // height: 700,
            // borderWidth: 4,
            // borderColor: COLORS.abu1,
          }}
          theme={{
            backgroundColor: COLORS.white,
            calendarBackground: COLORS.white,
            textSectionTitleColor: COLORS.primary,
            textSectionTitleDisabledColor: "green",
            selectedDayBackgroundColor: "red",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "red",
            dayTextColor: COLORS.primary,
            textDisabledColor: "grey",
            dotColor: "red",
            selectedDotColor: "#ffffff",
            arrowColor: COLORS.primary,
            disabledArrowColor: "#d9e1e8",
            monthTextColor: COLORS.primary,
            indicatorColor: COLORS.primary,
            textDayFontFamily: "Poppins-Regular",
            textMonthFontFamily: "Poppins-Regular",
            textDayHeaderFontFamily: "Poppins-Regular",
            // textDayFontWeight: "300",
            // textMonthFontWeight: "bold",
            // textDayHeaderFontWeight: "300",
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 14,
          }}
          markingType={"period"}
          markedDates={markedDate}
          onDayPress={(day) => {
            onSelectDate(day);
          }}
        />
      </View>

      {selectedDate == "" && <View></View>}
      {selectedDate != null && selectedDate != "" && (
        <View style={styles.box}>
          <View
            style={{
              width: "25%",
              backgroundColor: COLORS.primary,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Image
              style={{ width: "60%", height: "60%", tintColor: "white" }}
              resizeMode="contain"
              source={require("./../assets/icon/checklist.png")}
            />
          </View>
          <View
            style={{
              width: "75%",
              // backgroundColor: "yellow",
              height: "100%",
              paddingLeft: 10,
            }}
          >
            <View style={styles.baris}>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Tgl</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}>
                  : {moment(selectedDate.tgl).format("dddd")},{" "}
                  {moment(selectedDate.tgl).format("DD MMMM YYYY")}
                </Text>
              </View>
            </View>
            <View style={styles.baris}>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Hari Ke</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}>: {selectedDate.hari}</Text>
              </View>
            </View>

            <View style={styles.baris}>
              <View style={styles.judul_style}>
                <Text style={styles.judul_isi}>Fase</Text>
              </View>
              <View style={styles.ket_style}>
                <Text style={styles.ket_isi}>: {selectedDate.fase}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {selectedDate == null && (
        <View style={styles.box}>
          <View
            style={{
              width: "25%",
              backgroundColor: "grey",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Image
              style={{ width: "60%", height: "60%", tintColor: "white" }}
              resizeMode="contain"
              source={require("./../assets/icon/info.png")}
            />
          </View>
          <View
            style={{
              width: "75%",
              // backgroundColor: "yellow",
              height: "100%",
              paddingLeft: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "Poppins-Regular", fontSize: 16 }}>
              Data Tidak Ada
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TrackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    // justifyContent: "center",
    alignItems: "center",
  },
  keterangan: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  judulketerangan: {
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: "Poppins-Regular",
  },
  box_2: {
    backgroundColor: "#FFFFFF",
    width: width - 30,
    paddingHorizontal: "2%",
    marginTop: 2,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    borderRadius: 3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.4,

    elevation: 5,
  },
  box: {
    backgroundColor: "#FFFFFF",
    width: width - 30,
    height: 110,
    paddingHorizontal: "2%",
    marginTop: 2,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    borderRadius: 3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.4,

    elevation: 5,
  },
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
  baris: {
    flexDirection: "row",
    width: "100%",
    // backgroundColor: "yellow",
    marginVertical: 5,
  },
});
