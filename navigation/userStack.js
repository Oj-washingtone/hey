/**
 * Includes all the screens for authenticated user
 */

// import navigation container and navigation stack
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Ioicons from "react-native-vector-icons/Ionicons";
import MCIicons from "react-native-vector-icons/MaterialCommunityIcons";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainNavigation from "./MainNavigation";
import Chama from "../Screens/Chama";
import DepositToWallet from "../Screens/DepositToWallet";
import WithdrawFromWallet from "../Screens/WithdrawFromWallet";
import JoinChamaScreen from "../Screens/JoinChama";
import StartChamaScreen from "../Screens/StartChama";
import EditProfile from "../Screens/EditProfile";
import ChamaDetails from "../Screens/ChamaDetails";
import ScheduleScreen from "../Screens/SchedulePayment";
import AddScheduleForm from "../Screens/AddScheduleForm";
import ChamaBasicRulesForm from "../Screens/ChamaBasicRules";
import ChamaDetailsAnnouncement from "../Screens/ChamaDetailsAnnouncement";

// Header right component
import HeaderRight from "../Screens/myComponents/HeaderRight";

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home Stack"
          component={MainNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Chama"
          component={Chama}
          options={({ navigation }) => ({
            headerRight: () => <HeaderRight navigation={navigation} />,
            headerShown: false,
          })}
        />
        <Stack.Screen name="Withdraw" component={WithdrawFromWallet} />
        <Stack.Screen name="Deposit" component={DepositToWallet} />
        <Stack.Screen name="Join Chama" component={JoinChamaScreen} />
        <Stack.Screen name="Start Chama" component={StartChamaScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
        <Stack.Screen name="Chama Details" component={ChamaDetails} />
        <Stack.Screen name="Schedule Payment" component={ScheduleScreen} />
        <Stack.Screen
          name="Add Schedule Form"
          component={AddScheduleForm}
          options={{ headerTitle: "", headerTitleStyle: { display: "none" } }}
        />
        <Stack.Screen
          name="Chama Basic Rules"
          component={ChamaBasicRulesForm}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Chama Details Announcement"
          component={ChamaDetailsAnnouncement}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginLeft: 20,
  },
});
