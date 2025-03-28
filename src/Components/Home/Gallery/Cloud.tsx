import React, {useLayoutEffect, useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import Styles from '../../../styles/css';

function Cloud({navigation}) {
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
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const data = [
    {
      key: 'A',
      icon: 'images-outline',
      icon2: 'shield-checkmark-outline',
      type: 1,
      incident_type: 'Recognized',
      data_tye: 'image',
    },
    {
      key: 'B',
      icon: 'mic-outline',
      icon2: 'shield-checkmark-outline',
      type: 1,
      incident_type: 'Recognized',
      data_tye: 'audio',
    },
    {
      key: 'C',
      icon: 'videocam-outline',
      icon2: 'shield-checkmark-outline',
      type: 1,
      incident_type: 'Recognized',
      data_tye: 'video',
    },
    {
      key: 'D',
      icon: 'text-fields',
      icon2: 'shield-checkmark-outline',
      type: 2,
      incident_type: 'Recognized',
      data_tye: 'text',
    },
    {
      key: 'F',
      icon: 'images-outline',
      icon2: 'eye-off-outline',
      type: 1,
      incident_type: 'Anonymously',
      data_tye: 'image',
    },
    {
      key: 'G',
      icon: 'mic-outline',
      icon2: 'eye-off-outline',
      type: 1,
      incident_type: 'Anonymously',
      data_tye: 'audio',
    },
    {
      key: 'H',
      icon: 'videocam-outline',
      icon2: 'eye-off-outline',
      type: 1,
      incident_type: 'Anonymously',
      data_tye: 'video',
    },
    {
      key: 'I',
      icon: 'text-fields',
      icon2: 'eye-off-outline',
      type: 2,
      incident_type: 'Anonymously',
      data_tye: 'text',
    },
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
          await firestore()
            .collection('Explore')
            .where('properties.user', '==', user.email)
            .where('properties.file.type', '==', item.data_tye)
            .where('properties.cloud_status', '==', item.incident_type)
            .orderBy('properties.created', 'asc')
            .get()
            .then(async querySnapshot => {
              console.log('Total users: ', querySnapshot.size);
              let docData = [];
              querySnapshot.forEach(async documentSnapshot => {
                console.log(
                  'User ID: ',
                  documentSnapshot.id,
                  JSON.stringify(documentSnapshot.data()),
                );
                let d = documentSnapshot.data();
                d['key'] = documentSnapshot.id;
                await docData.push(d);
              });
              await navigation.navigate('Viewer', {
                data: docData,
                type: item.data_tye,
                section: 'public',
              });
            });
        }}
        style={Styles.galleryItem}>
        <View style={Styles.galleryItemText}>
          {item.type == 2 ? (
            <MaterialIcons name={item.icon} size={45} color={'black'} />
          ) : (
            <Icon name={item.icon} size={45} color={'black'} />
          )}

          <Icon style={Styles.cloudOther} name={item.icon2} size={25} />
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

export default Cloud;
