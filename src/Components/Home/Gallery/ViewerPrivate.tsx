import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import {WebView} from 'react-native-webview';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Button, Overlay} from '@rneui/themed';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Styles from '../../../styles/css';
import RNFS from 'react-native-fs';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
function Cloud({navigation, props, route}) {
  const {data, type, section} = route.params;
  console.log('data:::', data);
  const [checked, setChecked] = useState('Recognized');

  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState();
  const [text, setText] = useState();

  const [docID, setDocID] = useState();
  const [docType, setDocType] = useState();

  const [date, setDate] = useState();
  const [privateID, setPrivateID] = useState();

  const [location, setLocation] = useState();
  const [loading, setLoading] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };
  useEffect(() => {
    async function getData() {
      console.log('Viewer', data);
    }

    getData();
  }, []);
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
  const data1 = [
    {
      key: 'A',
      icon: 'images-outline',
      icon2: 'shield-checkmark-outline',
      type: 1,
    },
    {key: 'B', icon: 'mic-outline', icon2: 'lock', type: 1},
    {
      key: 'C',
      icon: 'videocam-outline',
      icon2: 'eye-off-outline',
      type: 1,
    },
    {
      key: 'D',
      icon: 'text-fields',
      icon2: 'shield-checkmark-outline',
      type: 2,
    },
    {
      key: 'E',
      icon: 'videocam-outline',
      icon2: 'eye-off-outline',
      type: 1,
    },
    {
      key: 'F',
      icon: 'images-outline',
      icon2: 'shield-checkmark-outline',
      type: 1,
    },
    {key: 'G', icon: 'mic-outline', icon2: 'lock', type: 1},
  ];

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }

    return data;
  };
  function getReverseGeocodingData(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({latLng: latlng}, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK) {
        alert(status);
      }
      // This is checking to see if the Geoeode Status is OK before proceeding
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(results);
        var address = results[0].formatted_address;
      }
    });
  }
  const updateData = async () => {
    console.log('updated');
    let timestamp = Date();
    firestore()
      .collection('Explore')
      .doc(docID)
      .update({
        'properties.created': timestamp,
        'properties.cloud_status': checked,
      })
      .then(() => {
        navigation.navigate('Home');
        console.log('User updated!');
      });
  };
  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[Styles.galleryItem, Styles.galleryItemInvisible]} />;
    }
    console.log('item::::', JSON.parse(item[1]));
    return (
      <>
        <TouchableOpacity
          {...props}
          onPress={async () => {
            toggleOverlay();
            await setUrl(JSON.parse(item[1]).localPath);
            await setDate(JSON.parse(item[1]).date);
            await setLocation(JSON.parse(item[1]).location);
            await setPrivateID(item[0]);
            await setDocType(JSON.parse(item[1]).datatype);
            await setText(JSON.parse(item[1]).localPath);
            // console.log('URL : ', decryptData(item.properties.file.url));
          }}
          style={Styles.galleryItem}>
          <View style={Styles.galleryItemText}>
            {/* {console.log(item.properties.file.url)} */}
            {type === 'image' ? (
              <Image
                style={{borderWidth: hp('0.2%'), borderRadius: hp('2%')}}
                height={hp('15%')}
                width={wp('28%')}
                // resizeMode="contain"
                // source={{uri: decryptData(item.properties.file.url)}}
                source={{uri: 'file://' + JSON.parse(item[1]).localPath}}
              />
            ) : type === 'audio' ? (
              <Icon name={'mic-outline'} size={45} color={'black'} />
            ) : type === 'video' ? (
              <Icon name={'videocam-outline'} size={45} color={'black'} />
            ) : (
              <MaterialIcons name={'text-fields'} size={45} color={'black'} />
            )}
          </View>
        </TouchableOpacity>
        <View styles={Styles.headerView}></View>
      </>
    );
  };
  const numColumns = 3;

  function ConvertStringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + arr.join('\\u');
  }

  function decryptData(str) {
    console.log('encrypted text------------------------->', str);
    const CryptoJS = require('crypto-js');
    const key = ConvertStringToHex('Sourceable');
    const decrypted = CryptoJS.AES.decrypt(str, key);

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    return plaintext;
  }
  deleteImage = async () => {
    // privateID
    await AsyncStorage.removeItem(privateID);
    navigation.navigate('Home');
  };

  const uploadToCloud = async () => {
    setLoading(true);

    let min = Math.ceil(0);
    let max = Math.floor(100000000);
    let rand = Math.floor(Math.random() * (max - min + 1)) + min;
    let timestamp = Date.now();
    console.log('docType', docType);
    if (docType == 'image') {
      let fileName = rand + `_${timestamp}.jpg`;
      let reference = await storage().ref(`incidents/camera/${fileName}`);
      await reference.putFile(url).then(() => {});
      await reference
        .getDownloadURL()
        .then(async urlFirebase => {
          console.log('reffrence url', urlFirebase);

          const key = ConvertStringToHex('Sourceable');
          const CryptoJS = require('crypto-js');
          const encryptedImage = CryptoJS.AES.encrypt(urlFirebase, key);

          await setLoading(false);
          await toggleOverlay();
          await navigation.navigate('UploadCloud', {
            cat: 'private',
            url: encryptedImage.toString(),
            type: 'image',
            location: [parseFloat(location[0]), parseFloat(location[1])],
            date: date,
            privateID: privateID,
            localUrl: url,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (docType == 'video') {
      let fileName = rand + `_${timestamp}`;
      let reference = await storage().ref(`incidents/video/${fileName}`);
      await reference.putFile(url, {contentType: 'video/mp4'}).then(() => {});
      await reference
        .getDownloadURL()
        .then(async urlFirebase => {
          console.log('reffrence url', urlFirebase);

          const key = ConvertStringToHex('Sourceable');
          const CryptoJS = require('crypto-js');
          const encryptedImage = CryptoJS.AES.encrypt(urlFirebase, key);

          await setLoading(false);
          await toggleOverlay();
          await navigation.navigate('UploadCloud', {
            cat: 'private',
            url: encryptedImage.toString(),
            type: 'video',
            location: [parseFloat(location[0]), parseFloat(location[1])],
            date: date,
            privateID: privateID,
            localUrl: url,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (docType == 'audio') {
      let fileName = rand + `_${timestamp}.wav`;
      let reference = await storage().ref(`incidents/audio/${fileName}`);
      await reference.putFile(url).then(() => {});
      await reference
        .getDownloadURL()
        .then(async urlFirebase => {
          console.log('reffrence url', urlFirebase);

          const key = ConvertStringToHex('Sourceable');
          const CryptoJS = require('crypto-js');
          const encryptedImage = CryptoJS.AES.encrypt(urlFirebase, key);

          await setLoading(false);
          await toggleOverlay();
          await navigation.navigate('UploadCloud', {
            cat: 'private',
            url: encryptedImage.toString(),
            type: 'audio',
            location: [parseFloat(location[0]), parseFloat(location[1])],
            date: date,
            privateID: privateID,
            localUrl: url,
          });
        })
        .catch(error => {
          console.log(error);
        });
    }

    if (docType == 'text') {
      await setLoading(false);
      await toggleOverlay();
      await navigation.navigate('UploadCloud', {
        cat: 'private',
        url: text,
        type: 'text',
        location: [parseFloat(location[0]), parseFloat(location[1])],
        date: date,
        privateID: privateID,
        localUrl: url,
      });
    }
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
          <FlatList
            data={formatData(data, numColumns)}
            style={Styles.galleryContainer}
            renderItem={renderItem}
            numColumns={numColumns}
          />
        </View>

        <Overlay
          fullScreen={false}
          backdropStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            shadowOpacity: 0,
          }}
          overlayStyle={{
            height: type === 'text' ? null : hp('85%'),
            marginTop: 'auto',
            borderColor: 'white',
            width: '100%',
            borderRadius: 20,
            borderWidth: 2,
          }}
          isVisible={visible}
          onBackdropPress={toggleOverlay}>
          {console.log('location::::', location)}
          {type === 'text' ? (
            //decryption text
            <Text style={styles.textSecondary}>{`${text}`}</Text>
          ) : (
            //decryption url
            <>
              <WebView
                style={{flex: 1}}
                // useWebKit={true}
                source={{uri: url}}
                // startInLoadingState={true}
                // scrollEnabled={true}
                // javaScriptEnabled={true}
                // domStorageEnabled={true}
                originWhitelist={['file://']}
                allowFileAccess={true}
                allowUniversalAccessFromFileURLs={true}
              />
              {/* <Text style={styles.textSecondary}>{`${text}`}</Text> */}
            </>
          )}

          <Text style={styles.textSecondary}>{`${date}`}</Text>

          <View style={[Styles.authSubmit, {justifyContent: 'flex-end'}]}>
            <Button
              title=" Delete"
              icon={<Icon name="trash-outline" size={24} color="white" />}
              iconLeft
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
                marginBottom: wp('5%'),
              }}
              onPress={() => deleteImage()}
            />

            <Button
              title=" Upload to Cloud"
              icon={
                <Icon name="cloud-upload-outline" size={24} color="white" />
              }
              iconLeft
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
                marginBottom: wp('5%'),
              }}
              onPress={() => uploadToCloud()}
            />
          </View>
          {/* {section === 'private' ? (
            <View>
              <Text style={[styles.textSecondary, {fontWeight: 'bold'}]}>
                Please check on which way you want to make it public
              </Text>

              <TouchableOpacity onPress={() => setChecked('Recognized')}>
                <View
                  style={[
                    Styles.textWrapView,
                    {justifyContent: 'space-around'},
                  ]}>
                  <Icon
                    name={'shield-checkmark-outline'}
                    size={30}
                    color={'black'}
                  />
                  <Text style={[Styles.settingText, Styles.singleFlex]}>
                    Recognized{'\n'}
                  </Text>
                  <RadioButton
                    value="Recognized"
                    color="black"
                    status={checked === 'Recognized' ? 'checked' : 'unchecked'}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setChecked('Anonymously')}>
                <View
                  style={[
                    Styles.textWrapView,
                    {justifyContent: 'space-around'},
                  ]}>
                  <Icon name={'eye-off-outline'} size={30} color={'black'} />

                  <Text style={[Styles.settingText, Styles.singleFlex]}>
                    Anonymously{'\n'}
                  </Text>
                  <RadioButton
                    value="Anonymously"
                    color="black"
                    status={checked === 'Anonymously' ? 'checked' : 'unchecked'}
                  />
                </View>
              </TouchableOpacity>
              <View style={[Styles.authSubmit, {}]}>
                <Button
                  title="  Update to Cloud"
                  icon={
                    <Icon name="cloud-upload-outline" size={24} color="white" />
                  }
                  iconLeft
                  buttonStyle={Styles.buttonStyleAuth}
                  containerStyle={{
                    width: wp('50%'),
                  }}
                  onPress={async () => updateData()}
                />
              </View>
            </View>
          ) : (
            <View></View>
          )} */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              top: -50,
              bottom: 0,
              marginRight: 5,
            }}
            onPress={toggleOverlay}>
            <View>
              <Icon name="close" style={{}} size={30} />
            </View>
          </TouchableOpacity>
        </Overlay>
      </View>
    );
  }
}

export default Cloud;
const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
    color: 'black',
    marginTop: 10,
  },
  backgroundVideo: {
    // position: 're',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: hp('50%'),
  },
});
