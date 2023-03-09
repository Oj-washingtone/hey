/**
 * Includes all the screens for authenticated user
 */

// import navigation container and navigation stack

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainNavigation from "./MainNavigation";
import MessagingUI from "../Screens/MessagingUI";

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
          name="Messaging UI"
          component={MessagingUI}
          // options={{
          //   tabBarBadge: 3,
          // }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
