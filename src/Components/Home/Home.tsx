import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  ToastAndroid,Pressable
} from 'react-native';
// import {RNCamera} from 'react-native-camera';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
// import {useCamera, useZoom} from 'react-native-camera-hooks';
import CustomButton from './CustomButton';
import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import analytics from '@react-native-firebase/analytics';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Slider from '@react-native-community/slider';

let options = {
  mediaType: 'photo',
  title: 'Select Image',
  customButtons: [
    {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  includeExtra: true,
};

export default function CustomCamera({navigation}) {

  const camera = useRef(null);
const [cameraType, setCameraType] = useState('back'); // 'back' or 'front'
const device = useCameraDevice(cameraType);
console.log("devices",device);
  // const device = devices.back;  // use the back camera device (you can add a toggle for front/back)

  const [hasPermission, setHasPermission] = useState(true);
  const [flash, setFlash] = useState('off');       // 'off', 'on', or 'auto' for photo flash mode
  const [zoom, setZoom] = useState(1);             // zoom factor (1 = no zoom)
  // (White balance not supported in VisionCamera – it will use auto WB by default)

  // Request camera permission on mount
  useEffect(() => {

    Camera.requestCameraPermission().then(status => {
      console.log("status check", status)
      console.log("hasPermission check", hasPermission)
      // setHasPermission(status === 'granted');
    });
  }, []);


  const nav = useNavigation();

  const captureHandle = async () => {
    try {
      const data = await camera.current.takePhoto({ flash });
      console.log('data captured at: ', data.path);
      let min = Math.ceil(0);
      let max = Math.floor(100000000);
      let rand = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log(rand);
      const filePath = data.path;
      let timestamp = Date.now();
      console.log('timestamp', timestamp);
      // const newFilePath =
      //   RNFS.DocumentDirectoryPath + '/' + rand + `_${timestamp}.jpg`;
      // console.log('newFilePath', RNFS.DocumentDirectoryPath);
      // RNFS.moveFile(filePath, newFilePath)
      //   .then(async () => {
      //     console.log('IMAGE MOVED', filePath, '-- to --', newFilePath);
      //     await nav.navigate('DisplayImage', {
      //       image: newFilePath,
      //       fileName: rand + `_${timestamp}.jpg`,
      //     });
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });

      console.log('filePath::::', filePath);
      await nav.navigate('DisplayImage', {
        image: filePath,
        fileName: rand + `_${timestamp}.jpg`,
      });
      console.log('filePath', filePath);
    } catch (error) {
      navigation.navigate('Start');
      console.log('ERR', error);
    }
  };

  useEffect(() => {
    const analyticsCall = async () => {
      console.log('analyticsCall');
      await analytics().setUserId('Sourceable_APP_Camera');
      await analytics().logEvent('Sourceable_APP_Camera');

      await analytics().setAnalyticsCollectionEnabled(true);

      await analytics().logScreenView({
        screen_name: 'Sourceable APP Camera',
        screen_class: 'Sourceable APP Camera',
      });
      console.log('analyticsCall log');
    };
    return () => {
      analyticsCall();
    };
  }, []);

  const onCapturePhoto = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto({ flash });
        // `photo` is an object with path (temporary file), width, height, etc.
        console.log('Photo captured at: ', photo.path);
        // You can now display the photo or save it to gallery using CameraRoll or similar.
      } catch (e) {
        console.error('Failed to take photo:', e);
      }
    }
  };

  // Handler for tap-to-focus (using Pressable overlay)
  const onFocusTap = async (event) => {
    if (camera.current && event.nativeEvent) {
      try {
        // Get tap coordinates relative to the Camera view
        const { locationX, locationY } = event.nativeEvent;
        await camera.current.focus({ x: locationX, y: locationY });
      } catch (e) {
        console.warn('Focus failed (device may not support tap-to-focus):', e);
      }
    }
  };

  const GalleryHandle = async () => {
    const resp = await launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = {uri: response.uri};
      }
    });

    console.log('timestamp', resp.assets[0].timestamp);
    let timestamp_gal = await resp.assets[0].timestamp
    let image_date = 0 
    if (timestamp_gal != null) {
      image_date = new Date(timestamp_gal.slice(0, 10)).getTime();
    }
    console.log('timestamp2', image_date);

    let past_two_day_date = new Date();
    past_two_day_date.setDate(past_two_day_date.getDate() - 2);
    past_two_day_date = past_two_day_date.getTime();
    console.log('timestamp3', past_two_day_date);

    if (image_date >= past_two_day_date) {
      console.log('MATCHDE');
      const filePath = resp.assets[0].uri;
      console.log('response........', JSON.stringify(filePath));
      let min = Math.ceil(0);
      let max = Math.floor(100000000);
      let rand = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log(rand);
      let timestamp = Date.now();
      console.log('timestamp', timestamp);
      await nav.navigate('DisplayImage', {
        image: filePath,
        fileName: rand + `_${timestamp}.jpg`,
      });
      console.log('filePath', filePath);
    }

    else{
      alert("Image should be at max 2 days old")
    }
  };

   // Toggle flash mode (between off and on for simplicity; you could include 'auto' as well)
  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  // Example zoom controls: zoom in, zoom out (simple step zoom)
  const zoomIn = () => {
    if (device?.maxZoom) {
      setZoom(z => Math.min(z + 1, device.maxZoom));  // increment zoom, up to maxZoom
    } else {
      setZoom(z => Math.min(z + 1, 10));  // if maxZoom not available, cap at 10x
    }
  };
  const zoomOut = () => {
    setZoom(z => Math.max(z - 1, 1));  // decrement zoom, down to 1x (no zoom)
  };

  const toggleCamera = () => {
  setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
};

  if (device == null) {
    // Camera device is not yet loaded or available
    return <Text>Loading camera...</Text>;
  }

  return (
  <View style={styles.container}>
          {/* Camera preview */}
          <Camera
            ref={camera}
            style={styles.preview}
            device={device}
            isActive={true}
            photo={true}
            zoom={zoom}
            enableZoomGesture={true}
            torch={flash === 'on' ? 'on' : 'off'}
          />

        <View
          style={{
            width: wp('15%'),
            backgroundColor: '#E5EAED',
            borderRadius: hp('1.5%'),
            top: hp('6%'),
            right: hp('1.5%'),
            position: 'absolute',
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
          }}>
          <View style={{alignItems: 'center', marginBottom: 10}}>
            <TouchableOpacity
              onPress={() => {
                ToastAndroid.showWithGravityAndOffset(
                  `3 Second Timer`,
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  25,
                  hp('75%'),
                );
                setTimeout(async function () {
                  await captureHandle();
                }, 2500);
              }}>
              <Icon
                style={{
                  alignItems: 'center',
                  marginBottom: 10,
                  marginTop: 10,
                }}
                name={'timer-outline'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                await toggleFlash();
              }}>
              <Icon
                style={{alignItems: 'center', marginBottom: 10}}
                name={'flash'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => toggleCamera()}>
              <Icon
                style={{alignItems: 'center', marginBottom: 10}}
                name={'camera-reverse-outline'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={zoomIn}>
              <MaterialIcons
                style={{alignItems: 'center', marginBottom: 10}}
                name={'zoom-in'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={() => {
              //   console.log(zoom);
              //   if (zoom > 0.01) {
              //     setZoom(zoom - 0.01);
              //   } else {
              //     setZoom(0);
              //   }
              // }}
            onPress={zoomOut}
            >
              <MaterialIcons
                style={{alignItems: 'center', marginBottom: 10}}
                name={'zoom-out'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
          </View>
        </View>
<View
          style={{
            bottom: hp('18%'),
            right: hp('17%'),
            position: 'absolute',
          }}>
        <TouchableOpacity
          onPress={() => captureHandle()}>
          <Icon name={'aperture-sharp'} size={hp('8%')} color={'white'} />
        </TouchableOpacity>
        </View>

        <View
          style={{
            bottom: hp('15%'),
            right: hp('4%'),
            position: 'absolute',
          }}>
          <TouchableOpacity onPress={() => GalleryHandle()}>
            <Icon name={'images'} size={hp('6%')} color={'white'} />
          </TouchableOpacity>
        </View>

        </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1},
   preview: {
    flex: 1,
    // alignItems: 'left',
    justifyContent: 'flex-end',
  },


  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'grey',
    opacity: 0.4,
  },
});
