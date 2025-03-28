// In App in a new project

import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RadioButton} from 'react-native-paper';
import {Button, Divider, Switch, Input} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Slider from '@react-native-community/slider';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Styles from '../../../styles/css';
import CheckBox from '@react-native-community/checkbox';
// import CheckboxGroup from 'react-native-checkbox-group'

function UploadCloud({navigation, props, route}) {
  const nav = useNavigation();
  const [text, setText] = useState('');

  const [checked, setChecked] = useState('Recognized');
  const [data, setSliderData] = useState(1);

  const [user, setUser] = useState();
  const [initializing, setInitializing] = useState(true);

  const {cat, url, type, location, date, privateID,localUrl} = route.params;

  const [cat1, setCat1] = useState(false);
  const [cat2, setCat2] = useState(false);
  const [cat3, setCat3] = useState(false);
  const [cat4, setCat4] = useState(false);
  const [cat5, setCat5] = useState(false);
  const [cat6, setCat6] = useState(false);
  const [cat7, setCat7] = useState(false);

  categories = [
    {type: 'Bombing', checked: false},
    {type: 'Protest', checked: false},
    {type: 'Fire', checked: false},
    {type: 'Conflict', checked: false},
    {type: 'Environmental Hazard', checked: false},
    {type: 'Human interest story', checked: false},
    {type: 'Msc (App & Website)', checked: false},
  ];

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

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user.email);
    console.log('user', user.email);
    if (user == null) {
      navigation.navigate('Home');
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  function ConvertStringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
      arr[i] = ('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return '\\u' + arr.join('\\u');
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  //   useEffect(() => {
  //     async function getLocation() {

  //     }

  //     getLocation();
  //   }, []);

  const addData = async () => {
    console.log('submit');
    console.log(location, type, url);

    categories[0].checked = cat1;
    categories[1].checked = cat2;
    categories[2].checked = cat3;
    categories[3].checked = cat4;
    categories[4].checked = cat5;
    categories[5].checked = cat6;
    categories[6].checked = cat7;

    console.log(categories);
    const verfiedcategories = categories.reduce((op, {type, checked}) => {
      if (checked) op.push(type);
      return op;
    }, []);

    console.log(verfiedcategories);
    let timestamp = Date();
    let textData = type == 'text' ? url : text;
    let urlData = type == 'text' ? 'NA' : url;

    //encrypted code here
    const key = ConvertStringToHex('Sourceable');
    // console.log('Key is here --------------------------------------->', key);
    const CryptoJS = require('crypto-js');
    const encryptedText = CryptoJS.AES.encrypt(textData, key);
    // console.log(
    //   'encryptedText is here --------------------------------------->',
    //   encryptedText.toString(),
    // );

    if (cat =="private") {
      timestamp = date
    }
    
    await firestore()
      .collection('Explore')
      .add({
        geometry: {coordinates: location},
        properties: {
          created: timestamp,
          text: encryptedText.toString(),
          file: {type: type, url: urlData},
          incident_type: data,
          verified: false,
          user: user,
          cloud_status: checked,
          categories: verfiedcategories,
        },
      })
      .then(async () => {
        console.log('Explore added!');
        let exists = await RNFS.exists(localUrl);
        if (exists) {
          // exists call delete
          console.log('image to be deleted', localUrl);
          await RNFS.unlink(localUrl);
        }
        await AsyncStorage.removeItem(privateID);

        await nav.navigate('Start');
      });
  };

  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <ScrollView>
          <Text
            style={[
              Styles.settingText,
              Styles.singleFlex,
              {fontWeight: 'bold'},
            ]}>
            Upload to cloud as:{'\n'}
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
          <TouchableOpacity onPress={() => setChecked('Private')}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <EvilIcons name={'lock'} size={40} color={'black'} />

              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Private{'\n'}
              </Text>
              <RadioButton
                value="Private"
                color="black"
                status={checked === 'Private' ? 'checked' : 'unchecked'}
              />
            </View>
          </TouchableOpacity>
          <Text
            style={[
              Styles.settingText,
              Styles.singleFlex,
              {fontWeight: 'bold'},
            ]}>
            {'\n'}Select the severity of incident: {data}
            {'\n'}
            {'\n'}
          </Text>
          <Slider
            maximumValue={5}
            minimumValue={1}
            minimumTrackTintColor="#D50000"
            maximumTrackTintColor="#01579B"
            step={1}
            value={data}
            onValueChange={sliderValue => setSliderData(sliderValue)}
            thumbTintColor="#1B5E20"
            // style={{width: 400, height: 40}}
          />

          {type == 'text' ? (
            <></>
          ) : (
            <View style={[Styles.inputBox, {marginTop: hp('2%')}]}>
              <Input
                placeholder="Give some info about the incident ?"
                rightIcon={
                  text === '' ? (
                    <MaterialIcons name="error-outline" size={30} color="red" />
                  ) : null
                }
                rightIconContainerStyle={{marginRight: hp('1.5%')}}
                containerStyle={{marginLeft: hp('1.5%')}}
                inputContainerStyle={{borderBottomWidth: 0}}
                onChangeText={value => setText(value)}
              />
            </View>
          )}

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat1}
              boxType={'square'}
              onValueChange={newValue => {
                setCat1(newValue);
                console.log(categories[0].type, cat1);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[0].type}
            </Text>
          </View>

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat2}
              boxType={'square'}
              onValueChange={newValue => {
                setCat2(newValue);
                console.log(categories[1].type, cat2);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[1].type}
            </Text>
          </View>

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat3}
              boxType={'square'}
              onValueChange={newValue => {
                setCat3(newValue);
                console.log(categories[2].type, cat3);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[2].type}
            </Text>
          </View>

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat4}
              boxType={'square'}
              onValueChange={newValue => {
                setCat4(newValue);
                console.log(categories[3].type, cat4);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[3].type}
            </Text>
          </View>

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat5}
              boxType={'square'}
              onValueChange={newValue => {
                setCat5(newValue);
                console.log(categories[4].type, cat5);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[4].type}
            </Text>
          </View>

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat6}
              boxType={'square'}
              onValueChange={newValue => {
                setCat6(newValue);
                console.log(categories[5].type, cat6);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[5].type}
            </Text>
          </View>

          <View
            style={[
              Styles.textWrapView,
              {justifyContent: 'space-around', marginTop: hp('1%')},
            ]}>
            <CheckBox
              value={cat7}
              boxType={'square'}
              onValueChange={newValue => {
                setCat7(newValue);
                console.log(categories[6].type, cat7);
              }}
            />
            <Text
              style={[
                Styles.settingText,
                Styles.singleFlex,
                {marginTop: hp('1%')},
              ]}>
              {categories[6].type}
            </Text>
          </View>
          {/* <FlatList
            data={categories}
            renderItem={({index, item}) => {
              return (
                <View
                  style={[
                    Styles.textWrapView,
                    {justifyContent: 'space-around', marginTop: hp('1%')},
                  ]}>
                  <CheckBox
                    value={item.checked}
                    // boxType={'square'}
                    onValueChange={newValue => {
                      let temp = categories;
                      temp[index].checked = newValue;
                      setcategories(temp);
                      console.log(categories);
                    }}
                  />
                  <Text
                    style={[
                      Styles.settingText,
                      Styles.singleFlex,
                      {marginTop: hp('1%')},
                    ]}>
                    {item.type}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item, index) => index}
            extraData={ca}
          /> */}

          <View style={[Styles.authSubmit, {flex: 1}]}>
            <Button
              title="Submit"
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              onPress={async () => addData()}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default UploadCloud;
