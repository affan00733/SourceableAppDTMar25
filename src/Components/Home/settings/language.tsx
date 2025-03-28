// In App in a new project

import React, {useLayoutEffect, useContext, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RadioButton} from 'react-native-paper';
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
        <ScrollView>
          <TouchableOpacity>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                English{'\n'}
              </Text>
              <RadioButton
                value="english"
                color="black"
                status={checked === 'english' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('english')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Arabic{'\n'}
              </Text>
              <RadioButton
                value="arabic"
                color="black"
                status={checked === 'arabic' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('arabic')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Mandarian{'\n'}
              </Text>
              <RadioButton
                value="mandarian"
                color="black"
                status={checked === 'mandarian' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('mandarian')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View
              style={[Styles.textWrapView, {justifyContent: 'space-around'}]}>
              <Text style={[Styles.settingText, Styles.singleFlex]}>
                Spanish{'\n'}
              </Text>
              <RadioButton
                value="spanish"
                color="black"
                status={checked === 'spanish' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('spanish')}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

export default Language;
