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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button, Input} from '@rneui/themed';
import { encrypt, decrypt, compare } from 'n-krypta';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin,isSuccessResponse} from '@react-native-google-signin/google-signin';
import Styles from '../../styles/css';
import auth from '@react-native-firebase/auth';

function SignIn({navigation}) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   configureGoogleSign();
  //   console.log("status",GoogleSignin.isSignedIn())
  // }, []);

  // function configureGoogleSign() {
  //   GoogleSignin.configure({
  //     webClientId: '510047313365-449ahrpks524s1h4akoh6sf31g0d9g3s.apps.googleusercontent.com',
  //     offlineAccess: false
  //   });
  // }

  function ConvertStringToHex(str) {
		var arr = [];
		for (var i = 0; i < str.length; i++) {
		  arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
		}
		return "\\u" + arr.join("\\u");
	}

	function decryptData(str) {
		const CryptoJS = require("crypto-js");
		const key = ConvertStringToHex("Sourceable");
	
		const decrypted = CryptoJS.AES.decrypt(str, key);
		console.log(decrypted);
	
		console.log(
		  "-----------------------------------------------------------------------"
		);
		var output = decrypted.toString(CryptoJS.enc.Utf8);
		console.log(output);
	
		return output;
	}

function encryptedData(str){
    const key = ConvertStringToHex('Sourceable');
    const CryptoJS = require('crypto-js');
    const encryptedAudio = CryptoJS.AES.encrypt(str, key);

    return encryptedAudio;
  }

  function encryptID(message){
    const key = ConvertStringToHex('Sourceable');

    const encryptedString = encrypt(message, key); // #Iblankartan!not!svreblankartwhfreblankartzpublankartase!gettiogblankartypvrblankartiofprmatipn,blankartcvtblankartgpoeblankarttopid.blankartI!oeedtblankartuoblankartspeodblankartspneblankarttjmfblankartlearoing!nore!osblankartundesstaoeing!mpre.blankartTiankt!for!eycelleotblankartiogoblankartI!wbsblankartlooling!gorblankartuhjsblankartinfpblankartfos!myblankartnitsion.#

    return encryptedString;
 
  };

	function decryptID(message){
		const key = ConvertStringToHex('Sourceable');
	
		const encryptedString = decrypt(message, key); // #Iblankartan!not!svreblankartwhfreblankartzpublankartase!gettiogblankartypvrblankartiofprmatipn,blankartcvtblankartgpoeblankarttopid.blankartI!oeedtblankartuoblankartspeodblankartspneblankarttjmfblankartlearoing!nore!osblankartundesstaoeing!mpre.blankartTiankt!for!eycelleotblankartiogoblankartI!wbsblankartlooling!gorblankartuhjsblankartinfpblankartfos!myblankartnitsion.#
	
		return encryptedString;
	 
	};

  
  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices();
    GoogleSignin.configure({
      webClientId: '491044162632-s0lujlcprhlkvgc3ghlb2muucek7n75b.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      offlineAccess: false
    });

    if (await GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
      await GoogleSignin.revokeAccess();
    }
    // Get the users ID token
    const response = await GoogleSignin.signIn();
    if (isSuccessResponse(response)) {
      console.log("Successfully logged in successfully.",response);
      let idToken = response.data.idToken;
      console.log("check 4",idToken);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    console.log("check 5");
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
    } else {
      // sign in was cancelled by user
    }
  }
  // async function signIn() {
  //   try {
  //     if (await GoogleSignin.isSignedIn()) {
  //       await GoogleSignin.signOut();
  //       await GoogleSignin.revokeAccess();
  //     }

  //     setError(null);
  //     setIsLoggedIn(true);

  //     await firestore()
  //       .collection('Account')
  //       .doc(email)
  //       .get()
  //       .then(async documentSnapshot => {
  //         console.log('User exists: ', documentSnapshot.exists);

  //         if (
  //           documentSnapshot.exists &&
  //           documentSnapshot.data().account_type === 'mobile'
  //         ) {
  //           console.log('User data: ', documentSnapshot.data());
  //           await GoogleSignin.hasPlayServices();
  //           const email = await (await GoogleSignin.signIn()).user.email;
  //           console.log(email);
  //           await navigation.navigate('Home');
  //         } else {
  //           alert('Enter correct email associated with APP Authentication');
  //         }
  //       });
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // when user cancels sign in process,
  //       console.log('Process Cancelled');
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // when in progress already
  //       console.log('Process in progress');
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // when play services not available
  //       console.log('Play services are not available');
  //     } else {
  //       // some other error
  //       console.log('Something else went wrong... ', error.toString());
  //       console.log('ERR', error);
  //       setError(error);
  //     }
  //   }
  // }

  // async function onGoogleButtonPress() {
  //   // Get the users ID token
  //   const { idToken } = await GoogleSignin.signIn();

  //   // Create a Google credential with the token
  //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  //   // Sign-in the user with the credential
  //   return auth().signInWithCredential(googleCredential);
  // }

  return (
    <View style={Styles.container}>
          <KeyboardAvoidingView
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
      <View style={Styles.main}>
        <View style={Styles.textWrapView}>
          <Text style={[Styles.titleOnboarding, Styles.singleFlex]}>
            Signup{' '}
          </Text>
        </View>
      </View>
      <View style={[Styles.threeFlex]}>
    
          <View style={[Styles.inputBox]}>
            <Input
              autoFocus={true}
              placeholder="Email"
              keyboardType="email-address"
              leftIcon={<Icon name="mail-unread" size={24} color="black" />}
              containerStyle={{marginLeft: hp('1.5%')}}
              inputContainerStyle={{borderBottomWidth: 0}}
              rightIcon={
                emailError ? (
                  <MaterialIcons name="error-outline" size={30} color="red" />
                ) : null
              }
              rightIconContainerStyle={{marginRight: hp('1.5%')}}
              onChangeText={value => {
                let re = /^[^\s@]+@[^\s@]+\.([^\s@]{2,})+$/;

                if (re.test(value)) {
                  // this is a valid email address
                  // call setState({email: email}) to update the email
                  // or update the data in redux store.
                  setEmailError(false);
                  setEmail(value);

                  console.log('valid');
                } else {
                  // invalid email, maybe show an error to the user.
                  setEmailError(true);

                  console.log('INvalid');
                }
              }}
            />
          </View>

        <ScrollView>
          <View style={[Styles.authSubmit]}>
            <Button
              title="Login "
              icon={
                <Icon name="arrow-forward-outline" size={24} color="white" />
              }
              iconRight
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              disabled={emailError}
              onPress={async () => {

                console.log(email, encryptID(email))
                await firestore()
                  .collection('Accounts')
                  .doc(encryptID(email))
                  .get()
                  .then(async documentSnapshot => {
                    console.log('User exists: ', documentSnapshot.exists);

                    console.log(decryptData(documentSnapshot.data().account_type).toString(),'********************', encryptID(email))

                    if (
                      documentSnapshot.exists &&
                      decryptData(documentSnapshot.data().account_type).toString() === "mobile"
                    ) {
                      console.log('User data: ', documentSnapshot.data());
                      await navigation.navigate('PinValidation', {
                        type: 'signin',
                        email: email,
                      });
                    } else {
                      alert(
                        'Enter correct email associated with APP Authentication',
                      );
                    }
                  });
              }}
            />
          </View>

          <View
            style={[
              Styles.authSubmit,
              {
                paddingTop: hp('3%'),
              },
            ]}>
            <Button
              title="Sign in with Google"
              icon={
                <Icon name="arrow-forward-outline" size={24} color="white" />
              }
              iconRight
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              onPress={() =>
                onGoogleButtonPress()
                  .then(async data => {
                    console.log('Signed in with Google!');
                    console.log(data);
                    await firestore()
                      .collection('Accounts')
                      .doc(encryptID(data.user.email))
                      .get()
                      .then(async documentSnapshot => {
                        console.log('User exists: ', documentSnapshot.exists);

                        if (
                          documentSnapshot.exists &&
                          documentSnapshot.data().account_type == encryptedData("mobile").toString()
                        ) {
                          console.log('User data: ', documentSnapshot.data());
                          alert(
                            'You have successfully logged in!',
                          );
                          await navigation.navigate('Home');
                        } else {
                          alert(
                            'Enter correct email associated with APP Authentication',
                          );
                        }
                      });
                  })
                  .catch(e => console.log('ERR', e))
              }
            />
          </View>
          <View style={Styles.authSubmit}>
            <View style={Styles.textWrapView}>
              <Text style={Styles.authFooter}>
                {'\n'} Don't have account,{' '}
                <Text
                  onPress={() => navigation.navigate('SignUp')}
                  style={Styles.footerAuthButton}>
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>

      </View>
      </KeyboardAvoidingView>

    </View>
  );
}

export default SignIn;
