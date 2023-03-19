import { db } from "../config/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useState, useEffect, useLayoutEffect, useId } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";

// import icons from react-native-vector-icons
import Ioicons from "react-native-vector-icons/Ionicons";

import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";

import ChamaDepositForm from "./myComponents/DepositTochama";
import Messages from "./myComponents/Messages";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, getIdToken, signOut } from "firebase/auth";

const screenWidth = Dimensions.get("window").width;

export default function Chama({ navigation, route }) {
  const user = useAuthentication();
  const auth = getAuth();

  const userId = user?.uid;

  // set the name of chama to the title of the screen
  useLayoutEffect(() => {
    navigation.setOptions({
      title: route.params.chamaDetails.chamaName,
    });
  }, [navigation, route.params.chamaDetails.chamaName]);

  const [chamaDetails, setChamaDetails] = useState(route.params.chamaDetails);
  const [message, setMessage] = useState("");
  const [showOptions, setShowOptions] = useState(true);
  const [visibleModal, setVisibleModal] = useState(null);

  const openDepositForm = () => {
    if (visibleModal === "deposit") {
      setVisibleModal(null);
    } else {
      setVisibleModal("deposit");
    }
  };

  const openAttachmentOptions = () => {
    if (visibleModal === "attachment") {
      setVisibleModal(null);
    } else {
      setVisibleModal("attachment");
    }
  };

  // onPress of send btn, send message to firestore to firestore under this chama room
  const sendMessage = async () => {
    if (message === "") {
      return;
    }

    const messageRef = doc(db, "chamas", chamaDetails.chamaCode.toString());
    try {
      await updateDoc(messageRef, {
        messages: arrayUnion({
          message: message,
          senderID: userId,
          senderName: route.params.userName,
          timestamp: new Date(),
          id: Math.random().toString(36).substring(7),
        }),
      });

      setMessage("");
      setShowOptions(true);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/chat_bg.jpg")}
        style={styles.messagingWraper}
      >
        <Messages
          chamaCode={chamaDetails.chamaCode}
          userId={userId}
          chamaDetails={chamaDetails}
        />
      </ImageBackground>

      {visibleModal && (
        <View style={styles.moreActionsWrapper}>
          {visibleModal === "deposit" && (
            <View>
              <ChamaDepositForm chamaCode={chamaDetails} />
            </View>
          )}
          {visibleModal === "attachment" && (
            <View style={styles.attachmentOptions}>
              <TouchableOpacity style={styles.attachmentBtns}>
                <Ioicons name="document" size={24} color="#ed4746" />
                <Text>Proposal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentBtns}>
                <Ioicons name="person" size={24} color="#ed4746" />
                <Text>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentBtns}>
                <MCIicons name="music-note" size={24} color="#ed4746" />
                <Text>Audio</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.attachmentBtns}>
                <MCIicons name="file-document" size={24} color="#ed4746" />
                <Text>Document</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.messageInputWrapper}>
        <TextInput
          value={message}
          placeholder="Type a message"
          style={
            showOptions ? styles.messageInputDefault : styles.messageInputWide
          }
          multiline={true}
          cursorColor="#ed4746"
          onChangeText={(text) => {
            setShowOptions(text === "");
            setMessage(text);
          }}
        />

        {showOptions && (
          <View style={styles.inputActions}>
            {/* Money icon from material community icons */}
            <TouchableOpacity
              style={styles.actionBtns}
              onPress={openDepositForm}
            >
              <MCIicons name="cash-multiple" size={24} color="#ed4746" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtns}>
              <Ioicons name="mic" size={24} color="#ed4746" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtns}
              onPress={openAttachmentOptions}
            >
              <Ioicons name="attach" size={24} color="#ed4746" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtns}>
              <Ioicons name="camera" size={24} color="#ed4746" />
            </TouchableOpacity>
          </View>
        )}

        {message.length > 0 && (
          <TouchableOpacity
            style={[styles.actionBtns, styles.sendButton]}
            onPress={sendMessage}
          >
            <Ioicons name="send" size={24} color="#ed4746" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  messagingWraper: {
    flex: 1,
    width: "100%",
    padding: 10,
    backgroundColor: "#f2f3f5",
  },
  messageInputWrapper: {
    flexDirection: "row",
    width: "100%",
    maxheight: 80,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 30,
  },

  messageInputDefault: {
    width: screenWidth - 200,
    borderRadius: 30,
    padding: 10,
    paddingHorizontal: 20,
    // borderWidth: 1,
  },

  messageInputWide: {
    width: screenWidth - 70,
    paddingHorizontal: 20,
    maxHeight: 70,
  },

  inputActions: {
    width: "auto",
    flexDirection: "row",
  },

  actionBtns: {
    padding: 10,
  },

  moreActionsWrapper: {
    position: "absolute",
    bottom: 70,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 30,
  },

  attachmentOptions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  attachmentBtns: {
    padding: 10,
    alignItems: "center",
  },
});
