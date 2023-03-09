import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// icons
import FontAwesome from "react-native-vector-icons/FontAwesome";

// import screens
import HomeScreen from "../Screens/HomeScreen";
import Chats from "../Screens/Chats";
import UserAccount from "../Screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function MainNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "home";
          } else if (route.name === "Inbox") {
            iconName = focused ? "comments" : "comments";
          } else if (route.name === "Account") {
            iconName = focused ? "user" : "user";
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog";
          }

          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        // change the color of the tab bar when active
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          // Add logo to the tab bar
          title: "ChamaSmart",
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={Chats}
        // options={{
        //   tabBarBadge: 3,
        // }}
      />
      <Tab.Screen name="Account" component={UserAccount} />
    </Tab.Navigator>
  );
}
