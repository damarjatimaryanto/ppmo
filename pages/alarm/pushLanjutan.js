import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PushNotification, { Importance } from "react-native-push-notification";
import moment from "moment";

const pushLanjutan = (hr, lamaPengobatan, jam, fase, hours, minutes) => {
  PushNotification.createChannel(
    {
      channelId: "ppmo-tbc",
      channelName: "My channel",
      channelDescription: "A channel to categorise your notifications",
      soundName: "sound.wav",
      playSound: true,
    },
    (created) => {} // (optional) callback returns whether the channel was created, false means it already existed.
  );

  const dateNow = moment().format("YYYY-MM-DD HH:mm");

  const tgl = []; // berisi tgl asli berdasarkan hari yang dipilih
  var convert = []; // berisi tgl yg sudah dibentuk dengan format YYYY-MM-DD
  var convertJam = []; // berisi tgl yg sudah diberi jam dengan format YYYY-MM-DD HH:mm
  var convertSeminggu = []; // berisi tgl yg sudah ditambahkan 7 hari dengan format YYYY-MM-DD HH:mm

  for (const i of hr.keys()) {
    tgl.push(moment().isoWeekday(hr[i]).format("YYYY-MM-DD"));
  }

  for (const index of tgl.keys()) {
    convert.push(moment(tgl[index]).format("YYYY-MM-DD"));
  }

  for (const i of convert.keys()) {
    convertJam.push(
      moment(convert[i] + " " + hours + ":" + minutes).format(
        "YYYY-MM-DD HH:mm"
      )
    );
  }

  for (const ind of convertJam.keys()) {
    convertSeminggu.push(
      moment(moment(convertJam[ind], "YYYY-MM-DD HH:mm").add(7, "days")).format(
        "YYYY-MM-DD HH:mm"
      )
    );
  }

  for (const i of tgl.keys()) {
    if (moment(convertJam[i]).isBefore(dateNow)) {
      console.log("seminggu : " + convertSeminggu[i]);
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertSeminggu[i]).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    } else {
      console.log("asli : " + convertJam[i]);
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertJam[i]).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    }
  }
};

export default pushLanjutan;
