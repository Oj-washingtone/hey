import { db } from "../../config/firebase";
import {
  collection,
  doc,
  onSnapshot,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

export default function Messages(props) {
  const chamaCode = props.chamaCode;

  const chamaAdmins = props.chamaDetails?.chamaAdmins;

  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const [newUserAction, setNewUserAction] = useState({
    action: "",
    user: "",
  });

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

  // Add new member to chama
  const addMemberToChama = async (memberId) => {
    const chamaRef = doc(db, "chamas", chamaCode.toString());
    try {
      await updateDoc(chamaRef, {
        chamaMembers: arrayUnion(memberId),
        memberWaitList: arrayRemove(memberId),
      });

      // add approved to the message that requested admission of this user
      const messagesRef = doc(db, "chamas", chamaCode.toString());
      const messagesDoc = await getDoc(messagesRef);
      const messagesList = messagesDoc.data().messages;
      const newMessagesList = messagesList.map((message) => {
        if (message.for === memberId) {
          message.approved = true;
        }
        return message;
      });
      await updateDoc(messagesRef, {
        messages: newMessagesList,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // decline member from joining chama
  const declineMember = async (memberId) => {
    const chamaRef = doc(db, "chamas", chamaCode.toString());
    try {
      await updateDoc(chamaRef, {
        memberWaitList: arrayRemove(memberId),
      });

      // add approved to the message that requested admission of this user
      const messagesRef = doc(db, "chamas", chamaCode.toString());
      const messagesDoc = await getDoc(messagesRef);
      const messagesList = messagesDoc.data().messages;
      const newMessagesList = messagesList.map((message) => {
        if (message.for === memberId) {
          message.declined = true;
        }
        return message;
      });
      await updateDoc(messagesRef, {
        messages: newMessagesList,
      });
    } catch (e) {
      console.log(e);
    }
  };

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
              {chamaAdmins.includes(item.senderID) ? (
                <Text style={styles.sender}>{item.senderName} (Admin)</Text>
              ) : (
                <Text style={styles.sender}>{item.senderName}</Text>
              )}
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

              {/* Add buttons depending on type of message */}
              {item.type === "membership" &&
                // only show buttons if the user is an admin
                chamaAdmins.includes(props.userId) &&
                // only show if approved is false else show approved
                !item.approved &&
                !item.declined && (
                  <View style={styles.mebershipBtns}>
                    <TouchableOpacity
                      style={[styles.button, styles.acceptBtn]}
                      onPress={() => {
                        addMemberToChama(item.for);
                      }}
                    >
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.declineBtn]}
                      onPress={() => declineMember(item.for)}
                    >
                      <Text style={styles.buttonText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                )}

              {item.type === "membership" && item.approved && (
                <View style={styles.membershipAproval}>
                  <Text style={styles.approvedText}>Approved by admin</Text>
                </View>
              )}

              {item.type === "membership" && item.declined && (
                <View style={styles.membershipAproval}>
                  <Text style={styles.declinedText}>Declined by admin</Text>
                </View>
              )}
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
    backgroundColor: "#fff",
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
    backgroundColor: "#E4F7D2",
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
    marginVertical: 20,
  },

  dateHeaderText: {
    textAlign: "center",
  },

  mebershipBtns: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
  },

  button: {
    padding: 5,
    alighItems: "center",
  },

  buttonText: {
    color: "#217ffb",
  },

  membershipAproval: {
    flexDirection: "row",
    marginBottom: 10,
  },

  approvedText: {
    color: "#217ffb",
  },

  declinedText: {
    color: "#ff0000",
  },

  // otherMessageText: {
  //   color: "#fff",
  // },
});
