import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { useState } from "react";

import FontAwesome from "react-native-vector-icons/FontAwesome";
// import material community icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function CustomNumericKeyboard(props) {
  const [amount, setAmount] = useState(props.amount);

  function press1() {
    // handle amount input
    setAmount(amount + "1");
  }
  function press2() {
    setAmount(amount + "2");
  }
  function press3() {
    setAmount(amount + "3");
  }
  function press4() {
    setAmount(amount + "4");
  }
  function press5() {
    setAmount(amount + "5");
  }
  function press6() {
    setAmount(amount + "6");
  }
  function press7() {
    setAmount(amount + "7");
  }
  function press8() {
    setAmount(amount + "8");
  }
  function press9() {
    setAmount(amount + "9");
  }
  function press0() {
    setAmount(amount + "0");
  }
  function pressDecimal() {
    setAmount(amount + ".");
  }
  function pressBackSpace() {
    setAmount(amount.slice(0, -1));
  }

  return (
    <View style={styles.customNumericKeyboard}>
      <View style={styles.customNumericKeyboardRow}>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press1}
        >
          <Text style={styles.customNumericKeyboardBtnText}>1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press2}
        >
          <Text style={styles.customNumericKeyboardBtnText}>2</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press3}
        >
          <Text style={styles.customNumericKeyboardBtnText}>3</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.customNumericKeyboardRow}>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press4}
        >
          <Text style={styles.customNumericKeyboardBtnText}>4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press5}
        >
          <Text style={styles.customNumericKeyboardBtnText}>5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press6}
        >
          <Text style={styles.customNumericKeyboardBtnText}>6</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.customNumericKeyboardRow}>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press7}
        >
          <Text style={styles.customNumericKeyboardBtnText}>7</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press8}
        >
          <Text style={styles.customNumericKeyboardBtnText}>8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press9}
        >
          <Text style={styles.customNumericKeyboardBtnText}>9</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.customNumericKeyboardRow}>
        <TouchableOpacity style={styles.actionsBtn} onPress={pressDecimal}>
          <MaterialCommunityIcons
            name="moon-full"
            size={10}
            style={styles.backSpaceBtn}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.customNumericKeyboardBtn}
          onPress={press0}
        >
          <Text style={styles.customNumericKeyboardBtnText}>0</Text>
        </TouchableOpacity>

        {/* Button to clear inputs */}
        <TouchableOpacity style={styles.actionsBtn} onPress={pressBackSpace}>
          <MaterialCommunityIcons
            name="backspace-outline"
            size={30}
            style={styles.backSpaceBtn}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customNumericKeyboard: {
    marginVertical: 40,
  },

  customNumericKeyboardRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 40,
  },

  customNumericKeyboardBtn: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 60 / 2,
    elevation: 5,
  },

  customNumericKeyboardBtnText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  actionsBtn: {
    backgroundColor: "#fff",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 60 / 2,
  },

  decimalBtnText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  backSpaceBtn: {
    color: "#bd0832",
  },
});
