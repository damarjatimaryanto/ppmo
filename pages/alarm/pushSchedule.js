import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PushNotification, { Importance } from "react-native-push-notification";
import moment from "moment";

const pushSchedule = (
  satu,
  dua,
  tiga,
  lamaPengobatan,
  jam,
  fase,
  hours,
  minutes
) => {
  const dateNow = moment().format("YYYY-MM-DD HH:mm");
  const startDate = moment().isoWeekday(satu).format("YYYY-MM-DD");
  const endDate = moment(startDate)
    .add(lamaPengobatan, "day")
    .format("YYYY-MM-DD");

  const firstDate = moment().isoWeekday(satu).format("YYYY-MM-DD");
  const secondDate = moment().isoWeekday(dua).format("YYYY-MM-DD");
  const thirdDate = moment().isoWeekday(tiga).format("YYYY-MM-DD");

  const tglSatu = moment(firstDate + " " + hours + ":" + minutes).format(
    "YYYY-MM-DD HH:mm"
  );
  const tglDua = moment(secondDate + " " + hours + ":" + minutes).format(
    "YYYY-MM-DD HH:mm"
  );
  const tglTiga = moment(thirdDate + " " + hours + ":" + minutes).format(
    "YYYY-MM-DD HH:mm"
  );

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

  if (fase != 1) {
    // jika tglsatu sebelum tgl skrg
    if (
      moment(tglSatu).isBefore(dateNow) &&
      moment(tglDua).isBefore(dateNow) &&
      moment(tglTiga).isBefore(dateNow)
    ) {
      const addSatu = moment(
        moment(tglSatu, "YYYY-MM-DD").add(7, "days")
      ).format("YYYY-MM-DD");

      const convertedSatu = moment(
        addSatu + " " + hours + ":" + minutes
      ).format("YYYY-MM-DD HH:mm");

      const addDua = moment(moment(tglDua, "YYYY-MM-DD").add(7, "days")).format(
        "YYYY-MM-DD"
      );
      const convertedDua = moment(addDua + " " + hours + ":" + minutes).format(
        "YYYY-MM-DD HH:mm"
      );

      const addTiga = moment(
        moment(tglTiga, "YYYY-MM-DD").add(7, "days")
      ).format("YYYY-MM-DD");
      const convertedTiga = moment(
        addTiga + " " + hours + ":" + minutes
      ).format("YYYY-MM-DD HH:mm");

      // convert satu
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertedSatu).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
      // convert dua
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertedDua).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
      // convert tiga
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertedTiga).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    }
    // jika tglsatu dan tgldua sebelum tgl skrg
    else if (
      moment(tglSatu).isBefore(dateNow) &&
      moment(tglDua).isBefore(dateNow)
    ) {
      const addSatu = moment(
        moment(tglSatu, "YYYY-MM-DD").add(7, "days")
      ).format("YYYY-MM-DD");
      const convertedSatu = moment(
        addSatu + " " + hours + ":" + minutes
      ).format("YYYY-MM-DD HH:mm");

      const addDua = moment(moment(tglDua, "YYYY-MM-DD").add(7, "days")).format(
        "YYYY-MM-DD"
      );
      const convertedDua = moment(addDua + " " + hours + ":" + minutes).format(
        "YYYY-MM-DD HH:mm"
      );

      // convert satu
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertedSatu).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
      // convert dua
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertedDua).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });

      // tiga
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(tglTiga).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    }
    // jika tglsatu dan tgldua dan tgltiga sebelum tgl skrg
    else if (moment(tglSatu).isBefore(dateNow)) {
      const addSatu = moment(
        moment(tglSatu, "YYYY-MM-DD").add(7, "days")
      ).format("YYYY-MM-DD");
      const convertedSatu = moment(
        addSatu + " " + hours + ":" + minutes
      ).format("YYYY-MM-DD HH:mm");

      // convert satu
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(convertedSatu).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });

      // dua
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(tglDua).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
      // tiga
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(tglTiga).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    }
    // jika ketiganya sesudah tgl skrg
    else {
      // satu
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(tglSatu).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
      // dua
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(tglDua).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
      // tiga
      PushNotification.localNotificationSchedule({
        channelId: "ppmo-tbc",
        title: "Pengingat Minum Obat", // (optional)
        message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
        date: moment(tglTiga).toDate(),
        allowWhileIdle: false,
        repeatTime: 7,
        repeatType: "day",
        // actions: ["Konfirmasi"],
      });
    }
  } else {
    PushNotification.localNotificationSchedule({
      channelId: "ppmo-tbc",
      title: "Pengingat Minum Obat", // (optional)
      message: "Lakukan Konfirmasi dengan menekan notifikasi ini",
      date: moment(tglSatu).toDate(),
      allowWhileIdle: false,
      repeatTime: 7,
      repeatType: "day",
      // actions: ["Konfirmasi"],
    });
  }
};

export default pushSchedule;
