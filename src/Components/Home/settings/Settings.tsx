// In App in a new project

import React, {useLayoutEffect, useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Divider, Switch} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Styles from '../../../styles/css';

function Settings({navigation, props, user}) {
  const nav = useNavigation();
  const [checked, setChecked] = useState(false);
  const [userData, setUserData] = useState();
  async function onAuthStateChanged(userInfo) {
    // setUser(user);
    if (userInfo != null) {
      setUserData(userInfo.email);
      console.log('user in settings in effect', userData);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useLayoutEffect(() => {
    console.log('user in settings', user);

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

  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <ScrollView>
          <TouchableOpacity onPress={() => nav.navigate('Home')}>
            <View style={Styles.textWrapView}>
              <Icon name={'thumbs-up-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Best Practices{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('Security')}>
            <View style={Styles.textWrapView}>
              <Icon name={'shield-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Security Features{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <Divider width={2} />
          <TouchableOpacity onPress={() => nav.navigate('Language')}>
            <View style={[Styles.textWrapView, {marginTop: hp('2%')}]}>
              <Icon name={'language-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Language{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Icon name={'moon-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Dark Mode{'\n'}
              </Text>
              <Switch
                value={checked}
                onValueChange={value => setChecked(value)}
                color={'grey'}
              />
            </View>
          </TouchableOpacity>
          <Divider width={2} />
          <TouchableOpacity onPress={() => nav.navigate('About')}>
            <View style={[Styles.textWrapView, {marginTop: hp('2%')}]}>
              <Icon
                name={'information-circle-outline'}
                size={25}
                color={'black'}
              />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                About App{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('Contact')}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Icon name={'ios-call-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Contact Us{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Icon name={'share-social-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Share App{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Icon name={'star-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Feedback{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
          <Divider width={2} />
          <TouchableOpacity
            onPress={async () => {
              // await firestore()
              //   .collection('Account')
              //   .doc(userData)
              //   .update({
              //     status: firestore.FieldValue.serverTimestamp(),
              //   })
              //   .then(async () => {
                  await auth()
                    .signOut()
                    .then(() => {
                      nav.navigate('Start');
                      console.log('User signed out!');
                    });
                // });
            }}>
            <View style={[Styles.textWrapView, {marginTop: hp('2%')}]}>
              <Icon
                name={'log-out'}
                size={25}
                color={'black'}
              />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Logout{'\n'}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

export default Settings;
