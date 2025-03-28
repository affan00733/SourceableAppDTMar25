// In App in a new project

import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Styles from '../../../styles/css';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Draft from './Draft';
import Cloud from './Cloud';
import { Helmet } from "react-helmet";
// import ReactGA from "react-ga4";
import analytics from '@react-native-firebase/analytics';


const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  useEffect(() => {
    // ReactGA.pageview("window.location.pathname + window.location.search")
    // ReactGA.send({ hitType: "pageview", page: "/explore" });
    // ReactGA.event({
    // 	category: "App | Home",
    // 	action: "App | Home",
    // 	// label: "your label", // optional
    // 	// value: 99, // optional, must be a number
    // 	nonInteraction: true, // optional, true/false
    // 	// transport: "xhr", // optional, beacon/xhr/image
    //   });

    const analyticsCall = async () => {
      console.log('analyticsCall');
      await analytics().setUserId('Sourceable_APP_My_POSTS');
      await analytics().logEvent('Sourceable_APP_My_POSTS');

      await analytics().setAnalyticsCollectionEnabled(true);

      await analytics().logScreenView({
        screen_name: 'Sourceable APP My_POSTS',
        screen_class: 'Sourceable APP My_POSTS ',
      });
      console.log('analyticsCall log');
    };  
    return () => {
      analyticsCall();
    };
  }, []);

  return (
    
    <Tab.Navigator
    
      screenOptions={{
        
        showIcon: true,
        tabBarStyle: Styles.topTab,
        tabBarIndicatorStyle: Styles.topTabBar,
        // tabBarShowIcon: true,
        tabBarLabelStyle: {marginTop: hp('-1.5%')},
      }}>
        {/* <Helmet>
        <title>App | Gallery</title>
      </Helmet> */}
      <Tab.Screen
        name="Cloud"
        component={Cloud}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon
                style={{color: 'black', marginTop: hp('-1%')}}
                name="cloud-upload-outline"
                size={20}
              />
            ) : (
              <Icon
                style={{color: 'grey', marginTop: hp('-1%')}}
                name="cloud-upload-outline"
                size={20}
              />
            ),
        }}
      />
      <Tab.Screen
        name="Private"
        component={Draft}
        options={{
          tabBarIcon: ({focused}) =>
            focused ? (
              <MaterialCommunityIcons
                style={{color: 'black', marginTop: hp('-1%')}}
                name="clipboard-text-multiple-outline"
                size={20}
              />
            ) : (
              <MaterialCommunityIcons
                style={{color: 'grey', marginTop: hp('-1%')}}
                name="clipboard-text-multiple-outline"
                size={20}
              />
            ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;
