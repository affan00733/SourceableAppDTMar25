import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  PermissionsAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Input, Button, Divider, Switch} from '@rneui/themed';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import analytics from '@react-native-firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Styles from '../../../styles/css';
function TextIncident({navigation, props, route}) {
  const [incident, setIncitend] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  let watchID;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyticsCall = async () => {
      console.log('analyticsCall');
      await analytics().setUserId('Sourceable_APP_Text');
      await analytics().logEvent('Sourceable_APP_Text');

      await analytics().setAnalyticsCollectionEnabled(true);

      await analytics().logScreenView({
        screen_name: 'Sourceable APP Text',
        screen_class: 'Sourceable APP Text',
      });
      console.log('analyticsCall log');
    };
    return () => {
      analyticsCall();
    };
  }, []);

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
            navigation.navigate('Start');
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
        navigation.navigate('Start');
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
        navigation.navigate('Start');
        setLocationStatus(error.message);
      },
      {
        timeout: 20000,
      },
    );
  };
  const uploadToCloud = async () => {
    setLoading(true);
    console.log('incident::::', incident);
    await getOneTimeLocation();
    await subscribeLocationLocation();
    await navigation.navigate('UploadCloud', {
      cat: 'NA',
      url: incident,
      type: 'text',
      location: [parseFloat(currentLongitude), parseFloat(currentLatitude)],
      date: 'NA',
      privateID: 'NA',
      localUrl: 'NA',
    });
    setLoading(false);
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={{flex: 1}}></View>
          <View style={Styles.settingDivider}>
            <View style={{flex: 1}}>
              <View
                style={[
                  Styles.inputBox,
                  {height: hp('20%'), borderRadius: hp('3%')},
                ]}>
                <Input
                  placeholder="What do you want to tell us?"
                  multiline={true}
                  rightIcon={
                    incident === '' ? (
                      <MaterialIcons
                        name="error-outline"
                        size={30}
                        color="red"
                      />
                    ) : null
                  }
                  rightIconContainerStyle={{marginRight: hp('1.5%')}}
                  containerStyle={{marginLeft: hp('1.5%')}}
                  inputContainerStyle={{borderBottomWidth: 0}}
                  onChangeText={value => setIncitend(value)}
                />
              </View>
            </View>
            <View style={[Styles.authSubmit, {flex: 1}]}>
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
                onPress={() => uploadToCloud()}
                disabled={incident === ''}
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
                    localPath: incident,
                    location: [
                      parseFloat(currentLongitude),
                      parseFloat(currentLatitude),
                    ],
                    date: timestamp,
                    datatype: 'text',
                  };
                  let jsonValue = JSON.stringify(value);
                  await AsyncStorage.setItem('text_' + Date.now(), jsonValue);
                  navigation.navigate('camera');
                }}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

export default TextIncident;
