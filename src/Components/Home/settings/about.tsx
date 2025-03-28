// In App in a new project

import React, {useLayoutEffect, useContext, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';
// import { Helmet } from "react-helmet";
// import ReactGA from "react-ga4";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Styles from '../../../styles/css';

function About({navigation, props}) {
  const nav = useNavigation();
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

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
		// 	category: "App | About",
		// 	action: "App | About",
		// 	// label: "your label", // optional
		// 	// value: 99, // optional, must be a number
		// 	nonInteraction: true, // optional, true/false
		// 	// transport: "xhr", // optional, beacon/xhr/image
		//   });

	},[]);




  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      {/* <Helmet>
        <title>App | About</title>
      </Helmet> */}
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <ScrollView>
          <View style={[Styles.textWrapView]}>
            <Text
              style={[
                Styles.aboutText,
                Styles.singleFlex,
                {textAlign: 'justify'},
              ]}>
              Sourceable, an online platform and mobile application, empowers,
              connects, and supports citizen journalists in areas of conflict
              and crisis. Through strategic partnerships, Sourceable serves
              journalists, human rights professionals, and legal advocates by
              providing verified documentation in the forms of photos, videos,
              texts, and audio recordings.{'\n'}
              {'\n'}
              Leveraging cutting-edge verification technology, Sourceable will
              address the challenge of documenting, verifying, storing, and
              sharing newsworthy stories, focused on human rights violations,
              humanitarian crises, and human- interest stories, all in real-time
              to paid subscribers.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default About;
