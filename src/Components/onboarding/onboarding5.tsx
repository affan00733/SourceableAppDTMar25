// In App in a new project

import * as React from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from '@rneui/themed';

import Styles from '../../styles/css';
function Onboarding({navigation}) {
  return (
    <View style={Styles.container}>
      <View style={Styles.main}>
        <View style={Styles.textWrapView}>
          <Text style={[Styles.titleOnboarding, Styles.singleFlex]}>
            Onboarding {'\n'} Tutorial 5 of 6
          </Text>
        </View>
      </View>
      <View style={Styles.textWrapView}>
        <Text style={[Styles.onboardingTitle, Styles.singleFlex]}>
          5. Make your footage at least 15 seconds long
        </Text>
      </View>
      <View style={Styles.textWrapView}>
        <Text style={Styles.onboardingDescription}>
          {'\n'} The longer the merrier!
        </Text>
      </View>
      <View
        style={[Styles.main, Styles.threeFlex, {justifyContent: 'flex-end'}]}>
        <Icon name="ellipsis-horizontal-sharp" size={30} color="#4F8EF7" />
      </View>
      <View style={[Styles.onboardingButton]}>
        <Button
          onPress={() => navigation.navigate('SignUp')}
          title="Skip"
          type="clear"
          containerStyle={{
            alignSelf: 'flex-start',
          }}
          titleStyle={{color: 'grey'}}
        />
        <Button
          onPress={() => navigation.navigate('Onboarding6')}
          title="Next"
          type="clear"
          titleStyle={{color: 'grey'}}
        />
      </View>
    </View>
  );
}

export default Onboarding;
