import { db } from "../config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "react-native-vector-icons";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuthentication } from "../utils/hooks/useAuthentication";
import { getAuth, getIdToken, signOut } from "firebase/auth";

// import use navigation hook
import { useNavigation } from "@react-navigation/native";

export default function ChamaBasicRulesForm(props) {
  const navigation = useNavigation();

  const route = useRoute();
  const { chamaCode, chamaName, chamaDescription, chamaPassword } =
    route.params;

  const user = useAuthentication();
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  const [rules, setRules] = useState({
    // contribution
    contributionAmount: "",
    contributionFrequency: "",

    // Borrowing
    borrowingLimit: "",
    borrowingInterestRate: "",
    borrowingDuration: "",
    payBackMethod: "",
    borrowingPenalty: "",
    loanAprovalModel: "",

    //Profit destribution
    financialCycleEnds: "",
    financialCycleEndsTime: "",
    ploughBackRate: "",
    ratePerMember: "",
  });

  const [selectedLanguage, setSelectedLanguage] = useState();

  //   Date picker starts
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setRules({
      ...rules,
      financialCycleEnds: selectedDate.toDateString(),
      financialCycleEndsTime: selectedDate.toLocaleTimeString(),
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

  //   date picker ends

  //   Save rules
  const handleApplyRules = async () => {
    // set loading
    setLoading(true);

    // Get the chama document reference
    const chamaRef = doc(db, "chamas", chamaCode.toString());

    // Update the chamaRules field with the provided details
    try {
      await updateDoc(chamaRef, {
        chamaRules: rules,
      });

      // Rest of your code...
      setLoading(false);

      // navigate to Chama Details Announcement screen with chama code
      navigation.replace("Chama Details Announcement", {
        chamaCode: chamaCode,
        chamaName: chamaName,
        chamaDescription: chamaDescription,
        chamaPassword: chamaPassword,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroller} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.headerText}>Create the Basic Chama Rules</Text>
          <View style={styles.form}>
            <Text style={styles.titles}>Contribution</Text>
            <Text style={styles.subTitles}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount in KES"
              keyboardType="numeric"
              value={rules.contributionAmount}
              onChangeText={(text) =>
                setRules({ ...rules, contributionAmount: text })
              }
            />
            <Text style={styles.subTitles}>Frequency</Text>
            <Picker
              selectedValue={rules.contributionFrequency}
              onValueChange={(itemValue, itemIndex) =>
                setRules({ ...rules, contributionFrequency: itemValue })
              }
            >
              <Picker.Item label="Select frequency" value="" />
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Monthly" value="monthly" />
            </Picker>
          </View>

          <View style={styles.form}>
            <Text style={styles.titles}>Borrowing</Text>
            <Text style={styles.subTitles}>Borrowing Limit</Text>
            <Picker
              selectedValue={rules.borrowingLimit}
              onValueChange={(itemValue, itemIndex) =>
                setRules({ ...rules, borrowingLimit: itemValue })
              }
            >
              <Picker.Item label="Select Limit" value="" />
              <Picker.Item label="0.7 X Saving" value="equal to saving" />
              <Picker.Item label="Equal to saving" value="Equal to saving" />
              <Picker.Item label="1.3 x Saving" value="1.3 x Saving" />
              <Picker.Item label="1.5 x Saving" value="1.5 x Saving" />
              <Picker.Item label="2 x Saving" value="2 x Saving" />
              <Picker.Item label="Other" value="other" />
            </Picker>

            {rules.borrowingLimit === "other" && (
              <TextInput
                style={styles.input}
                placeholder="Set Borrowing rate "
                keyboardType="numeric"
                onChangeText={(text) =>
                  setRules({ ...rules, borrowingLimit: text })
                }
              />
            )}

            <Text style={styles.subTitles}>Rate on loan</Text>
            <TextInput
              style={styles.input}
              placeholder="Interest rate "
              keyboardType="numeric"
              onChangeText={(text) =>
                setRules({ ...rules, borrowingInterestRate: text })
              }
              value={rules.borrowingInterestRate}
            />
            <Text style={styles.subTitles}>
              Payable after how many months ?
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Months"
              keyboardType="numeric"
              onChangeText={(text) =>
                setRules({ ...rules, borrowingDuration: text })
              }
              value={rules.borrowingDuration}
            />

            <Text style={styles.subTitles}>Paying Model</Text>
            <Picker
              selectedValue={rules.payBackMethod}
              onValueChange={(itemValue, itemIndex) =>
                setRules({ ...rules, payBackMethod: itemValue })
              }
            >
              <Picker.Item label="Select payback Model" value="" />
              <Picker.Item label="In Instalments" value="instalments" />
              <Picker.Item label="As lump sum" value="as lump sum" />
            </Picker>

            <Text style={styles.subTitles}>% of fine for defaulting ?</Text>
            <TextInput
              style={styles.input}
              placeholder="Set penalty"
              keyboardType="numeric"
              onChangeText={(text) =>
                setRules({ ...rules, borrowingPenalty: text })
              }
              value={rules.borrowingPenalty}
            />

            <Text style={styles.subTitles}>Loan approval ?</Text>
            <Picker
              selectedValue={rules.loanAprovalModel}
              onValueChange={(itemValue, itemIndex) =>
                setRules({ ...rules, loanAprovalModel: itemValue })
              }
            >
              <Picker.Item label="Select approval model" value="" />
              <Picker.Item label="Automatic" value="automatic" />
              <Picker.Item
                label="Approval by members"
                value="Approval by members"
              />
            </Picker>
          </View>

          <View style={styles.form}>
            <Text style={styles.titles}>Profit Distribution</Text>
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
                  <Text style={styles.inputText}>Finacial cycle ends on </Text>
                </TouchableOpacity>
                {/* Show input if  financialCycleEnds is not empty*/}
                {rules.financialCycleEnds !== "" && (
                  <TextInput
                    style={[styles.input, styles.dateTime]}
                    placeholder="Start date"
                    keyboardType="numeric"
                    editable={false}
                    value={rules.financialCycleEnds}
                    disabled={true}
                  />
                )}
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
                  <Text style={styles.inputText}>At what time</Text>
                </TouchableOpacity>
                {/* Show input if  financialCycleEndsTime is not empty*/}
                {rules.financialCycleEndsTime !== "" && (
                  <TextInput
                    style={[styles.input, styles.dateTime]}
                    placeholder="Time"
                    keyboardType="numeric"
                    editable={false}
                    value={rules.financialCycleEndsTime}
                    disabled={true}
                  />
                )}
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
            <Text style={styles.subTitles}>Ploughed back rate</Text>
            <TextInput
              style={styles.input}
              placeholder="Ploughed back rate"
              keyboardType="numeric"
              value={rules.ploughBackRate}
              onChangeText={(text) =>
                setRules({ ...rules, ploughBackRate: text })
              }
            />
            <Text style={styles.subTitles}>Rate for each member</Text>
            <TextInput
              style={styles.input}
              placeholder="Rate for each member"
              keyboardType="numeric"
              value={rules.ratePerMember}
              onChangeText={(text) =>
                setRules({ ...rules, ratePerMember: text })
              }
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonFinish}
          onPress={handleApplyRules}
          activeOpacity={0.5}
        >
          {/* activity indicator */}
          {loading && <ActivityIndicator color="#fff" />}
          <Text style={styles.buttonText}>
            {loading ? "Please wait..." : "Finish setting up"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 50,
  },

  form: {
    margin: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },

  titles: {
    fontSize: 16,
    marginBottom: 20,
  },

  buttonFinish: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#ed4746",
    marginBottom: 20,
    marginHorizontal: "5%",
    textAlign: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
  },

  subTitles: {
    fontSize: 13,
    marginBottom: 10,
    marginTop: 20,
    color: "gray",
  },

  dateTime: {
    color: "#000",
  },

  pickerButtons: {
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  inputText: {
    marginLeft: 10,
  },

  headerText: {
    fontSize: 25,
    color: "#000",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
