// In App in a new project

import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { encrypt, decrypt, compare } from 'n-krypta';
// import { GoogleSigninButton, GoogleSignin as Gsignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { GoogleSignin,isSuccessResponse } from '@react-native-google-signin/google-signin';
// var CryptoJs = require('crypto-js')
import firestore from '@react-native-firebase/firestore';
import {Button, Input} from '@rneui/themed';
// import { Helmet } from "react-helmet";
// import ReactGA from "react-ga4";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Styles from '../../styles/css';
function Signup({navigation}) {
  const windowHeight = Dimensions.get('window').height;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  function ConvertStringToHex(str) {
    var arr = [];
    for (var i = 0; i < str.length; i++) {
           arr[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return "\\u" + arr.join("\\u");
  }

  useEffect(()=>{
		// ReactGA.pageview("window.location.pathname + window.location.search")
		// ReactGA.send({ hitType: "pageview", page: "/explore" });
		// ReactGA.event({
		// 	category: "App | Signup",
		// 	action: "App | Signup",
		// 	// label: "your label", // optional
		// 	// value: 99, // optional, must be a number
		// 	nonInteraction: true, // optional, true/false
		// 	// transport: "xhr", // optional, beacon/xhr/image
		//   });

	},[]);

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
  
  useEffect(() => {
    // configureGoogleSign();
        const CryptoJS = require("crypto-js");

        const key = ConvertStringToHex("Sourceable");

        // console.log('-----------------------------------------------------------------------');

        // const encrypted = CryptoJS.AES.encrypt("hey", "Pallavi");
        // console.log(encrypted);
        // console.log('-----------------------------------------------------------------------');
        // console.log('Firebase String : ',encrypted.toString());
        
        const decrypted = CryptoJS.AES.decrypt('U2FsdGVkX19pTAlEQGJY5hYSWMo2r3/E+9Pqwk8WoG4HeRmI9INJ5+uT/VX3DXhK', key);
        console.log(decrypted);
        
        console.log('-----------------------------------------------------------------------');
        var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        console.log(plaintext);
        console.log('-----------------------------------------------------------------------');

  }, []);
  
  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId: '491044162632-s0lujlcprhlkvgc3ghlb2muucek7n75b.apps.googleusercontent.com',
      offlineAccess: false
    });
  }
  async function onGoogleButtonPress() {
    console.log("check 1");
    await GoogleSignin.hasPlayServices();
    GoogleSignin.configure({
      webClientId: '491044162632-s0lujlcprhlkvgc3ghlb2muucek7n75b.apps.googleusercontent.com',
        scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
      offlineAccess: false
    });
console.log("check 2");
    if (await GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut()
      await GoogleSignin.revokeAccess();
      }

    console.log("check 3");
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
// async function register() {
//   try {
//     await Gsignin.hasPlayServices();
//     const email = await (await Gsignin.signIn()).user.email;
//     const name = await (await Gsignin.signIn()).user.givenName;
//     console.log(email);
//     console.log(name);
//     setEmail(email);
//     setName(name);
//     setError(null);
//     setIsLoggedIn(true);

//     await firestore()
//           .collection('Account')
//           .doc(email)
//           .set({
//             email: email,
//             name: name,
//             account_type: 'mobile',
//             status: 'online',
//           })
//           .then(() => {
//             console.log('User added!');
//             navigation.navigate('Home');
//           }); 

//   } catch (error) {
//     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//       // when user cancels sign in process,
//       alert('Process Cancelled');
//     } else if (error.code === statusCodes.IN_PROGRESS) {
//       // when in progress already
//       alert('Process in progress');
//     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//       // when play services not available
//       alert('Play services are not available');
//     } else {
//       // some other error
//       alert('Something else went wrong... ', error.toString());
//       console.log(error);
//       setError(error);
//     }
//   }
// }

  return (
   
      <View style={Styles.container}>
         <KeyboardAvoidingView
    // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}      
  >

        <View style={Styles.main}>
          <View style={Styles.textWrapView}>
            <Text style={[Styles.titleOnboarding, Styles.singleFlex]}>
              Sign Up
            </Text>
          </View>
        </View>
        <View style={[Styles.threeFlex]}>
      
          <View style={[Styles.inputBox]}>
            <Input
              // autoFocus={true}
              placeholder="User Name"
              leftIcon={<Icon name="people-sharp" size={24} color="black" />}
              rightIcon={
                name === '' ? (
                  <MaterialIcons name="error-outline" size={30} color="red" />
                ) : null
              }
              rightIconContainerStyle={{marginRight: hp('1.5%')}}
              containerStyle={{marginLeft: hp('1.5%')}}
              inputContainerStyle={{borderBottomWidth: 0}}
              onChangeText={value => setName(value)}
            />
          </View>
          <View style={[Styles.inputBox]}>
            <Input
              autoFocus={true}
              placeholder="Email"
              type="email"
              keyboardType="email-address"
              leftIcon={<Icon name="mail-unread" size={24} color="black" />}
              rightIcon={
                emailError ? (
                  <MaterialIcons name="error-outline" size={30} color="red" />
                ) : null
              }
              rightIconContainerStyle={{marginRight: hp('1.5%')}}
              containerStyle={{marginLeft: hp('1.5%')}}
              inputContainerStyle={{borderBottomWidth: 0}}
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
              title="Sign Up "
              icon={
                <Icon name="arrow-forward-outline" size={24} color="white" />
              }
              iconRight
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              disabled={emailError || name === ''}
              onPress={
                () =>
                  navigation.navigate('PinValidation', {
                    type: 'signup',
                    name: name,
                    email: email,
                  })
                // alert(name)
              }
            />
          </View>
          
          <View style={[Styles.authSubmit,{
            paddingTop : hp('3%')
          }]}>
            <Button
              title="Sign up with Google"
              icon={
                <Icon name="arrow-forward-outline" size={24} color="white" />
              }
              iconRight
              iconContainerStyle={{marginLeft: 50}}
              buttonStyle={Styles.buttonStyleAuth}
              containerStyle={{
                width: wp('50%'),
              }}
              onPress={() => onGoogleButtonPress()
                .then(async(data) => {
                  console.log('Signed in with Google!')
                  console.log(data);
                  await firestore()
                            .collection('Accounts')
                            .doc(encryptID(data.user.email))
                            .set({
                              email: encryptedData(data.user.email).toString(),
                              name: encryptedData(data.user.displayName).toString(),
                              account_type: encryptedData("mobile").toString(),
                              status: encryptedData("online").toString(),
                            })
                            .then(() => {
                              console.log('User added!');
                              alert(
                                'You have successfully signed up!',
                              );
                              navigation.navigate('Home');
                            });
                })
                .catch(e => console.log('ERR', e))
              }

            />
          </View>
          <View style={Styles.authSubmit}>
            <View style={Styles.textWrapView}>
              <Text style={Styles.authFooter}>
                {'\n'} Have Account ?{' '}
                <Text
                  onPress={() => navigation.navigate('SignIn')}
                  style={Styles.footerAuthButton}>
                  Login
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

export default Signup;
