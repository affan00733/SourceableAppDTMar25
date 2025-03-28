import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Styles from '../../../styles/css';
import RNFS from 'react-native-fs';

function Draft({navigation}) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    console.log('user email', user);
    if (user != null) {
      // navigation.navigate('Home');
      console.log('logged check');
    }
    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const getFromLocal = async () => {
      let allKeys = await AsyncStorage.getAllKeys();
      const value = await AsyncStorage.multiGet(allKeys);

      for (let i = 0; i < value.length; i++) {
        let keyValue = JSON.parse(value[i][1])
        console.log('all local Data Value : ', value[i][0],keyValue);
        let exists = await RNFS.exists(keyValue.localPath);
        console.log("check exists",exists);
        if (!exists && keyValue.datatype != "text") {
          await AsyncStorage.removeItem(value[i][0]);
        }

      }
    };
    getFromLocal();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const data = [
    {key: 'A', icon: 'images-outline', type: 1, data_tye: 'image'},
    {key: 'B', icon: 'mic-outline', type: 1, data_tye: 'audio'},
    {key: 'C', icon: 'videocam-outline', type: 1, data_tye: 'video'},
    {key: 'D', icon: 'text-fields', type: 2, data_tye: 'text'},
  ];

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }

    return data;
  };
  const renderItem = ({item, index}) => {
    if (item.empty === true) {
      return <View style={[Styles.galleryItem, Styles.galleryItemInvisible]} />;
    }
    return (
      <TouchableOpacity
        onPress={async () => {
          let allKeys = await AsyncStorage.getAllKeys();
          let filteredAllKeys = allKeys.filter(name => name.includes(item.data_tye));
          const value = await AsyncStorage.multiGet(filteredAllKeys);
          console.log('item:->', item.data_tye);
          console.log('value', value);
          await navigation.navigate('ViewerPrivate', {
            data: value,
            type: item.data_tye,
            section: 'private',
          });
        }}
        style={Styles.galleryItem}>
        <View style={Styles.galleryItemText}>
          {item.type == 2 ? (
            <MaterialIcons name={item.icon} size={45} color={'black'} />
          ) : (
            <Icon name={item.icon} size={45} color={'black'} />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  const numColumns = 3;
  return (
    <FlatList
      data={formatData(data, numColumns)}
      style={Styles.galleryContainer}
      renderItem={renderItem}
      numColumns={numColumns}
    />
  );
}

export default Draft;
