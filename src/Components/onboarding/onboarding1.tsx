// In App in a new project

import React, {useState, useEffect} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from '@rneui/themed';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { encrypt, decrypt, compare } from 'n-krypta';
// Icon.loadFont().then();

import Styles from '../../styles/css';
function Onboarding({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

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

  // Handle user state changes
  async function onAuthStateChanged(user) {
    setUser(user);
    if (user != null) {
      // 
      await firestore()
      .collection('Accounts')
      .doc(encryptID(user.email))
      .get()
      .then(async documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          navigation.navigate('Home');
        } else {
          // navigation.navigate('Start')
        }
        
      }).catch(x => 
        {
          console.log("ERR")
        
        // navigation.navigate('PinValidation');
      })
    }
    if (initializing) {
      setInitializing(false);
    }
  }
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  return (
    <View style={Styles.container}>
      <View style={Styles.main}>
        <View style={Styles.textWrapView}>
          <Text style={[Styles.titleOnboarding, Styles.singleFlex]}>
            Onboarding {'\n'} Tutorial 1 of 6
          </Text>
        </View>
      </View>
      <View style={Styles.textWrapView}>
        <Text style={[Styles.onboardingTitle, Styles.singleFlex]}>
          1. Hold your phone horizontally
        </Text>
      </View>
      <View style={Styles.textWrapView}>
        <Text style={Styles.onboardingDescription}>
          {'\n'} Our customers prefer horizontal footage!
          {'\n\n'} Your footage is more likely to be purchased if they are shot
          horizontally.
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
          onPress={() => navigation.navigate('Onboarding2')}
          title="Next"
          type="clear"
          titleStyle={{color: 'grey'}}
        />
      </View>
    </View>
  );
}

export default Onboarding;
