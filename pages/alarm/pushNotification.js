import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PushNotification from "react-native-push-notification";
import moment from "moment";
const pushNotification = (lamaPengobatan, hours, minutes) => {
  const now = moment().format("YYYY-MM-DD");
  const dateNow = moment(now + " " + hours + ':' + minutes).format("YYYY-MM-DD HH:mm");
  const addDate = moment(dateNow).add(1, "day").format("YYYY-MM-DD HH:mm");
  const curDate = moment().format('YYYY-MM-DD HH:mm');
  // jika tgl + detik ini lebih dari jam alarm, maka set alarm untuk esok hari 
  PushNotification.createChannel(
    {
      channelId: "ppmo-tbc",
      channelName: "PPMO TBC",
      channelDescription: "Notifikasi pengingat minum obat",
      soundName: "sound.wav",
      playSound: true,
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  if (moment(curDate).isAfter(dateNow)) {
    // -> dateNow + 1 hari
    PushNotification.localNotificationSchedule({
      channelId: "ppmo-tbc",
      title: "Pengingat Minum Obat", // (optional)
      message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
      date: moment(addDate).toDate(),
      allowWhileIdle: true,
      repeatTime: 1,
      repeatType: "day",
      actions: ["Konfirmasi"],
    });
  }
  //jika tgl + detik ini kurang dari jam alarm, maka set alarm hari ini jug
  else if (moment(curDate).isBefore(dateNow)) {
    // datenow sama
    PushNotification.localNotificationSchedule({
      channelId: "ppmo-tbc",
      title: "Pengingat Minum Obat", // (optional)
      message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
      date: moment(dateNow).toDate(),
      allowWhileIdle: true,
      repeatTime: 1,
      repeatType: "day",
      actions: ["Konfirmasi"],
    });
  }
};

export default pushNotification;
