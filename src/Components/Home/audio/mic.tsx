import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {Buffer} from 'buffer';
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import storage from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import Geolocation from '@react-native-community/geolocation';
import Styles from '../../../styles/css';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Divider, Switch} from '@rneui/themed';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import analytics from '@react-native-firebase/analytics';

function Mic({navigation, props, route}) {
  let sound = null;
  const [audioFile, setAudioFile] = useState('');
  const [recording, setRecording] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [paused, setPaused] = useState(true);

  const [currentLongitude, setCurrentLongitude] = useState('...');
  const [currentLatitude, setCurrentLatitude] = useState('...');
  const [locationStatus, setLocationStatus] = useState('');
  let watchID;
  const [loading, setLoading] = useState(false);

  const options = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    wavFile: 'test.wav',
  };

  useEffect(() => {
    const analyticsCall = async () => {
      console.log('analyticsCall');
      await analytics().setUserId('Sourceable_APP_Audio');
      await analytics().logEvent('Sourceable_APP_Audio');

      await analytics().setAnalyticsCollectionEnabled(true);

      await analytics().logScreenView({
        screen_name: 'Sourceable APP Audio',
        screen_class: 'Sourceable APP Audio',
      });
      console.log('analyticsCall log');
    };
    return () => {
      analyticsCall();
    };
  }, []);

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
  useEffect(() => {
    async function calledFun() {
      await checkPermission();

      AudioRecord.init(options);

      AudioRecord.on('data', data => {
        const chunk = Buffer.from(data, 'base64');
        console.log('chunk size', chunk.byteLength);
      });
    }

    calledFun();
  }, []);

  const checkPermission = async () => {
    const p = await Permissions.check('microphone');
    console.log('permission check', p);
    if (p === 'authorized') return;
    return requestPermission();
  };

  const requestPermission = async () => {
    const p = await Permissions.request('microphone');
    console.log('permission request', p);
  };

  const start = async () => {
    console.log('start record');
    setAudioFile('');
    setRecording(true);
    setLoaded(false);
    AudioRecord.start();
  };

  const stop = async () => {
    if (!recording) return;
    console.log('stop record');
    let au = await AudioRecord.stop();
    console.log('au', au);
    await setAudioFile(au);
    console.log('audioFilestate', audioFile);
    await setRecording(false);
  };

  const play = async () => {
    console.log('audioFilestate', audioFile);

    setPaused(false);
    Sound.setCategory('Playback');

    sound = new Sound(audioFile, '', error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log(
        'duration in seconds: ' +
          sound.getDuration() +
          'number of channels: ' +
          sound.getNumberOfChannels(),
      );

      // Play the sound with an onEnd callback
      sound.play(success => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
        setPaused(true);
      });
    });

    setLoaded(sound);
  };

  const pause = async () => {
    loaded.pause();
    setPaused(true);
  };

  const uploadToCloud = async () => {
    setLoading(true);
    await getOneTimeLocation();
    await subscribeLocationLocation();
    let min = Math.ceil(0);
    let max = Math.floor(100000000);
    let rand = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(rand);
    let timestamp = Date.now();
    console.log('timestamp', timestamp);
    const filePath = 'file:///' + audioFile;
    // const newFilePath = RNFS.ExternalDirectoryPath + rand + `_${timestamp}.wav`;
    // RNFS.moveFile(filePath, newFilePath)
    //   .then(async () => {
    //     console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    const reference = await storage().ref(
      `incidents/audio/${rand}_${timestamp}.wav`,
    );
    await reference.putFile(filePath).then(() => {});
    await reference
      .getDownloadURL()
      .then(async url => {
        console.log('reffrence url', url);
        //encrypted code here
        const key = ConvertStringToHex('Sourceable');
        const CryptoJS = require('crypto-js');
        const encryptedAudio = CryptoJS.AES.encrypt(url, key);

        await setLoading(false);
        await navigation.navigate('UploadCloud', {
          cat: 'NA',
          url: encryptedAudio.toString(),
          type: 'audio',
          location: [parseFloat(currentLongitude), parseFloat(currentLatitude)],
          date: 'NA',
          privateID: 'NA',
          localUrl: 'NA',
        });
      })
      .catch(error => {
        console.log(error);
      });
    await setLoading(false);
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', height: 100}}>
        <ActivityIndicator size={100} color="blue" />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <View style={{flex: 2}}></View>
        <View style={styles.row}>
          <View
            style={[
              Styles.authSubmit,
              {flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'},
            ]}>
            <Button
              icon={
                <Icon name="radio-button-on-sharp" size={30} color="white" />
              }
              iconLeft
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              onPress={() => start()}
              disabled={recording}
            />
            <Button
              icon={<Icon name="stop-circle" size={30} color="white" />}
              iconLeft
              buttonStyle={Styles.buttonStyleAuth}
              titleStyle={{color: 'grey'}}
              onPress={() => stop()}
              disabled={!recording}
            />
            {paused ? (
              <Button
                icon={<Icon name="play-sharp" size={30} color="white" />}
                iconLeft
                buttonStyle={Styles.buttonStyleAuth}
                titleStyle={{color: 'grey'}}
                onPress={() => play(() => {})}
                disabled={!audioFile}
              />
            ) : (
              <Button
                icon={<Icon name="reload-outline" size={30} color="white" />}
                iconLeft
                buttonStyle={Styles.buttonStyleAuth}
                titleStyle={{color: 'grey'}}
                onPress={() => pause()}
                disabled={!audioFile}
              />
            )}
          </View>
        </View>
        <View
          style={[Styles.authSubmit, {flex: 1, justifyContent: 'flex-end'}]}>
          <Button
            title="  Upload to Cloud"
            icon={<Icon name="cloud-upload-outline" size={30} color="white" />}
            iconLeft
            iconContainerStyle={{marginLeft: 50}}
            buttonStyle={Styles.buttonStyleAuth}
            containerStyle={{
              width: wp('50%'),
            }}
            disabled={!audioFile}
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
                localPath: 'file:///' + audioFile,
                location: [
                  parseFloat(currentLongitude),
                  parseFloat(currentLatitude),
                ],
                date: timestamp,
                datatype: 'audio',
              };
              let jsonValue = JSON.stringify(value);
              await AsyncStorage.setItem('audio_' + Date.now(), jsonValue);
              navigation.navigate('camera');
            }}
          />
        </View>
        <View style={{flex: 1}}></View>
      </View>
    );
  }
}

export default Mic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
