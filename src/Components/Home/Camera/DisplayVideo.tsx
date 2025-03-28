// In App in a new project

import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {WebView} from 'react-native-webview';

import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Divider, Switch} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Video from 'react-native-video';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import Styles from '../../../styles/css';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DisplayVideo({navigation, props, route}) {
  const nav = useNavigation();
  const {video, fileName} = route.params;

  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  let watchID;

  function ConvertStringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + arr.join('\\u');
  }

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            await getOneTimeLocation();
            await subscribeLocationLocation();
          } else {
            alert(
              '1. Please turn on your device location to proceed.\n2. Please provide access to your camera to proceed.',
            );
            nav.navigate('Start');
            setLocationStatus('Permission Denied');
          }
          console.log(locationStatus);
        } catch (err) {
          console.warn('err', err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);

  const getOneTimeLocation = async () => {
    setLocationStatus('Getting Location ...');
    await Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {
        alert(
          '1. Please turn on your device location to proceed.\n2. Please provide access to your camera to proceed.',
        );
        nav.navigate('Start');
        setLocationStatus(error.message);
      },
      {
        timeout: 20000,
      },
    );
  };

  const subscribeLocationLocation = async () => {
    watchID = await Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);

        console.log('location', currentLongitude, currentLatitude);
      },
      error => {
        alert(
          '1. Please turn on your device location to proceed.\n2. Please provide access to your camera to proceed.',
        );
        nav.navigate('Start');
        setLocationStatus(error.message);
      },
      {
        timeout: 20000,
      },
    );
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          {...props}
          style={Styles.headerBtn}
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon name={'chevron-back-outline'} size={30} color={'black'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  const uploadToCloud = async () => {
    setLoading(true);
    await getOneTimeLocation();
    await subscribeLocationLocation();
    const reference = await storage().ref(`incidents/video/${fileName}`);
    await reference.putFile(video, {contentType: 'video/mp4'}).then(() => {});
    await reference
      .getDownloadURL()
      .then(async url => {
        console.log('reffrence url', url);
        //encrypted code here
        const key = ConvertStringToHex('Sourceable');
        const CryptoJS = require('crypto-js');
        const encryptedVideo = CryptoJS.AES.encrypt(url, key);

        await setLoading(false);
        await nav.navigate('UploadCloud', {
          cat: 'NA',
          url: encryptedVideo.toString(),
          type: 'video',
          location: [parseFloat(currentLongitude), parseFloat(currentLatitude)],
          date: 'NA',
          privateID: 'NA',
          localUrl: 'NA',
        });
      })
      .catch(error => {
        console.log(error);
      });

    //
    //
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', height: 100}}>
        <ActivityIndicator size={100} color="blue" />
      </View>
    );
  } else {
    return (
      <View style={[{backgroundColor: 'white', flex: 1}]}>
        <View style={{flex: 1}}></View>
        <View style={Styles.settingDivider}>
          <Video
            source={{uri: 'file://' + video}}
            style={styles.backgroundVideo}
            height={hp('65%')}
            resizeMode="contain"
            controls={true}
          />
          <View
            style={[Styles.authSubmit, {flex: 3, justifyContent: 'flex-end'}]}>
            <Button
              title="  Upload to Cloud"
              icon={
                <Icon name="cloud-upload-outline" size={24} color="white" />
              }
              iconLeft
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              onPress={() => {
                uploadToCloud();
              }}
            />
            <Button
              title="Not Now"
              buttonStyle={{
                borderColor: 'grey',
                borderRadius: wp('100%'),
                borderWidth: hp('0.2%'),
              }}
              containerStyle={{
                width: wp('50%'),
                marginTop: hp('2%'),
              }}
              titleStyle={{color: 'grey'}}
              type="outline"
              onPress={async () => {
                await getOneTimeLocation();
                await subscribeLocationLocation();
                let timestamp = Date();
                let value = {
                  localPath: video,
                  location: [
                    parseFloat(currentLongitude),
                    parseFloat(currentLatitude),
                  ],
                  date: timestamp,
                  datatype: 'video',
                };
                let jsonValue = JSON.stringify(value);
                await AsyncStorage.setItem('video_' + Date.now(), jsonValue);
                navigation.navigate('Start');
              }}
            />
          </View>
          {/* <Image
          style={{height: hp('50%'), borderWidth: 2, borderRadius: 40}}
          height={hp('50%')}
          source={{uri: 'file://' + image}}
        /> */}
        </View>
      </View>
    );
  }
}

export default DisplayVideo;

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
