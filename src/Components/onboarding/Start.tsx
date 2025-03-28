// In App in a new project

import React, {useState, useEffect} from 'react';
import {View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from '@rneui/themed';
import auth from '@react-native-firebase/auth';

import Styles from '../../styles/css';

function Start({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (user != null) {
      navigation.navigate('Home');
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
        <Text style={Styles.titleOnboarding}>Welcome To {'\n'} Sourceable</Text>
        {/* <Icon name="ellipsis-horizontal-sharp" size={30} color="#4F8EF7" /> */}
      </View>
      <View style={Styles.logo}>
        <Image
          style={Styles.imageLogo}
          source={require('../../images/logo_sourceable.png')}
        />
      </View>
      <View style={Styles.main}>
        <Text style={Styles.footerOnboarding}>
          Empowering. Supporting. Connecting. {'\n'}
        </Text>
        <Text style={Styles.footerOnboarding}>
          Trusted by citizen journalists, {'\n'} used by the world
        </Text>
      </View>
      <View style={Styles.footerButton}>
        {/* <Text style={Styles.footerOnboarding}>Proceed</Text> */}
        <Button
          onPress={() => navigation.navigate('Onboarding1')}
          title="Proceed"
          type="clear"
          titleStyle={{color: 'grey'}}
        />
      </View>
    </View>
  );
}

export default Start;
