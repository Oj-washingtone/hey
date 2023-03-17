import { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Ioicons from "react-native-vector-icons/Ionicons";

export default function Wallet() {
  const [seeBalance, setSeeBalance] = useState({
    visible: false,
    walletSize: 100,
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setBalance(100);
  }, []);

  const toggleSeeBalance = () => {
    if (seeBalance.visible) {
      setSeeBalance({
        visible: false,
        walletSize: 100,
      });
    } else {
      setSeeBalance({
        visible: true,
        walletSize: 200,
      });
    }
  };

  return (
    <View style={[styles.wallet, { height: seeBalance.walletSize }]}>
      <View style={[styles.walletHeader]}>
        <Text style={styles.walletTitle}>Your wallet balance</Text>
        {/* Eye icon to allow users to show hide their wallet balance */}
        {seeBalance.visible ? (
          <TouchableOpacity
            style={styles.toggleSeeWallet}
            onPress={toggleSeeBalance}
          >
            <Ioicons name="eye" size={26} color="#000" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.toggleSeeWallet}
            onPress={toggleSeeBalance}
          >
            <Ioicons name="eye-off" size={26} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      {/* Show balance only when visible is true */}
      {seeBalance.visible && (
        <View style={styles.walletBalance}>
          <Text style={styles.walletBallanceTitle}>KES</Text>
          <Text style={styles.walletAmount}>0.00</Text>
        </View>
      )}

      <View style={styles.walletNumberWrapper}>
        {/* wallet icon */}
        <Ioicons name="wallet" size={18} color="#D03F9B" />
        <Text style={styles.walletNumber}>0811232314</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wallet: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 50,
    padding: 20,
    elevation: 3,
    width: "90%",
  },

  walletHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  walletTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E83672",
    display: "flex",
    flexDirection: "row",
  },

  walletBalance: {
    marginBottom: 20,
  },

  walletBallanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },

  walletAmount: {
    fontSize: 30,
    fontWeight: "bold",
  },

  walletNumberWrapper: {
    display: "flex",
    flexDirection: "row",

    // alignSelf: "flex-end",
  },

  walletNumber: {
    color: "#E83672",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 17,
    marginLeft: 10,
  },

  walletActions: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },

  walletActionButton: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
