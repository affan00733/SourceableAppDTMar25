// In App.js in a new project
import 'react-native-get-random-values'
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  AppState,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import { encrypt, decrypt } from 'n-krypta';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Animatable from 'react-native-animatable';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Styles from './src/styles/css';
import Start from './src/Components/onboarding/Start';
import Onboarding1 from './src/Components/onboarding/onboarding1';
import Onboarding2 from './src/Components/onboarding/onboarding2';
import Onboarding3 from './src/Components/onboarding/onboarding3';
import Onboarding4 from './src/Components/onboarding/onboarding4';
import Onboarding5 from './src/Components/onboarding/onboarding5';
import Onboarding6 from './src/Components/onboarding/onboarding6';
import SignUp from './src/Components/Auth/SignUp';
import SignIn from './src/Components/Auth/SignIn';
import PinValidation from './src/Components/Auth/PinValidation';
import TermNcondition from './src/Components/Auth/Terms&Condition';
import Home from './src/Components/Home/Home';
import Gallery from './src/Components/Home/Gallery/Gallery';
import DisplayImage from './src/Components/Home/Camera/DisplayImage';
import Video from './src/Components/Home/Camera/Video';
import DisplayVideo from './src/Components/Home/Camera/DisplayVideo';
import UploadCloud from './src/Components/Home/Camera/UploadCloud';
import Test from './src/Components/Home/Camera/documentation';
import Settings from './src/Components/Home/settings/Settings';
import Security from './src/Components/Home/settings/Security';
import About from './src/Components/Home/settings/about';
import Language from './src/Components/Home/settings/language';
import Contact from './src/Components/Home/settings/contact';
import ContactGreet from './src/Components/Home/settings/contacGreet';
import TextScreen from './src/Components/Home/Text/Text';
import Viewer from './src/Components/Home/Gallery/Viewer';
import ViewerPrivate from './src/Components/Home/Gallery/ViewerPrivate';
import Audio from './src/Components/Home/audio/mic';
import HomeScreen from './src/Components/Home/Chat/HomeScreen';
import ChatScreen from './src/Components/Home/Chat/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const animate1 = {
  0: {scale: 0.5, translateY: 7},
  0.92: {translateY: -34},
  1: {scale: 1.2, translateY: -24},
};
const animate2 = {
  0: {scale: 1.2, translateY: -24},
  1: {scale: 1, translateY: 7},
};

const circle1 = {
  0: {scale: 0},
  0.3: {scale: 0.9},
  0.5: {scale: 0.2},
  0.8: {scale: 0.7},
  1: {scale: 1},
};
const circle2 = {0: {scale: 1}, 1: {scale: 0}};

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);
  const circleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate(animate1);
      circleRef.current.animate(circle1);
      textRef.current.transitionTo({scale: 1});
    } else {
      viewRef.current.animate(animate2);
      circleRef.current.animate(circle2);
      textRef.current.transitionTo({scale: 0});
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={Styles.container}>
      <Animatable.View ref={viewRef} duration={1000} style={Styles.container}>
        <View
          style={[Styles.btn, {borderColor: focused ? 'white' : '#CACFD2'}]}>
          <Animatable.View ref={circleRef} style={Styles.circle} />
          {item.iconType == 'material' ? (
            <MaterialIcons name={item.icon} size={30} color={'black'} />
          ) : (
            <Icon name={item.icon} size={30} color={'black'} />
          )}
        </View>
        <Animatable.Text ref={textRef} style={Styles.text}>
          {item.label}
        </Animatable.Text>
      </Animatable.View>
    </TouchableOpacity>
  );
};

function TabNav({navigation}) {
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: Styles.tabBar,
      }}
      initialRouteName="camera">
      <Tab.Screen
        name={'voice'}
        component={Audio}
        options={{
          title: 'Record Audio',
          headerTitleAlign: 'center',

          headerTransparent: true,
          tabBarShowLabel: false,
          tabBarButton: props => (
            <TabButton
              {...props}
              item={{label: 'voice', icon: 'mic-outline'}}
            />
          ),
          headerLeft: props => (
            <TouchableOpacity
              {...props}
              style={Styles.headerBtn}
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Icon name={'settings-outline'} size={30} color={'black'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name={'video'}
        component={Video}
        options={{
          title: '',
          headerTitleAlign: 'center',

          headerTransparent: true,
          tabBarShowLabel: false,
          tabBarButton: props => (
            <TabButton
              {...props}
              item={{label: 'video', icon: 'videocam-outline'}}
            />
          ),
          headerLeft: props => (
            <TouchableOpacity
              {...props}
              style={Styles.headerBtn}
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Icon name={'settings-outline'} size={30} color={'black'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name={'camera'}
        component={Home}
        options={{
          title: '',
          headerTitleAlign: 'center',
          headerTransparent: true,
          tabBarShowLabel: false,
          tabBarButton: props => (
            <TabButton
              {...props}
              item={{label: 'camera', icon: 'camera-outline'}}
            />
          ),
          headerLeft: props => (
            <TouchableOpacity
              {...props}
              style={Styles.headerBtn}
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Icon name={'settings-outline'} size={30} color={'black'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name={'text'}
        component={TextScreen}
        options={{
          title: 'Write Text',
          headerTitleAlign: 'center',
          headerTransparent: true,
          tabBarShowLabel: false,
          tabBarButton: props => (
            <TabButton
              {...props}
              item={{label: 'text', icon: 'text-fields', iconType: 'material'}}
            />
          ),
          headerLeft: props => (
            <TouchableOpacity
              {...props}
              style={Styles.headerBtn}
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Icon name={'settings-outline'} size={30} color={'black'} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name={'gallery'}
        component={Gallery}
        options={{
          title: 'Gallery',
          headerTitleAlign: 'center',
          headerTransparent: true,
          tabBarShowLabel: false,
          tabBarButton: props => (
            <TabButton
              {...props}
              item={{label: 'gallery', icon: 'images-outline'}}
            />
          ),
          headerLeft: props => (
            <TouchableOpacity
              {...props}
              style={Styles.headerBtn}
              onPress={() => {
                navigation.navigate('Settings');
              }}>
              <Icon name={'settings-outline'} size={30} color={'black'} />
            </TouchableOpacity>
          ),
          headerRight: props => (
            <View style={Styles.headerView}>
              <TouchableOpacity
                style={Styles.headerBtn}
                {...props}
                onPress={() => {
                  navigation.navigate('HomeScreen');
                }}>
                <Icon name={'chatbubbles-outline'} size={30} color={'black'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const [user, setuser] = useState('');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        console.log('userExist', userExist);
        firestore().collection('Accounts').doc(encryptID(userExist.email)).update({
          status: encryptedData("online").toString(),
        }).catch("ERRR");
        setuser(userExist);
      } else setuser('');
    });

    return () => {
      unregister();
    };
  }, []);

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
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          await auth().onAuthStateChanged(async userExist => {
            if (userExist) {
              console.log('userExist', userExist);
              await firestore()
                .collection('Accounts')
                .doc(encryptID(userExist.email))
                .update({
                  status: encryptedData("online").toString(),
                }).catch("ERRR");
            }
          })
        } else {
          console.log('AppState Background');
          await auth().onAuthStateChanged(async userExist => {
            if (userExist) {
              console.log('userExist', userExist);
              await firestore()
                .collection('Accounts')
                .doc(encryptID(userExist.email))
                .update({
                  status: encryptedData(firestore.FieldValue.serverTimestamp()).toString(),
                }).catch("ERRR");
            }
          })
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        // console.log('AppState', appState.current);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Start"
          component={Start}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding1"
          component={Onboarding1}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding2"
          component={Onboarding2}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding3"
          component={Onboarding3}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding4"
          component={Onboarding4}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding5"
          component={Onboarding5}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding6"
          component={Onboarding6}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PinValidation"
          component={PinValidation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TermNcondition"
          component={TermNcondition}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={TabNav}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Settings"
          // options={{headerShown: false}}
          options={{
            title: 'Settings',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}>
          {props => <Settings {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="HomeScreen"
          // options={{headerShown: false}}
          options={{
            title: 'Chat',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}>
          {props => <HomeScreen {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="ChatScreen"
          // options={{headerShown: false}}
          options={{
            title: 'ChatScreen',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}>
          {props => <ChatScreen {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="Security"
          component={Security}
          // options={{headerShown: false}}
          options={{
            title: 'Security',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="About"
          component={About}
          // options={{headerShown: false}}
          options={{
            title: 'About',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Language"
          component={Language}
          // options={{headerShown: false}}
          options={{
            title: 'Language',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Contact"
          component={Contact}
          // options={{headerShown: false}}
          options={{
            title: 'Contact',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ContactGreet"
          component={ContactGreet}
          // options={{headerShown: false}}
          options={{
            title: '',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="DisplayImage"
          component={DisplayImage}
          // options={{headerShown: false}}
          options={{
            title: 'Display',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="DisplayVideo"
          component={DisplayVideo}
          // options={{headerShown: false}}
          options={{
            title: 'DisplayVideo',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="UploadCloud"
          component={UploadCloud}
          // options={{headerShown: false}}
          options={{
            title: '',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="Test"
          component={Test}
          // options={{headerShown: false}}
          options={{
            // title: 'Display',
            // headerTitleAlign: 'center',
            // headerTransparent: true,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Viewer"
          component={Viewer}
          // options={{headerShown: false}}
          options={{
            title: 'Gallery',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="ViewerPrivate"
          component={ViewerPrivate}
          // options={{headerShown: false}}
          options={{
            title: 'Gallery',
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
const styles = StyleSheet.create({
  button: {
    margin: 10,
  },
  textPrimary: {
    marginVertical: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  textSecondary: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 17,
  },
});
