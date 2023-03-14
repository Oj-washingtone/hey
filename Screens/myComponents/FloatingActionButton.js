import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";

import Ioicons from "react-native-vector-icons/Ionicons";

export default function FloatingActionButton(props) {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const { onJoinChamaPress, onCreateChamaPress } = props;

  const toggleAnimation = () => {
    const toValue = isOpen ? 0 : 1;

    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: false,
    }).start();

    setIsOpen(!isOpen);
  };

  const createBtnStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -110],
        }),
      },
    ],
  };

  const joinBtnStyle = {
    transform: [
      { scale: animation },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -40],
        }),
      },
    ],
  };

  const rotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
    ],
  };

  const navigateToCreateChama = () => {
    onCreateChamaPress();
  };

  const navigateToJoinChama = () => {
    onJoinChamaPress();
  };

  return (
    <View style={styles.fabContainer}>
      <TouchableWithoutFeedback
        style={styles.floatingActionButton}
        onPress={navigateToJoinChama}
      >
        <Animated.View style={[styles.button, styles.secondary, joinBtnStyle]}>
          <Text style={styles.buttonText}>Join chama</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        style={styles.floatingActionButton}
        onPress={navigateToCreateChama}
      >
        <Animated.View
          style={[styles.button, styles.secondary, createBtnStyle]}
        >
          <Text style={styles.buttonText}>Start chama</Text>
        </Animated.View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback onPress={toggleAnimation}>
        <Animated.View style={[styles.button, styles.mainButton, rotation]}>
          <Ioicons name="add" size={30} color="#fff" />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 70,
    right: 40,
  },
  mainButton: {
    backgroundColor: "#ed4746",
    elevation: 3,
  },
  button: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  secondary: {
    width: 100,
    height: "auto",
    padding: 7,
    borderRadius: 40 / 2,
    backgroundColor: "#ed4746",
    justifyContent: "center",
    alignItems: "center",
    right: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
  },
  floatingActionButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
