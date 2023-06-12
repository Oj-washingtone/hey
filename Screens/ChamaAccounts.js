import React, { useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import Account from "./ChamaAccountingScreens/Account";
import Loans from "./ChamaAccountingScreens/Loans";
import Fines from "./ChamaAccountingScreens/Fines";
import Transactions from "./ChamaAccountingScreens/Transactions";

const Tab = createMaterialTopTabNavigator();

export default function ChamaAccount({ route, navigation }) {
  const chamaDetails = route.params;
  const chamaName = chamaDetails.chamaName;

  useEffect(() => {
    navigation.setOptions({
      title: chamaName + " Accounts",
    });
  }, [chamaName, navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitle: chamaName,
        tabBarStyle: { backgroundColor: "#fff" },
        tabBarIndicatorStyle: { backgroundColor: "#ed4746" },
      })}
    >
      <Tab.Screen
        name="Accounts"
        component={Account}
        initialParams={{ chamaDetails }}
      />
      <Tab.Screen
        name="Loans"
        component={Loans}
        initialParams={{ chamaDetails }}
      />
      <Tab.Screen
        name="Fines"
        component={Fines}
        initialParams={{ chamaDetails }}
      />
      <Tab.Screen
        name="Transactions"
        component={Transactions}
        initialParams={{ chamaDetails }}
      />
    </Tab.Navigator>
  );
}
