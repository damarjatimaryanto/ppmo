import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { ToastAndroid } from "react-native";
// import pushNotification from "./pushNotification";
import * as Notifications from "expo-notifications";
import getAlarm from "./getAlarm";
import pushNotification from "../alarm/pushNotification";
const addInsentif = async (hours, minutes, lamaPengobatan, hari, jam, fase) => {
  const userData = JSON.parse(await AsyncStorage.getItem("userData"));

  const hrs = parseFloat(hours);
  const min = parseFloat(minutes);
  const startDate = new Date();
  const newDate = moment(startDate).format("YYYY-MM-DD");
  const endDate = moment(startDate).add(lamaPengobatan, "days").toDate();
  const newEndDate = moment(endDate).format("YYYY-MM-DD");

  fetch("https://afanalfiandi.com/ppmo/api/api.php?op=insAlarm", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userData[0].id_user,
      hari: hari,
      jam: jam,
      fase: fase,
      start: newDate,
      end: newEndDate,
      hour: hrs,
      minute: min,
    }),
  })
    .then((res) => res.json())
    .then(async (resp) => {
      if (resp == "1") {
        // pushNotification(hrs, min);
        pushNotification(lamaPengobatan, jam);
        AsyncStorage.setItem("alarmSession", "1");
        try {
          await AsyncStorage.removeItem("selisihSession");
        } catch (error) {
          console.log(error);
        }

        ToastAndroid.show("Alarm Berhasil Ditambahkan!", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Alarm Gagal Ditambahkan!", ToastAndroid.SHORT);
      }
    });
};

export default addInsentif;
