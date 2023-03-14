import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
const getAlarm = async () => {
  const dataAlarm = await AsyncStorage.getItem("alarm");
  // AsyncStorage.removeItem("alarm");
  // AsyncStorage.removeItem("labelHariSatu");
  // AsyncStorage.removeItem("labelHariDua");
  // AsyncStorage.removeItem("labelHariTiga");

  const userData = JSON.parse(await AsyncStorage.getItem("userData"));

  const dataHari = [
    {
      key: 1,
      hari: "Min",
    },
    {
      key: 2,
      hari: "Sen",
    },
    {
      key: 3,
      hari: "Sel",
    },
    {
      key: 4,
      hari: "Rab",
    },
    {
      key: 5,
      hari: "Kam",
    },
    {
      key: 6,
      hari: "Jum",
    },
    {
      key: 7,
      hari: "Sab",
    },
  ];
  fetch("https://afanalfiandi.com/ppmo/api/api.php?op=getAlarm", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userData[0].id_user,
    }),
  })
    .then((res) => res.json())
    .then((resp) => {
      setTimeout(async () => {
        const userSession = [];
        if (resp != 0) {
          const startDate = resp.start;
          const endDate = resp.end;
          //   //       // const dateNow = moment(new Date()).format("2024-01-01");
          const dateNow = moment(new Date()).format("YYYY-MM-DD");
          const selisih = moment(dateNow).isAfter(endDate, "day");
          if (selisih == true) {
            AsyncStorage.removeItem("alarm");
          } else {
            const id_alarm = resp.id_alarm;
            const id_user = resp.id_user;
            const jam = resp.jam;
            const hari = resp.hari;
            const result = [];

            if (resp.id_fase == "1") {
              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                id_fase: resp.id_fase,
                jam: jam,
                hari: hari,
                startDate: startDate,
                endDate: endDate,
              });
            } else if (resp.id_fase == "2") {
              dataHari.map((item, index) => {
                if (resp.hari_satu == item.key) {
                  AsyncStorage.setItem("labelHariSatu", item.hari);
                }
                if (resp.hari_dua == item.key) {
                  AsyncStorage.setItem("labelHariDua", item.hari);
                }
                if (resp.hari_tiga == item.key) {
                  AsyncStorage.setItem("labelHariTiga", item.hari);
                }
              });

              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                id_fase: resp.id_fase,
                jam: jam,
                hari_satu: resp.hari_satu,
                hari_dua: resp.hari_dua,
                hari_tiga: resp.hari_tiga,
                startDate: startDate,
                endDate: endDate,
              });
            } else {
              dataHari.map((item, index) => {
                if (resp.hari_satu == item.key) {
                  AsyncStorage.setItem("labelHariSatu", item.hari);
                }
                if (resp.hari_dua == item.key) {
                  AsyncStorage.setItem("labelHariDua", item.hari);
                }
                if (resp.hari_tiga == item.key) {
                  AsyncStorage.setItem("labelHariTiga", item.hari);
                }
              });

              result.push({
                id_alarm: id_alarm,
                id_user: id_user,
                id_fase: resp.id_fase,
                jam: jam,
                hari_satu: resp.hari_satu,
                hari_dua: resp.hari_dua,
                hari_tiga: resp.hari_tiga,
                startDate: startDate,
                endDate: endDate,
                lama_pengobatan: resp.lama_pengobatan,
                fase: resp.fase,
              });
            }
            AsyncStorage.setItem("alarm", JSON.stringify(result));
          }
        } else {
          AsyncStorage.removeItem("alarm");
        }
      }, 0);
    });
};

export default getAlarm;
