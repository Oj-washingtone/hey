import * as NavigationBar from "expo-navigation-bar";

import "./config/firebase";
import AppNavigator from "./navigation/index";
import React, { useState, useEffect } from "react";

// impoet splash screen
import SplashScreen from "./Screens/SplashScreen";

export default function App() {
  const [appReady, setAppReady] = useState(false);

  // change android navigation color
  NavigationBar.setBackgroundColorAsync("#fff");
  // change android navigation buttons color
  NavigationBar.setButtonStyleAsync("dark");

  useEffect(() => {
    // Simulate app loading time
    setTimeout(() => {
      setAppReady(true);
    }, 3000); // Adjust the duration as needed
  }, []);

  return appReady ? <AppNavigator /> : <SplashScreen />;
}
