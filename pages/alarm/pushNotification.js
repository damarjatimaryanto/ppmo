import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PushNotification from "react-native-push-notification";
import moment from "moment";
const pushNotification = (lamaPengobatan, jam) => {
  const now = moment().format("YYYY-MM-DD");
  const dateNow = moment(now + " " + jam).format("YYYY-MM-DD HH:mm");

  PushNotification.createChannel(
    {
      channelId: "ppmo-tbc",
      channelName: "My channel",
      channelDescription: "A channel to categorise your notifications",
      soundName: "sound.wav",
      playSound: true,
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.localNotificationSchedule({
    channelId: "ppmo-tbc",
    title: "Pengingat Minum Obat", // (optional)
    message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
    date: moment(dateNow).toDate(),
    allowWhileIdle: false,
    repeatTime: 1,
    repeatType: "day",
    actions: ["Konfirmasi"],
  });
};

export default pushNotification;
