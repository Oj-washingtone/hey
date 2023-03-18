import { db } from "../../config/firebase";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";

import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";

// import icons from react-native-vector-icons
import Ioicons from "react-native-vector-icons/Ionicons";

import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Messages(props) {
  const chamaCode = props.chamaCode;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chamaRef = doc(db, "chamas", chamaCode.toString());
    const unsubscribe = onSnapshot(chamaRef, (snapshot) => {
      const messagesList = snapshot.data().messages;
      setMessages(messagesList);
    });
    return () => {
      unsubscribe();
    };
  }, [chamaCode]);

  const renderMessages = ({ item }) => (
    <View style={styles.messageContainer}>
      <View style={styles.message}>
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
      <View style={styles.messageDetails}>
        <Text style={styles.messageDetailsText}>{item.sender}</Text>
        <Text style={styles.messageDetailsText}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessages}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        inverted
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
