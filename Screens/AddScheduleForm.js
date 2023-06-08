import React, { useState, useEffect } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import RadioGroup from "react-native-radio-buttons-group";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

import { useRoute } from "@react-navigation/native";

import { db } from "../config/firebase";
import {
  collection,
  where,
  query,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  get,
} from "firebase/firestore";

export default function AddScgeduleForm(routes) {
  const route = useRoute();

  const { userId } = route.params;

  const [scheduleDetails, setScheduleDetails] = useState({
    amount: "",
    chama: "",
    frequency: "One time",
    date: "",
    time: "",
    error: "",
  });

  // Select chama
  const [chamas, setChamas] = useState([]);
  // get the list of chamas that this user is a member of

  useEffect(() => {
    const q = query(
      collection(db, "chamas"),
      where("chamaMembers", "array-contains", userId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chamas = [];
      querySnapshot.forEach((doc) => {
        chamas.push(doc.data());
      });
      setChamas(chamas);
    });
    return () => unsubscribe();
  }, [userId]);

  const [selectedChama, setSelectedChama] = useState();

  const [radioButton, setRadioButton] = useState([
    {
      id: "1",
      label: "One time",
      value: "One time",
      color: "#FF8C00",
      size: 20,
      disabled: false,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginLeft: 10,
      selected: true,
    },
    {
      id: "2",
      label: "Daily",
      value: "Daily",
      color: "#FF8C00",
      size: 20,
      disabled: false,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginLeft: 10,
      selected: false,
    },

    {
      id: "3",
      label: "Weekly",
      value: "Weekly",
      color: "#FF8C00",
      size: 20,
      disabled: false,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginLeft: 10,
      selected: false,
    },

    {
      id: "4",
      label: "Monthly",
      value: "Monthly",
      color: "#FF8C00",
      size: 20,
      disabled: false,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      marginLeft: 10,
      selected: false,
    },
  ]);

  function onPressRadioButton(radioButtonsArray) {
    setRadioButton(radioButtonsArray);
    if (radioButtonsArray[0].selected) {
      setScheduleDetails({ ...scheduleDetails, frequency: "One time" });
    }
    if (radioButtonsArray[1].selected) {
      setScheduleDetails({ ...scheduleDetails, frequency: "Daily" });
    }
    if (radioButtonsArray[2].selected) {
      setScheduleDetails({ ...scheduleDetails, frequency: "Weekly" });
    }
    if (radioButtonsArray[3].selected) {
      setScheduleDetails({ ...scheduleDetails, frequency: "Monthly" });
    }
  }

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setScheduleDetails({
      ...scheduleDetails,
      date: selectedDate.toDateString(),
      time: selectedDate.toLocaleTimeString(),
    });
  };

  const showMode = (currentMode) => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const [loading, setLoading] = useState(false);

  const createNewSchedule = () => {
    // empty fields
    if (
      scheduleDetails.amount === "" ||
      scheduleDetails.chama === "" ||
      scheduleDetails.date === "" ||
      scheduleDetails.time === ""
    ) {
      setScheduleDetails({
        ...scheduleDetails,
        error: "* All fields are required",
      });

      return;
    } else {
      // remove previous error
      setScheduleDetails({
        ...scheduleDetails,
        error: "",
      });

      setLoading(true);
      // create new schedule
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.title}>New schedule</Text>

      <View style={styles.form}>
        {scheduleDetails.error && (
          <Text style={{ color: "red", marginBottom: 40 }}>
            {scheduleDetails.error}
          </Text>
        )}

        <View style={styles.formGroup}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Enter amount"
            keyboardType="numeric"
            onChangeText={(text) => {
              setScheduleDetails({ ...scheduleDetails, amount: text });
            }}
          />

          <Text style={styles.label}>Chama</Text>

          <Picker
            selectedValue={scheduleDetails.chama}
            onValueChange={(itemValue, itemIndex) => {
              // setSelectedLanguage(itemValue);
              setScheduleDetails({
                ...scheduleDetails,
                chama: itemValue,
              });
            }}
            style={styles.pickerStyle}
          >
            <Picker.Item label="Select chama" value="" enabled={false} />
            {chamas.map((chama, index) => (
              <Picker.Item
                label={chama.chamaName}
                value={chama.chamaCode}
                key={index}
              />
            ))}
          </Picker>

          <View>
            <Text style={styles.label}>Frequency</Text>
            <RadioGroup
              radioButtons={radioButton}
              onPress={onPressRadioButton}
              containerStyle={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
                with: "100%",
                backgroundColor: "#fff",
              }}
            />
          </View>
          <View style={styles.scheduleDateTime}>
            <View>
              <TouchableOpacity
                style={styles.pickerButtons}
                onPress={showDatepicker}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#bd0832"
                />
                <Text style={styles.inputText}>Select Start date</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.dateTime]}
                placeholder="Start date"
                keyboardType="numeric"
                editable={false}
                value={scheduleDetails.date}
              />
            </View>

            <View>
              <TouchableOpacity
                style={styles.pickerButtons}
                onPress={showTimepicker}
              >
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={20}
                  color="#bd0832"
                />
                <Text style={styles.inputText}>Select time</Text>
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.dateTime]}
                placeholder="Time"
                keyboardType="numeric"
                editable={false}
                value={scheduleDetails.time}
              />
            </View>

            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={false}
                onChange={onChange}
              />
            )}
          </View>

          <Text style={styles.label}>
            {/* Notice icon */}
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color="#bd0832"
              style={{ marginRight: 10 }}
            />
            By scheduling this payment, the amount will be deducted from your
            wallet and paid to the chama you have specified above at the
            frequency you specify
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={createNewSchedule}
            disabled={loading}
          >
            <LinearGradient
              colors={["#ed4746", "#A353BB"]}
              start={[0.1, 0.1]}
              end={[1, 1]}
              style={styles.btnBackground}
            >
              {loading && (
                <ActivityIndicator
                  size="small"
                  color="#fff"
                  style={{ marginRight: 10 }}
                />
              )}

              {loading ? (
                <Text style={styles.buttonText}>Wait a moment...</Text>
              ) : (
                <Text style={styles.buttonText}>Add schedule</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// [FirebaseError: Failed to get document because the client is offline.] handle offline

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
  },

  pickerStyle: {
    height: 50,
    width: "100%",
    color: "#344953",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 40,
  },

  inputError: {
    borderColor: "red",
  },

  dateTime: {
    color: "#000",
  },

  pickerButtons: {
    marginVertical: 20,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },

  btnBackground: {
    width: "100%",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },

  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 30,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
