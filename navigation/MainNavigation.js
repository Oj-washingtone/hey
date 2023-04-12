import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// icons
import { MaterialCommunityIcons } from "react-native-vector-icons";

// import screens
import HomeScreen from "../Screens/HomeScreen";
import Chats from "../Screens/Chats";
import UserAccount from "../Screens/ProfileScreen";
import Wallet from "../Screens/Wallet";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "view-dashboard" : "view-dashboard-outline";
          } else if (route.name === "My Chamas") {
            iconName = focused
              ? "account-multiple"
              : "account-multiple-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "account-circle" : "account-circle-outline";
          } else if (route.name === "Wallet") {
            iconName = focused ? "wallet" : "wallet-outline";
          }

          // Use icons from material community icons
          return (
            <MaterialCommunityIcons
              name={iconName}
              size={size}
              color={focused ? "#D23D74" : "gray"}
            />
          );
        },

        // change the color of the tab bar when active
        tabBarActiveTintColor: "#D23D74",
        tabBarInactiveTintColor: "#000",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="My Chamas"
        component={Chats}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Account" component={UserAccount} />
    </Tab.Navigator>
  );
}
