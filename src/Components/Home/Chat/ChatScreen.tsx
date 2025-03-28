import React, {useState, useEffect, useLayoutEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import Styles from '../../../styles/css';
import Icon from 'react-native-vector-icons/Ionicons';
// import { Helmet } from "react-helmet";
// import ReactGA from "react-ga4";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default function ChatScreen({user, route, navigation, props}) {
  const [messages, setMessages] = useState([]);
  const {email, status, name} = route.params;

  useLayoutEffect(() => {
    console.log('user', user);
    navigation.setOptions({title: name});
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
  const getAllMessages = async () => {
    const docid =
      email > user.email ? user.email + '-' + email : email + '-' + user.email;
    const querySanp = await firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .get();
    const allmsg = querySanp.docs.map(docSanp => {
      return {
        ...docSanp.data(),
        createdAt: docSanp.data().createdAt.toDate(),
      };
    });
    setMessages(allmsg);
  };
  useEffect(() => {
    // getAllMessages()

    const docid =
      email > user.email ? user.email + '-' + email : email + '-' + user.email;
    const messageRef = firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .orderBy('createdAt', 'desc');

    const unSubscribe = messageRef.onSnapshot(querySnap => {
      const allmsg = querySnap.docs.map(docSanp => {
        const data = docSanp.data();
        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, []);

  useEffect(()=>{
		// ReactGA.pageview("window.location.pathname + window.location.search")
		// ReactGA.send({ hitType: "pageview", page: "/explore" });
		// ReactGA.event({
		// 	category: "App | ChatScreen",
		// 	action: "App | ChatScreen",
		// 	// label: "your label", // optional
		// 	// value: 99, // optional, must be a number
		// 	nonInteraction: true, // optional, true/false
		// 	// transport: "xhr", // optional, beacon/xhr/image
		//   });

	},[]);

  const onSend = messageArray => {
    const msg = messageArray[0];
    // console.log('msg', msg);
    const mymsg = {
      ...msg,
      sentBy: user.email,
      sentTo: email,
      createdAt: new Date(),
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    const docid =
      email > user.email ? user.email + '-' + email : email + '-' + user.email;

    firestore()
      .collection('chatrooms')
      .doc(docid)
      .collection('messages')
      .add({...mymsg, createdAt: firestore.FieldValue.serverTimestamp()});

    if (status != 'online') {
      firestore()
        .collection('Notification')
        .doc(`${user.email}-${email}`)
        .get()
        .then(documentSnapshot => {
          console.log('Notification exists: ', documentSnapshot.exists);

          if (documentSnapshot.exists) {
            console.log('Notification data: ', documentSnapshot.data());
            console.log('UPDATE');
            firestore()
              .collection('Notification')
              .doc(`${user.email}-${email}`)
              .update({
                count: firestore.FieldValue.increment(1),
              });
          } else {
            console.log('SET');
            firestore()
              .collection('Notification')
              .doc(`${user.email}-${email}`)
              .set({
                from: user.email,
                to: email,
                count: 1,
              });
          }
        });
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <GiftedChat
        messages={messages}
        onSend={text => onSend(text)}
        user={{
          _id: user.email,
        }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: 'blue',
                },
              }}
            />
          );
        }}
        renderSend={props => {
          return (
            <Send {...props}>
              <View style={{paddingRight: hp('1%')}}>
                <Icon
                  style={{
                    alignItems: 'center',
                  }}
                  name={'send-outline'}
                  size={hp('3.5%')}
                  color={'blue'}
                />
              </View>
            </Send>
          );
        }}
        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              // containerStyle={{borderTopWidth: 1.5, borderTopColor: 'blue'}}
              textInputStyle={{color: 'black'}}
            />
          );
        }}
      />
    </View>
  );
}
