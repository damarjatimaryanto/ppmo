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
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  const dateNow = moment().format("YYYY-MM-DD HH:mm");

  // tgl asli, 2023-01-01
  var satudate;
  var duadate;
  var tigadate;
  var empatdate;
  var limadate;
  var enamdate;
  var tujuhdate;

  // tambah 7 hari, 2023-01-07
  var addSatu;
  var addDua;
  var addTiga;
  var addEmpat;
  var addLima;
  var addEnam;
  var addTujuh;

  // convert jam
  var convertSatu;
  var convertDua;
  var convertTiga;
  var convertEmpat;
  var convertLima;
  var convertEnam;
  var convertTujuh;

  // convert jam
  var convertBesokSatu;
  var convertBesokDua;
  var convertBesokTiga;
  var convertBesokEmpat;
  var convertBesokLima;
  var convertBesokEnam;
  var convertBesokTujuh;

  for (const index of hr.keys()) {
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");
    satudate = moment().isoWeekday(hr[0]).format("YYYY-MM-DD");

    addSatu = moment(moment(satudate, "YYYY-MM-DD").add(7, "days")).format(
      "YYYY-MM-DD"
    );
    addSatu = moment(moment(satudate, "YYYY-MM-DD").add(7, "days")).format(
      "YYYY-MM-DD"
    );
    addSatu = moment(moment(satudate, "YYYY-MM-DD").add(7, "days")).format(
      "YYYY-MM-DD"
    );
    addSatu = moment(moment(satudate, "YYYY-MM-DD").add(7, "days")).format(
      "YYYY-MM-DD"
    );

    // kemarin
    convertSatu = moment(addSatu + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );
    convertSatu = moment(addSatu + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );
    convertSatu = moment(addSatu + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );
    convertSatu = moment(addSatu + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );

    // besoknya
    convertBesokSatu = moment(satudate + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );
    convertBesokSatu = moment(satudate + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );
    convertBesokSatu = moment(satudate + " " + hours + ":" + minutes).format(
      "YYYY-MM-DD HH:mm"
    );

    // PushNotification.localNotificationSchedule({
    //   channelId: "ppmo-tbc",
    //   title: "Pengingat Minum Obat", // (optional)
    //   message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
    //   date: moment(convertedDua).toDate(),
    //   allowWhileIdle: false,
    //   repeatTime: 7,
    //   repeatType: "day",
    //   // actions: ["Konfirmasi"],
    // });
  }

  var hr = [2, 3, 4, 6];

  if (hr[0] != null) {
    if (moment(convertSatu).isBefore(dateNow)) {
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertBesokSatu).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    } else if (hr[1] != null) {
      if (moment(convertDua).isBefore(dateNow)) {
        PushNotification.localNotificationSchedule({
          channelId: "ppmo-tbc",
          title: "Pengingat Minum Obat", // (optional)
          message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
          date: moment(convertBesokSatu).toDate(),
          allowWhileIdle: false,
          repeatTime: 7,
          repeatType: "day",
          // actions: ["Konfirmasi"],
        });

        PushNotification.localNotificationSchedule({
          channelId: "ppmo-tbc",
          title: "Pengingat Minum Obat", // (optional)
          message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
          date: moment(convertBesokDua).toDate(),
          allowWhileIdle: false,
          repeatTime: 7,
          repeatType: "day",
          // actions: ["Konfirmasi"],
        });
      }
    } } else if (hr[2] != null) {
      if (moment(convertDua).isBefore(dateNow)) {
        PushNotification.localNotificationSchedule({
          channelId: "ppmo-tbc",
          title: "Pengingat Minum Obat", // (optional)
          message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
          date: moment(convertBesokSatu).toDate(),
          allowWhileIdle: false,
          repeatTime: 7,
          repeatType: "day",
          // actions: ["Konfirmasi"],
        });
      }
    }
  }
};

export default pushLanjutan;
