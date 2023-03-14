import * as Notifications from "expo-notifications";

const pushScheduled = async (hrs, min, day) => {
  // console.log("jam : " + hrs, " min : " + min, " day : " + day);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  await Notifications.getPermissionsAsync();
  let a = existingStatus;
  console.log(a);
  // const { status: existingStatus } = await Permissions.getAsync(Permissions.Notifications)
  await Notifications.setNotificationChannelAsync("Minum Obat", {
    name: "Notifikasi Pengingat Minum Obat",
    importance: Notifications.AndroidImportance.HIGH,
    sound: true,
    enableVibrate: true,
    vibrationPattern: [0, 250, 250, 250],
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Waktunya Minum Obat",
      body: "Lakukan Konfirmasi dengan menekan notifikasi ini",
      data: { path: "Konfirmasi" },
      shouldPlaySound: true,
      sound: "sound.wav",
    },
    trigger: {
      weekday: day,
      hour: hrs,
      minute: min,
      repeats: true,
      channelId: "ppmo-tbc-",
    },
  });
  await Notifications.setNotificationCategoryAsync("ppmo-tbc", [
    {
      actionId: "konfirmasi",
      buttonTitle: "Konfirmasi",
    },
  ]);
};

export default pushScheduled;
