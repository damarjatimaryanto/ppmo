import 'react-native-gesture-handler';
import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  StatusBar,
} from 'react-native';
const COLORS = {primary: '#1E319D', white: '#FFFFFF'};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  backAction = () => {
    Alert.alert('', 'Apakah anda yakin ingin keluar dari aplikasi ?', [
      {
        text: 'cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'yes',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  componentDidMount() {
    this.BackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  componentWillUnmount() {
    this.BackHandler = BackHandler.removeEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.white} />
        <View style={styles.header}>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: COLORS.primary,
              fontSize: 16,
            }}>
            Hi, Selamat Pagi
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              color: COLORS.primary,
              fontSize: 20,
            }}>
            Damarjati Maryanto
          </Text>
        </View>
        <View style={styles.menu}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              // backgroundColor: 'grey',
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
              }}>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}>
                  <Image
                    style={styles.menuicon}
                    source={require('./../assets/img/icon/track_record.png')}></Image>
                </TouchableOpacity>
                <Text style={styles.tombol_text}>Track Record</Text>
              </View>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
                <Text style={styles.tombol_text}>Fase</Text>
              </View>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
                <Text style={styles.tombol_text}>Fase</Text>
              </View>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
                <Text style={styles.tombol_text}>Alarm</Text>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
          <Text>Track Record</Text> */}
        </View>

        <View style={styles.menu}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              // backgroundColor: 'grey',
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: '100%',
              }}>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}>
                  <Image
                    style={styles.menuicon}
                    source={require('./../assets/img/icon/track_record.png')}></Image>
                </TouchableOpacity>
                <Text style={styles.tombol_text}>Track Record</Text>
              </View>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
                <Text style={styles.tombol_text}>Fase</Text>
              </View>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
                <Text style={styles.tombol_text}>Fase</Text>
              </View>
              <View style={styles.kotakmenu}>
                <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
                <Text style={styles.tombol_text}>Alarm</Text>
              </View>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.tombol1}></TouchableOpacity>
          <Text>Track Record</Text> */}
        </View>
      </View>
    );
  }
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    backgroundColor: '#FFFFFF',
    // justifyContent: 'center',
    fontFamily: 'Poppins-Regular',
  },
  header: {
    // backgroundColor: 'grey',
    marginHorizontal: '2%',
    height: '25%',
    justifyContent: 'center',
    fontFamily: 'Poppins-Regular',
  },
  selamat: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  nama: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  menu: {
    // backgroundColor: 'blue',
    // height: '20%',
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    marginHorizontal: '5%',
    // justifyContent: 'space-between',
  },
  kotakmenu: {
    // backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tombol1: {
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    shadowColor: '#171717',
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 5,
    // elevation: 8,
  },
  tombol2: {
    borderRadius: 10,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#171717',
    // shadowOffset: {width: 0, height: 3},
    // shadowOpacity: 0.6,
    // shadowRadius: 5,
    // elevation: 8,
  },
  tombol_text: {
    textAlign: 'center',
    // top: 10,
    // fontWeight: '500',
    fontSize: 13,
    color: COLORS.primary,
    fontFamily: 'Poppins-Regular',
  },
  menuicon: {
    width: '70%',
    height: '70%',
  },
});
