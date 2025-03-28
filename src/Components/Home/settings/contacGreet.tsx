// In App in a new project

import React, {useLayoutEffect, useContext, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RadioButton} from 'react-native-paper';
import {Input, Button, Divider, Switch} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Styles from '../../../styles/css';

function Language({navigation, props}) {
  const nav = useNavigation();
  const [checked, setChecked] = React.useState('english');

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

  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <View style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
          <Icon
            name="ios-checkmark-done-circle-sharp"
            size={hp('38%')}
            color="grey"
          />
        </View>
        <View style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
          <Text
            style={[
              Styles.contactText,
              Styles.singleFlex,
              {textAlign: 'justify', fontSize: hp('2%')},
            ]}>
            Your message was sent! we endeavour to answer within 24 hours.
            {'\n\n'}
          </Text>
        </View>

        <View style={[Styles.authSubmit]}>
          <Button
            title="Home Page  "
            icon={<Icon name="home-outline" size={24} color="white" />}
            iconRight
            iconContainerStyle={{marginLeft: 50}}
            titleStyle={{fontSize: hp('2%')}}
            buttonStyle={[Styles.buttonStyleAuth, {height: hp('7%')}]}
            containerStyle={{
              width: wp('50%'),
            }}
            onPress={() => navigation.navigate('Home')}
          />
        </View>
      </View>
    </View>
  );
}

export default Language;
