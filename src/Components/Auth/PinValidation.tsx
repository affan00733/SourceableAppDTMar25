// In App in a new project

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button, Input} from '@rneui/themed';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Styles from '../../styles/css';
function PinValidation({route, navigation}) {
  const {type, name, email} = route.params;
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(true);

  const home = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert(
          'You have successfully logged in!',
        );
        navigation.navigate('Home');

        console.log('User account signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/wrong-password') {
          alert('Invalid password try again');
        }

        console.error(error);
      });
    console.log('user signin', password, email);
  };
  const termAndCondition = () => {
    navigation.navigate('TermNcondition', {
      name: name,
      email: email,
      password: password,
    });
  };
  return (
   
      <View style={Styles.container}>
         <KeyboardAvoidingView
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
        <View style={Styles.main}>
          <View style={Styles.textWrapView}>
            <Text style={[Styles.titleOnboarding, Styles.singleFlex]}>
              Enter Pin
            </Text>
          </View>
        </View>
        <View style={{flex: 4}}>
       
          <View style={[Styles.inputBox]}>
            <Input
              autoFocus={true}
              placeholder="Enter Passcode ......"
              secureTextEntry={true}
              // keyboardType="phone-pad"
              leftIcon={<Icon name="keypad" size={24} color="black" />}
              rightIcon={
                passwordError ? (
                  <MaterialIcons name="error-outline" size={30} color="red" />
                ) : null
              }
              rightIconContainerStyle={{marginRight: hp('1.5%')}}
              containerStyle={{marginLeft: hp('1.5%')}}
              inputContainerStyle={{borderBottomWidth: 0}}
              onChangeText={value => {
                /*
                 * password validation, should contain:
                 * (?=.*\d): at least one digit
                 * (?=.*[a-z]): at least one lower case
                 * (?=.*[A-Z]): at least one uppercase case
                 * [0-9a-zA-Z]{6,}: at least 6 from the mentioned characters
                 */
                let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@]{6,}$/;

                if (re.test(value)) {
                  // this is a valid email address
                  // call setState({email: email}) to update the email
                  // or update the data in redux store.
                  setPassword(value);
                  setPasswordError(false);
                  console.log('valid');
                } else {
                  setPasswordError(true);

                  // invalid email, maybe show an error to the user.
                  console.log('INvalid');
                }
              }}
            />
          </View>
          <ScrollView>
          <View style={Styles.textWrapView}>
            <Text style={[Styles.onboardingTitle, Styles.singleFlex,{paddingBottom:hp('2%')}]}>
            password to be valid by - Capital letter/Small letter/number/Special character/minimum length
            </Text>
          </View>
          <View style={[Styles.authSubmit]}>
            <Button
              title="Continue "
              icon={
                <Icon name="arrow-forward-outline" size={24} color="white" />
              }
              iconRight
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              disabled={passwordError}
              onPress={() => {
                type == 'signin' ? home() : termAndCondition();
              }}
            />
          </View>
          </ScrollView>
        </View>
        </KeyboardAvoidingView>

      </View>
  );
}

export default PinValidation;
