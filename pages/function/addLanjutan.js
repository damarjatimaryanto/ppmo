import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { ToastAndroid } from "react-native";
import pushScheduled from "./pushScheduled";
import getAlarm from "./getAlarm";
import { useNavigation } from "@react-navigation/native";
import pushNotification from "../alarm/pushNotification";
import pushLanjutan from "../alarm/pushLanjutan";
const addLanjutan = async (
  hours,
  minutes,
  lamaPengobatan,
  hari,
  jam,
  fase,
  hariAlarm,
  s,
  d,
  t
) => {
  const userData = JSON.parse(await AsyncStorage.getItem("userData"));
  const hrs = parseFloat(hours);
  const min = parseFloat(minutes);
  const startDate = new Date();
  const newDate = moment(startDate).format("YYYY-MM-DD");
  const endDate = moment(startDate).add(lamaPengobatan, "days").toDate();
  const newEndDate = moment(endDate).format("YYYY-MM-DD");

  const hr = hariAlarm.sort();

  // // insert
  // fetch("https://afanalfiandi.com/ppmo/api/api.php?op=insAlarmLanjutan", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     id: userData[0].id_user,
  //     hari: hari,
  //     jam: jam,
  //     fase: fase,
  //     start: newDate,
  //     end: newEndDate,
  //     hour: hours,
  //     minute: minutes,
  //     hr: hr,
  //   }),
  // })
  //   .then((res) => res.json())
  //   .then(async (resp) => {
  //     if (resp == "1") {
  // AsyncStorage.setItem("alarmSession", "1");
  // try {
  //   await AsyncStorage.removeItem("selisihSession");
  // } catch (error) {
  //   console.log(error);
  // }

  ToastAndroid.show("Alarm Berhasil Ditambahkan!", ToastAndroid.SHORT);
  pushLanjutan(hr, lamaPengobatan, jam, fase, hours, minutes);
  // hariAlarm.map((d) => {
  //   pushScheduled(hrs, min, d);
  // });
  //   } else {
  //     ToastAndroid.show("Alarm Gagal Ditambahkan!", ToastAndroid.SHORT);
  //   }
  // })
  // .catch((e) => {
  //   console.log(e);
  // });
};

export default addLanjutan;
