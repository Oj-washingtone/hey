import { db } from "../../config/firebase";
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

import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  FlatList,
  ScrollView,
  Image,
} from "react-native";

import { PieChart, LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useAuthentication } from "../../utils/hooks/useAuthentication";

export default function Account({ route }) {
  const user = useAuthentication();
  const userId = user?.uid;
  const chamaDetails = route.params.chamaDetails;

  const chamaCode = chamaDetails.chamaCode;

  const accounting = chamaDetails.accounting;
  const myTotals = accounting[0].contributionTotal;

  // Calculate accountingTotal
  let accountingTotal = 0;

  accounting.forEach((member) => {
    const { contributionTotal, loanTotal, fineTotal } = member;
    accountingTotal += contributionTotal + loanTotal + fineTotal;
  });

  let myPercentage = 0;
  if (accountingTotal > 0 && myTotals > 0) {
    myPercentage = (myTotals / accountingTotal) * 100;
  }

  // total member contributions
  let totalContributions = 0;
  accounting.forEach((member) => {
    const { contributionTotal } = member;
    totalContributions += contributionTotal;
  });

  // parcentage of contributions
  let contributionPercentage = 0;

  if (accountingTotal > 0 && totalContributions > 0) {
    contributionPercentage = (totalContributions / accountingTotal) * 100;
  }

  // Calculate totalfine
  let totalFine = 0;
  accounting.forEach((member) => {
    const { fineTotal } = member;
    totalFine += fineTotal;
  });

  // parcentage of fines

  let finePercentage = 0;
  if (accountingTotal > 0 && totalFine > 0) {
    finePercentage = (totalFine / accountingTotal) * 100;
  }

  // total interest on loans
  let totalInterest = 0;
  accounting.forEach((member) => {
    const { loanTotal } = member;
    totalInterest += loanTotal;
  });

  // parcentage of interest on loans

  let interestPercentage = 0;
  if (accountingTotal > 0 && totalInterest > 0) {
    interestPercentage = (totalInterest / accountingTotal) * 100;
  }

  // the pie chart data
  const data = [
    {
      name: "Savings",
      population: contributionPercentage,
      color: "#42f599",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    },
    {
      name: "Interest on loans",
      population: interestPercentage,
      color: "#f54263",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    },
    {
      name: "Fines",
      population: finePercentage,
      color: "#42e0f5",
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    },
  ];

  // /**
  //  * To calculate the accountingTotal which represents the sum of totals for all members for every month, you can iterate over the accounting array and calculate the sum of contributionTotal, loanTotal, and fineTotal for each member. Then, you can aggregate the totals for each month.
  //  *
  //  */

  const calculateMonthlyTotals = () => {
    const monthlyTotals = {};

    // Iterate over the accounting array to calculate the totals for each month
    chamaDetails.accounting.forEach((member) => {
      member.contributions.forEach((contribution) => {
        const contributionDate = new Date(
          contribution.timestamp.seconds * 1000 +
            contribution.timestamp.nanoseconds / 1000000
        );
        const monthYear = contributionDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        if (!monthlyTotals[monthYear]) {
          monthlyTotals[monthYear] = {
            contributionTotal: 0,
            loanTotal: 0,
            fineTotal: 0,
          };
        }
        monthlyTotals[monthYear].contributionTotal += contribution.amount;
      });

      member.loans.forEach((loan) => {
        const loanDate = new Date(
          loan.timestamp.seconds * 1000 + loan.timestamp.nanoseconds / 1000000
        );
        const monthYear = loanDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        monthlyTotals[monthYear].loanTotal += loan.amount;
      });

      member.fines.forEach((fine) => {
        const fineDate = new Date(
          fine.timestamp.seconds * 1000 + fine.timestamp.nanoseconds / 1000000
        );
        const monthYear = fineDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
        monthlyTotals[monthYear].fineTotal += fine.amount;
      });
    });

    return monthlyTotals;
  };

  const accountingTotals = calculateMonthlyTotals();

  // Extract month-year labels and data from accountingTotals
  const labels = Object.keys(accountingTotals);
  const contributionData = Object.values(accountingTotals).map(
    (total) => total.contributionTotal
  );
  const loanData = Object.values(accountingTotals).map(
    (total) => total.loanTotal
  );
  const fineData = Object.values(accountingTotals).map(
    (total) => total.fineTotal
  );

  const timeAnalysis = {
    labels,
    datasets: [
      {
        data: contributionData,
        color: (opacity = 1) => `rgba(66, 245, 153, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: loanData,
        color: (opacity = 1) => `rgba(245, 66, 99, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: fineData,
        color: (opacity = 1) => `rgba(66, 224, 245, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Assuming 'chamaDetails' is the object containing chama details

  const [membersWithoutContribution, setMembersWithoutContribution] = useState(
    []
  );

  const getMembersWithoutContribution = async () => {
    const members = chamaDetails.accounting.filter(
      (member) => member.contributionTotal === 0
    );

    const memberDetails = [];

    for (const member of members) {
      const memberRef = doc(db, "users", member.memberId);
      const memberSnapshot = await getDoc(memberRef);

      if (memberSnapshot.exists()) {
        const memberData = memberSnapshot.data();
        memberDetails.push(memberData);
      }
    }

    return memberDetails;
  };

  useEffect(() => {
    getMembersWithoutContribution()
      .then((members) => {
        setMembersWithoutContribution(members);
      })
      .catch((error) => {
        console.error("Error getting members without contribution:", error);
      });
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Total</Text>
      <View style={styles.balance}>
        <Text style={styles.currency}>Kes.</Text>
        <Text style={styles.amount}> {accountingTotal}.</Text>
        <Text style={styles.cents}>00</Text>
      </View>

      <Text style={styles.sectionTitle}>Income by category</Text>

      <View style={styles.incomeCategory}>
        <PieChart
          data={data}
          width={400}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          center={[10, 10]}
          hasLegend={true}
          doughnut={true}
          doughnutPercentage={0.6} // Adjust the inner radius of the doughnut (0.6 means 60% of the chart is empty)
          strokeWidth={2}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>My bcontribution</Text>
      <View style={styles.balancePersonal}>
        <View style={styles.accountBreakdown}>
          <Text style={styles.statistics}>{myTotals}</Text>
          <Text style={styles.balanceLabel}>contribution</Text>
        </View>
        <View style={styles.accountBreakdown}>
          <Text style={styles.statistics}>{myPercentage}%</Text>
          <Text style={styles.balanceLabel}>Accounts for</Text>
        </View>

        <View style={styles.accountBreakdown}>
          <Text style={styles.statistics}>0</Text>
          <Text style={styles.balanceLabel}>My earnings</Text>
        </View>

        <View style={styles.accountBreakdown}>
          <Text style={styles.statistics}>0%</Text>
          <Text style={styles.balanceLabel}>Earnings %</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pending contributions</Text>

      {membersWithoutContribution.length === 0 ? (
        <Text style={styles.noPendingContributions}>
          No pending contributions
        </Text>
      ) : (
        membersWithoutContribution.map((member) => (
          <View key={member.userId} style={styles.memberListItem}>
            <View style={styles.memberDpWrapper}>
              {member.profilePicture === "" ? (
                <MaterialCommunityIcons
                  name="account"
                  size={23}
                  color="#D23D74"
                />
              ) : (
                <Image
                  source={{ uri: member.profilePicture }}
                  style={styles.memberDP}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>
                {member.userId === userId ? "You" : member.fullName}{" "}
                {member.role === "admin" && (
                  <Text style={{ color: "green" }}>Admin</Text>
                )}
              </Text>
              <Text>{member.phoneNumber}</Text>
            </View>
            <View style={styles.financeStatus}>
              <View style={[styles.statusDot, { backgroundColor: "#ccc" }]} />
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Monthly analysis</Text>
      <View style={styles.periodContributionAnalysis}>
        <Text style={{ alignSelf: "flex-start", marginBottom: 10 }}>
          Amount
        </Text>
        <LineChart
          data={timeAnalysis}
          width={400}
          height={200}
          chartConfig={{
            backgroundColor: "#f2f3f5",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(189, 13, 240, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
        />
        <Text style={{ alignSelf: "center", marginTop: 10 }}>Months</Text>
      </View>

      <Text style={styles.sectionTitle}>Members with pending contribution</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingBottom: 100,
  },

  balance: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  periodContributionAnalysis: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },

  currency: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ed4746",
  },

  amount: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#ed4746",
  },

  cents: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ed4746",
  },

  myPercentage: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ed4746",
  },

  balancePersonal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 40,
  },

  balanceLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ed4746",
    textAlign: "center",
  },

  statistics: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },

  incomeCategory: {
    justifyContent: "center",
    alignItems: "center",
  },

  memberListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    padding: 10,
    borderBottomColor: "#ccc",
  },
  memberDpWrapper: {
    marginRight: 20,
  },
  memberDP: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  financeStatus: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  noPendingContributions: {
    marginTop: 20,
    marginBottom: 20,
  },
});
