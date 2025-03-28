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
} from 'react-native';
import Video from 'react-native-video';
import {WebView} from 'react-native-webview';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {Button, Overlay} from '@rneui/themed';
import {RadioButton} from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import Styles from '../../../styles/css';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
function Cloud({navigation, props, route}) {
  const {data, type, section} = route.params;
  const [checked, setChecked] = useState('Recognized');

  const [visible, setVisible] = useState(false);
  const [url, setUrl] = useState();
  const [text, setText] = useState();

  const [docID, setDocID] = useState();
  const [docType, setDocType] = useState();

  const [date, setDate] = useState();
  const [location, setLocation] = useState();

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

    // console.log(item);
    return (
      <>
        <TouchableOpacity
          {...props}
          onPress={async () => {
            toggleOverlay();
            await setUrl(decryptData(item.properties.file.url));
            await setText(decryptData(item.properties.text));
            let d = new Date(item.properties.created);
            await setDate(d.toGMTString());
            await setLocation(item.geometry.coordinates);
            await setDocID(item.key);
            await setDocType(item.properties.file.type);

            console.log('URL : ', decryptData(item.properties.file.url));
          }}
          style={Styles.galleryItem}>
          <View style={Styles.galleryItemText}>
            {console.log(item.properties.file.url)}
            {type === 'image' ? (
              <Image
                style={{borderWidth: hp('0.2%'), borderRadius: hp('2%')}}
                height={hp('15%')}
                width={wp('28%')}
                // resizeMode="contain"
                source={{uri: decryptData(item.properties.file.url)}}
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
  function deleteImage() {
    console.log(url);
    console.log(type);

    if (type == 'image') {
      const s1 = url.indexOf('camera%2F');
      const s2 = url.indexOf('.jpg');

      const fileName = url.substring(s1 + 'camera%2F'.length, s2);
      console.log('fileName', fileName);

      storage()
        .ref(`incidents/image/${fileName}.jpg`)
        .delete()
        .then(() => {
          console.log('Deleted From Stroage');
        })
        .catch(error => {
          console.log(error);
        });
    } else if (type == 'audio') {
      const s1 = url.indexOf('audio%2F');
      const s2 = url.indexOf('.wav');

      const fileName = url.substring(s1 + 'audio%2F'.length, s2);
      console.log('fileName', fileName);

      storage()
        .ref(`incidents/audio/${fileName}.wav`)
        .delete()
        .then(() => {
          console.log('Deleted From Stroage');
        })
        .catch(error => {
          console.log(error);
        });
    } else type == 'video';
    {
      const s1 = url.indexOf('video%2F');
      const s2 = url.indexOf('.mp4');

      const fileName = url.substring(s1 + 'video%2F'.length, s2);
      console.log('fileName', fileName);

      storage()
        .ref(`incidents/video/${fileName}.mp4`)
        .delete()
        .then(() => {
          console.log('Deleted From Stroage');
        })
        .catch(error => {
          console.log(error);
        });
    }

    firestore()
      .collection('Explore')
      .doc(docID)
      .delete()
      .then(() => {
        console.log('Data Deleted');
        navigation.navigate('Home');
      });
  }

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
        {type === 'text' ? (
          //decryption text
          <Text style={styles.textSecondary}>{`${text}`}</Text>
        ) : (
          //decryption url
          <>
            <WebView source={{uri: url}} />
            <Text style={styles.textSecondary}>{`${text}`}</Text>
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
        </View>

        {/* {section === 'private' ? (
          <View>
            <Text style={[styles.textSecondary, {fontWeight: 'bold'}]}>
              Please check on which way you want to make it public
            </Text>

            <TouchableOpacity onPress={() => setChecked('Recognized')}>
              <View
                style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
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
                style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
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
