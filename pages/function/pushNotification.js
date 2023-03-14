import * as Notifications from "expo-notifications";

const pushNotification = async (hrs, min) => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      importance: Notifications.AndroidImportance.HIGH,
    }),
  });

  await Notifications.setNotificationChannelAsync("ppmo-tbc", {
    name: "Notifikasi Pengingat Minum Obat",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "sound.wav",
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Waktunya Minum Obat",
      body: "Lakukan Konfirmasi dengan menekan notifikasi ini",
      data: { path: "Konfirmasi" },
      categoryIdentifier: "ppmo-tbc",
      sound: "sound.wav",
    },
    trigger: {
      hour: parseFloat(hrs),
      minute: parseFloat(min),
      repeats: true,
      sound: "sound.wav",
      channelId: "ppmo-tbc",
    },
  });

  await Notifications.setNotificationCategoryAsync("ppmo-tbc", [
    {
      actionId: "konfirmasi",
      buttonTitle: "Konfirmasi",
    },
  ]);
};

export default pushNotification;
