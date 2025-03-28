import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {FAB, Badge} from 'react-native-paper';
import Styles from '../../../styles/css';
import Icon from 'react-native-vector-icons/Ionicons';

import analytics from '@react-native-firebase/analytics';


export default function HomeScreen({user, props, navigation}) {
  const [users, setUsers] = useState(null);
  const [notify, setNotify] = useState([]);

  useEffect(() => {
    const analyticsCall = async () => {
      console.log('analyticsCall');
      await analytics().setUserId('Sourceable_APP_Chat');
      await analytics().logEvent('Sourceable_APP_Chat');

      await analytics().setAnalyticsCollectionEnabled(true);

      await analytics().logScreenView({
        screen_name: 'Sourceable APP Chat',
        screen_class: 'Sourceable APP Chat',
      });
      console.log('analyticsCall log');
    };  
    return () => {
      analyticsCall();
    };
  }, []);

  const getUsers = async () => {
    const querySanp12 = await firestore()
      .collection('Account')
      .where('email', '!=', user.email);
    // .get();
    querySanp12.onSnapshot(async querySanp => {
      const allusers = await querySanp.docs.map(docSnap => docSnap.data());
      console.log('allusers', allusers);

      const querySanp21 = await firestore()
        .collection('Notification')
        .where('to', '==', user.email);
      // .get();
      querySanp21.onSnapshot(async querySanp2 => {
        const allnotify = await querySanp2.docs.map(docSnap => docSnap.data());
        console.log('allnotify', allnotify);
        const newP = [];
        allusers.forEach(element => {
          const res = allnotify.filter(x => x.from == element.email)[0];
          console.log('res', res);
          if (res != null) {
            newP.push({...element, count: res.count});
          } else {
            newP.push({...element, count: 0});
          }
        });
        await setUsers(newP);

        console.log('newP', users);
      });
    });
  };

  useEffect(() => {
    console.log("Some checks ",users);
    getUsers();
  }, []);

  useLayoutEffect(() => {
    console.log('user', user);

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

  const LetsChat = async item => {
    await firestore()
      .collection('Notification')
      .doc(`${item.email}-${user.email}`)
      .set({
        from: item.email,
        to: user.email,
        count: 0,
      });

    navigation.navigate('ChatScreen', {
      name: item.name,
      email: item.email,
      status:
        typeof item.status == 'string'
          ? item.status
          : item.status.toDate().toString(),
    });
  };

  const RenderCard = ({item}) => {
    console.log('item', notify);
    return (
      <TouchableOpacity onPress={() => LetsChat(item)}>
        <View style={styles.mycard}>
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <View style={{flexDirection: 'row'}}>
              <Badge
                size={15}
                style={{
                  backgroundColor: item.status == 'online' ? 'green' : 'red',
                  margin: 3,
                }}></Badge>
              <Text style={styles.text}>
                {typeof item.status == 'string'
                  ? item.status
                  : item.status.toDate().toDateString() +
                    ' at ' +
                    item.status.toDate().toLocaleTimeString()}
              </Text>
            </View>

            {item.count != 0 ? (
              <Badge
                style={{
                  backgroundColor: 'blue',
                }}>
                {item.count}
              </Badge>
            ) : (
              <></>
            )}
            {/* <Badge>{item.count}</Badge>  */}

            {/* <Text style={styles.text}>{item.count}</Text> */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <View style={{flex: 1}}></View>
      <View style={Styles.settingDivider}>
        <FlatList
          data={users}
          renderItem={({item}) => {
            return <RenderCard item={item} />;
          }}
          keyExtractor={item => item.uid}
        />
        {/* <FAB
          style={styles.fab}
          icon="face-profile"
          color="black"
          onPress={() => navigation.navigate('account')}
        /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {width: 60, height: 60, borderRadius: 30, backgroundColor: 'green'},
  text: {
    fontSize: 18,
    marginLeft: 15,
    color: 'black',
  },
  mycard: {
    // flexDirection: 'row',
    margin: 3,
    padding: 4,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
  },
});
