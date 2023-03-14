import { StyleSheet, Text, Button, View, NativeModules,TouchableOpacity,TextInput,Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import PushNotification, { Importance } from "react-native-push-notification";
import moment from 'moment';
import BackgroundJob from 'react-native-background-actions';
import BackgroundService from 'react-native-background-actions';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const COLORS = {
  primary: "#1E319D",
  white: "#FFFFFF",
  abu1: "#F6F6F6",
  blue_bg: "#F2F3FC",
  blue: "#0D4AA7",
  blue_icon: "#9695C0",
};
const Alarm = () => {

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [lamaPengobatan, setLamaPengobatan] = useState();
  const [minutes, setMinutes] = useState();
  const [hours, setHours] = useState();

    useEffect(() => {
    }, []);
    const alarm = async () => {

        const satu = 1;
        const dua = 2;
        const tiga = 3;
        const jam = moment('2023-03-01 17:08:00').format('HH:mm');

        const dateNow = moment().format('YYYY-MM-DD HH:mm');
        const startDate = moment('2023-03-01').format('YYYY-MM-DD');
        const endate = moment('2023-03-10').format('YYYY-MM-DD');

        const firstDate = moment().isoWeekday(satu).format('YYYY-MM-DD');
        const secondDate = moment().isoWeekday(dua).format('YYYY-MM-DD');
        const thirdDate = moment().isoWeekday(tiga).format('YYYY-MM-DD');

        const tglSatu = moment(firstDate + ' ' + jam).format('YYYY-MM-DD HH:mm');
        const tglDua = moment(secondDate + ' ' + jam).format('YYYY-MM-DD HH:mm');
        const tglTiga = moment(thirdDate + ' ' + jam).format('YYYY-MM-DD HH:mm');


        

        PushNotification.createChannel(
            {
                channelId: "channel-id",
                channelName: "My channel",
                channelDescription: "A channel to categorise your notifications",
                soundName: "sound.wav",
                playSound: true,
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );

        // jika tglsatu sebelum tgl skrg
        if (moment(tglSatu).isBefore(dateNow) && moment(tglDua).isBefore(dateNow) && moment(tglTiga).isBefore(dateNow)) {
            const addSatu = moment(moment(tglSatu, "YYYY-MM-DD").add(7, 'days')).format('YYYY-MM-DD');
            const convertedSatu = moment(addSatu + " " + jam).format('YYYY-MM-DD HH:mm');

            const addDua = moment(moment(tglDua, "YYYY-MM-DD").add(7, 'days')).format('YYYY-MM-DD');
            const convertedDua = moment(addDua + " " + jam).format('YYYY-MM-DD HH:mm');

            const addTiga = moment(moment(tglTiga, "YYYY-MM-DD").add(7, 'days')).format('YYYY-MM-DD');
            const convertedTiga = moment(addTiga + " " + jam).format('YYYY-MM-DD HH:mm');

            // convert satu
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message satu",
                date: moment(convertedSatu).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
            // convert dua
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message dua",
                date: moment(convertedDua).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
            // convert tiga
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message tiga",
                date: moment(convertedTiga).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
        }
        // jika tglsatu dan tgldua sebelum tgl skrg
        else if (moment(tglSatu).isBefore(dateNow) && moment(tglDua).isBefore(dateNow)) {
            const addSatu = moment(moment(tglSatu, "YYYY-MM-DD").add(7, 'days')).format('YYYY-MM-DD');
            const convertedSatu = moment(addSatu + " " + jam).format('YYYY-MM-DD HH:mm');

            const addDua = moment(moment(tglDua, "YYYY-MM-DD").add(7, 'days')).format('YYYY-MM-DD');
            const convertedDua = moment(addDua + " " + jam).format('YYYY-MM-DD HH:mm');

            // convert satu
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message satu",
                date: moment(convertedSatu).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
            // convert dua
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message dua",
                date: moment(convertedDua).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });

            // tiga
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message tiga",
                date: moment(tglTiga).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
        }
        // jika tglsatu dan tgldua dan tgltiga sebelum tgl skrg
        else if (moment(tglSatu).isBefore(dateNow)) {
            const addSatu = moment(moment(tglSatu, "YYYY-MM-DD").add(7, 'days')).format('YYYY-MM-DD');
            const convertedSatu = moment(addSatu + " " + jam).format('YYYY-MM-DD HH:mm');

            // convert satu
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message satu",
                date: moment(convertedSatu).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });

             // dua
             PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message dua",
                date: moment(tglDua).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
            // tiga
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message tiga",
                date: moment(tglTiga).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
        }
        // jika ketiganya sesudah tgl skrg
        else {
            // satu
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message satu",
                date: moment(tglSatu).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
            // dua
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message dua",
                date: moment(tglDua).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
            // tiga
            PushNotification.localNotificationSchedule({
                channelId: "channel-id",
                message: "My Notification Message tiga",
                date: moment(tglTiga).toDate(),
                allowWhileIdle: false,
                repeatTime: 7,
                repeatType: 'day'
            });
        }
    }
    return (
        <View style={styles.container}>
          <Text>Lama Pengobatan</Text>
            <TextInput
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "yellow",
                  textAlign: "center",
                  fontSize: 40,
                  fontFamily: "Poppins-Bold",
                  paddingTop: 25,
                  color: COLORS.primary,
                  borderRadius: 10,
                }}
                placeholderTextColor={COLORS.primary}
                keyboardType="number-pad"
                placeholder="00"
                value={lamaPengobatan}
                onChangeText={setLamaPengobatan}
              />
            <View style={{ marginTop: "15%", marginBottom: "10%" }}>
        <View
          style={{
            flexDirection: "row",
            height: 200,
            width: width - 30,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: "40%" }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 12,
                color: "black",
              }}
            >
              Jam
            </Text>
            <View
              // onPress={modalHours}
              style={styles.alarm_set_style}
            >
              <TextInput
                style={{
                  width: "80%",
                  height: "80%",
                  textAlign: "center",
                  fontSize: 80,
                  fontFamily: "Poppins-Bold",
                  color: COLORS.primary,
                  borderRadius: 10,
                }}
                maxLength={2}
                placeholderTextColor={COLORS.primary}
                onChangeText={(value) => onChangeJam(value)}
                keyboardType="number-pad"
                placeholder="00"
                value={hours}
                onChangeText={setHours}
              />
            </View>
          </View>

          <View style={styles.titikdua_style}>
            <Text style={styles.titikdua_text}>:</Text>
          </View>

          <View style={{ width: "40%" }}>
            <Text
              style={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 12,
                color: "black",
              }}
            >
              Menit
            </Text>
            <View
              // onPress={modalMinutes}
              style={styles.alarm_set_style}
            >
              <TextInput
                style={{
                  width: "80%",
                  height: "80%",
                  textAlign: "center",
                  fontSize: 80,
                  fontFamily: "Poppins-Bold",
                  paddingTop: 25,
                  color: COLORS.primary,
                  borderRadius: 10,
                }}
                onChangeText={(value) => onChangeMenit(value)}
                maxLength={2}
                placeholderTextColor={COLORS.primary}
                keyboardType="number-pad"
                placeholder="00"
                value={minutes}
                onChangeText={setMinutes}
              />
            </View>
          </View>
        </View>
      </View>

<Text>Pilih Hari</Text>
      <View style={{ flexDirection: "row",height: 50,justifyContent: "center",alignItems: "center",marginVertical: 10,}}>
          <TouchableOpacity style={styles.boxhari_blue}>
            <Text style={{ color: COLORS.white, fontFamily: "Poppins-Regular"}}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxhari_grey}>
            <Text style={{color: COLORS.primary,fontFamily: "Poppins-Regular"}}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxhari_blue}>
            <Text style={{ color: COLORS.white, fontFamily: "Poppins-Regular"}}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxhari_grey}>
            <Text style={{color: COLORS.primary,fontFamily: "Poppins-Regular",}}>R</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxhari_blue}>
            <Text style={{ color: COLORS.white, fontFamily: "Poppins-Regular"}}>K</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxhari_grey}>
            <Text style={{color: COLORS.primary,fontFamily: "Poppins-Regular",}}>J</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.boxhari_blue}>
            <Text style={{ color: COLORS.white, fontFamily: "Poppins-Regular"}}>S</Text>
          </TouchableOpacity>
          </View>
        </View>
    )
}


export default Alarm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        paddingTop:30
    },
    input_harike: {
      fontFamily: "Poppins-SemiBold",
      // fontSize: 12,
      color: "black",
      width: "100%",
      height: "100%",
      backgroundColor: "yellow",
      textAlign: "center",
    },
    alarm_set_style: {
      backgroundColor: COLORS.blue_bg,
      width: "100%",
      height: 150,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10,
      paddingTop: 10,
    },
    alarm_set_text: {
      fontSize: 100,
      // textAlignVertical: "center",
      fontFamily: "Poppins-Bold",
      // backgroundColor: "yellow",
      paddingTop: 17,
      color: COLORS.primary,
    },
    titikdua_style: {
      // backgroundColor: "yellow",
      width: 50,
      height: 200,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      // marginHorizontal: 5,
    },
    titikdua_text: {
      fontFamily: "Poppins-Bold",
      fontSize: 50,
      color: COLORS.primary,
      paddingTop: 21,
    },
    boxhari_blue: {
      backgroundColor: COLORS.primary,
      width: 33,
      height: 33,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 6,
      borderRadius: 50,
    },
    boxhari_grey: {
      backgroundColor: "#F2F3FC",
      width: 33,
      height: 33,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 6,
      borderRadius: 50,
      borderColor: COLORS.primary,
      borderWidth: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 10,
    },
})