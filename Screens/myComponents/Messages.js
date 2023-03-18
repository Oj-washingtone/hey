import { db } from "../../config/firebase";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default function Messages(props) {
  const chamaCode = props.chamaCode;
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    const chamaRef = doc(db, "chamas", chamaCode.toString());
    const unsubscribe = onSnapshot(chamaRef, (snapshot) => {
      const messagesList = snapshot.data().messages;
      setMessages(messagesList);

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [chamaCode]);

  const renderMessages = ({ item }) => (
    <View style={styles.messageContainer}>
      {/* Add activity indicator if messeges are still loading */}
      {messages.length === 0 && (
        <ActivityIndicator size="large" color="#D03F9B" />
      )}
      <View
        style={[
          styles.message,
          item.senderID === props.userId && styles.myMessage,
        ]}
      >
        <View style={styles.messageDetails}>
          <Text style={styles.sender}>{item.senderName}</Text>
          <Text style={styles.messageDetailsText}>{item.time}</Text>
        </View>
        <Text
          style={[
            styles.messageText,
            item.senderID !== props.userId && styles.otherMessageText,
          ]}
        >
          {item.message}
        </Text>
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
        // inverted
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
  },

  messageContainer: {
    width: "auto",
    flexDirection: "column",
    margin: 5,
    // backgroundColor: "#fff",
  },

  message: {
    width: "auto",
    flexDirection: "column",
    backgroundColor: "pink",
    borderRadius: 20,
    padding: 5,
    paddingHorizontal: 20,
    marginVertical: 5,
    maxWidth: "70%",
    borderTopLeftRadius: 0,
    elevation: 3,
    alignSelf: "flex-start",
  },

  myMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 0,
  },

  messageDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  sender: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#D03F9B",
  },

  //   otherMessageText: {
  //     color: "#fff",
  //   },
});
