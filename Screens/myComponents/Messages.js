import { db } from "../../config/firebase";
import { collection, doc, onSnapshot, getDoc } from "firebase/firestore";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
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

  // group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(
      message.timestamp.seconds * 1000
    ).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const renderMessages = ({ item, index }) => {
    const date = new Date(item.timestamp.seconds * 1000).toLocaleDateString();
    const isFirstMessageOfDateGroup =
      index === 0 ||
      date !==
        new Date(
          messages[index - 1].timestamp.seconds * 1000
        ).toLocaleDateString();
    return (
      <>
        {isFirstMessageOfDateGroup && renderDateHeader(date)}
        <View style={styles.messageContainer}>
          <View
            style={[
              styles.message,
              item.senderID === props.userId && styles.myMessage,
            ]}
          >
            <View style={styles.messageDetails}>
              <Text style={styles.sender}>{item.senderName}</Text>
            </View>
            <View style={styles.messageandTime}>
              <Text
                style={[
                  styles.messageText,
                  item.senderID !== props.userId && styles.otherMessageText,
                ]}
              >
                {item.message}
              </Text>

              <Text style={styles.messageTime}>
                {item.timestamp &&
                  new Date(item.timestamp.seconds * 1000).toLocaleTimeString(
                    [],
                    {
                      hour: "numeric",
                      minute: "numeric",
                    }
                  )}
              </Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderDateHeader = (date) => {
    const today = new Date().toLocaleDateString();
    const headerText = date === today ? "Today" : date;

    return (
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderText}>{headerText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessages}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <ActivityIndicator size="large" />}
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
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
    marginHorizontal: 10,
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

  messageTime: {
    marginLeft: 10,
    color: "gray",
    textAlign: "right",
    marginTop: 5,
    fontSize: 11,
  },

  dateHeader: {
    elevation: 3,
    padding: 5,
    opacity: 0.4,
    backgroundColor: "#fff",
  },

  dateHeaderText: {
    textAlign: "center",
  },

  // otherMessageText: {
  //   color: "#fff",
  // },
});
