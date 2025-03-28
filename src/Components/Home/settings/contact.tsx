// In App in a new project

import React, {useLayoutEffect, useContext, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RadioButton} from 'react-native-paper';
import {Input, Button, Divider, Switch} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
// import { Helmet } from "react-helmet";
// import ReactGA from "react-ga4";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Styles from '../../../styles/css';

function Contact({navigation, props}) {
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

  useEffect(()=>{
		// ReactGA.pageview("window.location.pathname + window.location.search")
		// ReactGA.send({ hitType: "pageview", page: "/explore" });
		// ReactGA.event({
		// 	category: "App | Contact",
		// 	action: "App | Contact",
		// 	// label: "your label", // optional
		// 	// value: 99, // optional, must be a number
		// 	nonInteraction: true, // optional, true/false
		// 	// transport: "xhr", // optional, beacon/xhr/image
		//   });

	},[]);

  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      {/* <Helmet>
        <title>App | Contact</title>
      </Helmet> */}
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <ScrollView>
          <View style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
            <Text style={[Styles.contactText, Styles.singleFlex]}>
              Please feel free to talk to us if you have any questions, we
              endeavour to answer within 24 hours.{'\n'}
            </Text>
          </View>
          <View style={[Styles.inputBox]}>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              containerStyle={{marginLeft: hp('1.5%')}}
              inputContainerStyle={{borderBottomWidth: 0}}
            />
          </View>
          <View
            style={[
              Styles.inputBox,
              {height: hp('30%'), borderRadius: hp('3%')},
            ]}>
            <Input
              placeholder="Message"
              multiline={true}
              containerStyle={{marginLeft: hp('1.5%')}}
              inputContainerStyle={{borderBottomWidth: 0}}
            />
          </View>
          <View style={[Styles.authSubmit]}>
            <Button
              title="  Login"
              icon={<Icon name="ios-send-outline" size={24} color="white" />}
              iconLeft
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              onPress={() => navigation.navigate('ContactGreet')}
            />
            <Button
              title="Cancel"
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
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default Contact;
