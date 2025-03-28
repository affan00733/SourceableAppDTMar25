// In App in a new project

import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Divider, Switch} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import Styles from '../../../styles/css';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Display({navigation, props, route}) {
  const nav = useNavigation();
  const {image, fileName} = route.params;
  console.log('image:::::::', image);
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

  // useEffect(() => {
  //   const getFromLocal = async () => {
  //     const value = await AsyncStorage.getAllKeys();
  //     console.log('local Data Value : ', value);
  //   };
  //   getFromLocal();
  // }, []);

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
            alert('Please on the Location and try again!!!');
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
        alert('Please on the Location and try again!!!');
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
        alert('Please on the Location and try again!!!');
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
    const reference = await storage().ref(`incidents/camera/${fileName}`);
    await reference.putFile(image).then(() => {});
    await reference
      .getDownloadURL()
      .then(async url => {
        console.log('reffrence url', url);
        //encrypted code here
        const key = ConvertStringToHex('Sourceable');

        const CryptoJS = require('crypto-js');
        const encryptedImage = CryptoJS.AES.encrypt(url, key);

        await setLoading(false);

        await nav.navigate('UploadCloud', {
          cat: 'NA',
          url: encryptedImage.toString(),
          type: 'image',
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
          {console.log('new image', image)}
          <Image
            style={{borderWidth: 2, borderRadius: 40}}
            height={hp('70%')}
            resizeMode="stretch"
            source={{uri: image}}
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
                  localPath: image,
                  location: [
                    parseFloat(currentLongitude),
                    parseFloat(currentLatitude),
                  ],
                  date: timestamp,
                  datatype: 'image',
                };
                let jsonValue = JSON.stringify(value);
                await AsyncStorage.setItem('image_' + Date.now(), jsonValue);
                navigation.navigate('Start');
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Display;
