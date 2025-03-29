import React, {
  useRef,
  useLayoutEffect,
  useContext,
  useState,
  useEffect,
} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  ToastAndroid,
  Platform,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

import RNFS from 'react-native-fs';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import MovToMp4 from 'react-native-mov-to-mp4';

import analytics from '@react-native-firebase/analytics';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Slider from '@react-native-community/slider';

let options = {
  mediaType: 'video',
  title: 'Select video',
  customButtons: [
    {name: 'customOptionKey', title: 'Choose video from Custom Option'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  includeExtra: true,
};

export default function CustomCamera() {
  const nav = useNavigation();
  const [pressed, setPressed] = useState(false);
  const camera = useRef(null);
const [isConfiguring, setIsConfiguring] = useState(false);

  const [cameraType, setCameraType] = useState('back'); // 'back' or 'front'
  const device = useCameraDevice(cameraType);
  console.log('devices', device);
  const [hasPermission, setHasPermission] = useState(true);
  const [flash, setFlash] = useState('off'); // 'off', 'on', or 'auto' for photo flash mode
  const [zoom, setZoom] = useState(1);

  // Request camera permission on mount
  useEffect(() => {
    Camera.requestCameraPermission().then(status => {
      console.log('status check', status);
      console.log('hasPermission check', hasPermission);
      // setHasPermission(status === 'granted');
    });
    Camera.requestMicrophonePermission().then(status => {
      console.log('status check', status);
      console.log('hasPermission microphone check', hasPermission);
      // setHasPermission(status === 'granted');
    });
  }, []);

  useEffect(() => {
  return () => {
    try {
      if (camera.current) {
        // stop recording safely
        camera.current.stopRecording();
      }
    } catch (e) {
      console.warn('Error during camera cleanup', e);
    }
  };
}, []);

  useEffect(() => {
    const analyticsCall = async () => {
      console.log('analyticsCall');
      await analytics().setUserId('Sourceable_APP_Video');
      await analytics().logEvent('Sourceable_APP_Video');

      await analytics().setAnalyticsCollectionEnabled(true);

      await analytics().logScreenView({
        screen_name: 'Sourceable APP Video',
        screen_class: 'Sourceable APP Video',
      });
      console.log('analyticsCall log');
    };
    return () => {
      analyticsCall();
    };
  }, []);

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
    let timestamp_gal = await resp.assets[0].timestamp;
    let image_date = 0;
    if (timestamp_gal != null) {
      image_date = new Date(timestamp_gal.slice(0, 10)).getTime();
    }

    console.log('timestamp2', image_date);

    let past_two_day_date = new Date();
    past_two_day_date.setDate(past_two_day_date.getDate() - 2);
    past_two_day_date = past_two_day_date.getTime();
    console.log('timestamp3', past_two_day_date);

    if (image_date >= past_two_day_date) {
      const filePath = resp.assets[0].uri;
      console.log('response........', JSON.stringify(filePath));

      let min = Math.ceil(0);
      let max = Math.floor(100000000);
      let rand = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log(rand);
      let timestamp = Date.now();
      console.log('timestamp', timestamp);

      Platform.OS === 'ios'
        ? await MovToMp4.convertMovToMp4(filePath, rand + `_${timestamp}`).then(
            async function (results) {
              //here you can upload the video...
              console.log('results.........', results);
              await nav.navigate('DisplayVideo', {
                video: results,
                fileName: rand + `_${timestamp}`,
              });
            },
          )
        : await nav.navigate('DisplayVideo', {
            video: filePath,
            fileName: rand + `_${timestamp}`,
          });
    } else {
      alert('Video should be at max 2 days old');
    }
  };

  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  // Example zoom controls: zoom in, zoom out (simple step zoom)
  const zoomIn = () => {
    if (device?.maxZoom) {
      setZoom(z => Math.min(z + 1, device.maxZoom)); // increment zoom, up to maxZoom
    } else {
      setZoom(z => Math.min(z + 1, 10)); // if maxZoom not available, cap at 10x
    }
  };
  const zoomOut = () => {
    setZoom(z => Math.max(z - 1, 1)); // decrement zoom, down to 1x (no zoom)
  };

const toggleCamera = async () => {
  if (isConfiguring) return;
  setIsConfiguring(true);
  setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  setTimeout(() => setIsConfiguring(false), 500); // buffer
};

  const startRecordingHandle = async () => {
    try {
      setPressed(true);
      const data_check = await camera.current.startRecording({
        onRecordingFinished: async(video) => {
          console.log(video);
          let data = video.path;
          console.log('Here we got----------------', data);
          let min = Math.ceil(0);
          let max = Math.floor(100000000);
          let rand = Math.floor(Math.random() * (max - min + 1)) + min;
          console.log(rand);
          const filePath = data;
          let timestamp = Date.now();

          console.log('filePath', filePath);
          Platform.OS === 'ios'
            ? await MovToMp4.convertMovToMp4(
                filePath,
                rand + `_${timestamp}`,
              ).then(async function (results) {
                //here you can upload the video...
                console.log('results', results);
                await nav.navigate('DisplayVideo', {
                  video: results,
                  fileName: rand + `_${timestamp}`,
                });
              })
            : await nav.navigate('DisplayVideo', {
                video: filePath,
                fileName: rand + `_${timestamp}`,
              });
        },
        onRecordingError: error1_start => console.log("error start",error1_start),
      });
    } catch (error_start) {
      nav.navigate('Start');

      console.log("error before start",error_start);
    }
  };
  const StopRecordingHandle = async () => {
    try {
      if (!camera.current || isConfiguring) return;
      setPressed(false);
      const data = await camera.current.stopRecording()
        .then(d => {
          console.log("checked stop",d);
        })
        .catch(error_stop => {
          console.log("checked stop err",error_stop);
        });
      // console.warn(data);
      // console.log('----------------', data);
    } catch (error) {
      console.log("checked stop error before",error);
    }
  };
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.preview}
        device={device}
        isActive={true}
        video={true}
        audio={true} // <-- optional
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
              onPress={zoomOut}>
              <MaterialIcons
                style={{alignItems: 'center', marginBottom: 10}}
                name={'zoom-out'}
                size={30}
                color={'black'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {!pressed ? (
          <View
          style={{
            bottom: hp('15%'),
            right: hp('17%'),
            position: 'absolute',
          }}>
          <TouchableOpacity
            onPress={() => startRecordingHandle()}>
            <Icon name={'aperture'} size={hp('8%')} color={'white'} />
          </TouchableOpacity>
            </View>
        ) : (
          <View
          style={{
            bottom: hp('15%'),
            right: hp('17%'),
            position: 'absolute',
          }}>
          <TouchableOpacity
            onPress={() => StopRecordingHandle()}>
            <Icon name={'aperture'} size={hp('8%')} color={'red'} />
          </TouchableOpacity>
          </View>
        )}

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
