import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { ToastAndroid } from "react-native";
import pushScheduled from "./pushScheduled";
import getAlarm from "./getAlarm";
import pushSchedule from "../alarm/pushSchedule";
const addExtend = async (
  hours,
  minutes,
  lamaPengobatan,
  hari,
  jam,
  fase,
  hariAlarm,
  s, d, t,
) => {
  const userData = JSON.parse(await AsyncStorage.getItem("userData"));

  const hrs = parseFloat(hours);
  const min = parseFloat(minutes);
  const startDate = new Date();
  const newDate = moment(startDate).format("YYYY-MM-DD");
  const endDate = moment(startDate).add(lamaPengobatan, "days").toDate();
  const newEndDate = moment(endDate).format("YYYY-MM-DD");

  const satu = parseFloat(hariAlarm[0]);
  const dua = parseFloat(hariAlarm[1]);
  const tiga = parseFloat(hariAlarm[2]);

  // // insert
  fetch("https://afanalfiandi.com/ppmo/api/api.php?op=insAlarmExtend", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userData[0].id_user,
      hari: hari,
      hari_satu: satu,
      hari_dua: dua,
      hari_tiga: tiga,
      jam: jam,
      fase: fase,
      start: newDate,
      end: newEndDate,
      lama_pengobatan: lamaPengobatan,
      hour: hours,
      minute: minutes,
    }),
  })
    .then((res) => res.json())
    .then(async (resp) => {
      if (resp == 1) {
        pushSchedule(s, d, t, lamaPengobatan, jam, fase, hours, minutes);
        // hariAlarm.map((d) => {
        //   pushScheduled(hrs, min, d);
        // });
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

export default addExtend;
