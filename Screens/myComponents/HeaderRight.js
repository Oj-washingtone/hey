import * as NavigationBar from "expo-navigation-bar";
import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
} from "react-native";

import Ioicons from "react-native-vector-icons/Ionicons";
import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function HeaderRight() {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuPress = () => {
    setShowMenu(!showMenu);
    // NavigationBar.setVisibilityAsync("hidden");
  };

  // get all members

  return (
    <View style={styles.headerRight}>
      <TouchableOpacity style={styles.btn}>
        <MCIicons name="phone-plus" size={24} color="#ed4746" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <MCIicons name="video-outline" size={24} color="#ed4746" />
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.btn}
        onPress={handleMenuPress}
        activeOpacity={0.5}
      >
        <MCIicons name="dots-vertical" size={24} color="#ed4746" />
      </TouchableOpacity> */}

      {showMenu && (
        <Modal
          animationType="fade"
          visible={showMenu}
          transparent
          hardwareAccelerated
          //   presentationStyle="formSheet"
        >
          <TouchableOpacity
            style={styles.modalBody}
            onPress={() => setShowMenu(false)}
          >
            <View style={styles.dropdown}>
              <FlatList
                data={["Chama Accounting", "Notification", "Set pin"]}
                renderItem={({ item }) => (
                  <TouchableOpacity>
                    <Text style={styles.option}>{item}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    marginRight: 20,
  },

  dropdown: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    fontSize: 16,
    padding: 10,
  },

  btn: {
    marginLeft: 30,
  },

  modalBody: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0)",
    justifyContent: "center",
    alignItems: "center",
  },
});
