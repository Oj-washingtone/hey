/**
 * Includes all the screens for authenticated user
 */

// import navigation container and navigation stack

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainNavigation from "./MainNavigation";
import Chama from "../Screens/Chama";
import DepositToWallet from "../Screens/DepositToWallet";
import WithdrawFromWallet from "../Screens/WithdrawFromWallet";
import JoinChamaScreen from "../Screens/JoinChama";
import StartChamaScreen from "../Screens/StartChama";
import EditProfile from "../Screens/EditProfile";

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
          // options={{
          //   tabBarBadge: 3,
          // }}
        />
        <Stack.Screen name="Withdraw" component={WithdrawFromWallet} />
        <Stack.Screen name="Deposit" component={DepositToWallet} />
        <Stack.Screen name="Join Chama" component={JoinChamaScreen} />
        <Stack.Screen name="Start Chama" component={StartChamaScreen} />
        <Stack.Screen name="Edit Profile" component={EditProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
