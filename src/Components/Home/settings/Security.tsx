// In App in a new project

import React, {useLayoutEffect, useContext, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {useNavigation} from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Styles from '../../../styles/css';

function Security({navigation, props}) {
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

  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <ScrollView>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <AntDesign name={'shake'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Phone Shacking{'\n'}
              </Text>
              <Switch
                value={checked1}
                onValueChange={value => setChecked1(value)}
                color={'grey'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <MaterialCommunityIcons
                name={'radio-tower'}
                size={25}
                color={'black'}
              />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Hit the App{'\n'}
              </Text>
              <Switch
                value={checked2}
                onValueChange={value => setChecked2(value)}
                color={'grey'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Icon name={'eye-off-outline'} size={25} color={'black'} />
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Mask the App{'\n'}
              </Text>
              <Switch
                value={checked3}
                onValueChange={value => setChecked3(value)}
                color={'grey'}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

export default Security;
