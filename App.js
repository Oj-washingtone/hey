import * as NavigationBar from "expo-navigation-bar";

import "./config/firebase";
import AppNavigator from "./navigation/index";

export default function App() {
  // change android navigation color
  NavigationBar.setBackgroundColorAsync("#fff");
  // change android navigation buttons color
  NavigationBar.setButtonStyleAsync("dark");

  return <AppNavigator />;
}
