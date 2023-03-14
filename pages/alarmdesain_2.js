import {
  StyleSheet,
  PermissionsAndroid,
  Modal,
  ActivityIndicator,
  Text,
  Image,
  View,
  Animated,
  Alert,
  TouchableOpacity,
  Button,
  StatusBar,
  AppRegistry,
  Dimensions,
  SafeAreaView,
  ImageBackground,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useRef, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Color from "color";

const COLORS = {
  primary: "#1E319D",
  white: "#FFFFFF",
  abu1: "#F6F6F6",
  blue_bg: "#F2F3FC",
};
const blue = "#0D4AA7";
const black = "#3d3d3d";
const red = "#C74B4C";
const grey = "#5C5F68";
const blue_icon = "#9695C0";
const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;
const TestScreen_2 = () => {
  const navigation = useNavigation();
  var myloop = [];

  for (let i = 0; i < 10; i++) {
    myloop.push(
      <View key={i}>
        <Text>{i}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        style={[styles.container]}
        resizeMode="cover"
        source={require("./../assets/icon/bg4.png")}
      > */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          width: width - 30,
          paddingTop: "10%",
        }}
      >
        <View style={{ width: "40%" }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 12 }}>
            Fase
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORS.blue_bg,
              width: "100%",
              height: 40,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 10,
              paddingHorizontal: "2%",
            }}
          >
            <View
              style={{
                width: "65%",
                height: "80%",
                // backgroundColor: "yellow",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",

                  // textAlign: "center",
                  // verticalAlign: "center",
                }}
              >
                Pilih Fase
              </Text>
            </View>
            <View
              style={{
                width: "30%",
                // backgroundColor: grey,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={require("./../assets/icon/down_2.png")}
                style={{
                  width: 20,
                  height: 10,
                  marginLeft: 10,
                  tintColor: COLORS.primary,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ width: "20%" }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 12 }}>
            Hari Ke
          </Text>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.blue_bg,
              width: "100%",
              height: 40,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 10,
            }}
          >
            <TextInput
              style={{
                fontFamily: "Poppins-SemiBold",
                // fontSize: 12,
                color: "black",
                width: "100%",
                height: "100%",
                // backgroundColor: "yellow",
                textAlign: "center",
              }}
              placeholderTextColor={black}
              keyboardType="number-pad"
              placeholder="0"
            ></TextInput>
          </View>
        </View>

        <View style={{ width: "20%" }}>
          <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 12 }}>
            Lama (H)
          </Text>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: COLORS.blue_bg,
              width: "100%",
              height: 40,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 10,
            }}
          >
            <TextInput
              style={{
                fontFamily: "Poppins-SemiBold",
                // fontSize: 12,
                color: "black",
                width: "100%",
                height: "100%",
                // backgroundColor: "yellow",
                textAlign: "center",
              }}
              placeholderTextColor={black}
              keyboardType="number-pad"
              placeholder="0"
            ></TextInput>
          </View>
        </View>
      </View>
      <View style={{ marginTop: "15%", marginBottom: "10%" }}>
        <View
          style={{
            flexDirection: "row",
            // backgroundColor: "grey",
            height: 200,
            width: width * 0.83,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.blue_bg,
              width: "40%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              // shadowColor: "#000",
              // shadowOffset: { width: 0, height: 2 },
              // shadowOpacity: 0.25,
              // shadowRadius: 3.84,
              // elevation: 10,
            }}
          >
            <TextInput
              style={{
                width: "80%",
                height: "80%",
                // backgroundColor: "yellow",
                textAlign: "center",
                fontSize: 100,
                textAlignVertical: "center",
                fontFamily: "Poppins-Bold",
                paddingTop: 20,
                color: COLORS.primary,
              }}
              maxLength={24}
              placeholderTextColor={COLORS.primary}
              keyboardType="number-pad"
              placeholder="00"
            />
          </View>
          <View
            style={{
              // backgroundColor: "yellow",
              width: 50,
              height: 200,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              // marginHorizontal: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 80,
                color: COLORS.primary,
              }}
            >
              :
            </Text>
          </View>
          <View
            style={{
              backgroundColor: COLORS.blue_bg,
              width: "40%",
              height: 200,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              // shadowColor: "#000",
              // shadowOffset: { width: 0, height: 2 },
              // shadowOpacity: 0.25,
              // shadowRadius: 3.84,
              // elevation: 10,
            }}
          >
            <TextInput
              style={{
                width: "80%",
                height: "80%",
                // backgroundColor: "yellow",
                textAlign: "center",
                fontSize: 100,
                textAlignVertical: "center",
                fontFamily: "Poppins-Bold",
                paddingTop: 20,
                color: COLORS.primary,
              }}
              maxLength={24}
              placeholderTextColor={COLORS.primary}
              keyboardType="number-pad"
              placeholder="00"
            />
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "yellow",
          width: "70%",
          height: 40,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            fontFamily: "Poppins-Medium",
            width: "30%",
            // backgroundColor: "blue",

            // alignItems: "center",
          }}
        ></View>
        <View
          style={{
            fontFamily: "Poppins-Medium",
            width: "30%",
            // backgroundColor: "green",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              color: COLORS.primary,
            }}
          >
            Pilih Hari
          </Text>
        </View>
        <TouchableOpacity
          style={{
            fontFamily: "Poppins-Medium",
            width: "30%",
            // backgroundColor: "green",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              color: "red",
              // backgroundColor: "yellow",
              paddingHorizontal: 5,
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 5,
              textAlignVertical: "center",
              textAlign: "center",
            }}
          >
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          height: 50,
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <TouchableOpacity style={styles.boxhari_blue}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: "Poppins-Medium",
            }}
          >
            M
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxhari_grey}>
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: "Poppins-Medium",
            }}
          >
            S
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxhari_blue}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: "Poppins-Medium",
            }}
          >
            S
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxhari_grey}>
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: "Poppins-Medium",
            }}
          >
            R
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxhari_blue}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: "Poppins-Medium",
            }}
          >
            K
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxhari_grey}>
          <Text
            style={{
              color: COLORS.primary,
              fontFamily: "Poppins-Medium",
            }}
          >
            J
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.boxhari_blue}>
          <Text
            style={{
              color: COLORS.white,
              fontFamily: "Poppins-Medium",
            }}
          >
            S
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{ backgroundColor: COLORS.primary, width: "80%", height: 1 }}
      ></View>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={() => navigation.navigate("AlarmScreen")}
      >
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
      {/* </ImageBackground> */}
    </View>
  );
};

export default TestScreen_2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    // paddingTop: "10%",
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
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: "80%",
    // position: "absolute",
    // bottom: 40,
    marginTop: 50,
  },
  btnText: {
    fontSize: width * 0.035,
    color: "white",
    fontFamily: "Poppins-SemiBold",
  },
});
