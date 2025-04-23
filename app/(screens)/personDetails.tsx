import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import Typo from "@/components/Typo";
import { useLocalSearchParams } from "expo-router";

type Props = {};

const PersonDetails = (props: Props) => {
  const { name, totalAmount, remainingAmount, paidAmount } =
    useLocalSearchParams();
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Person Details"
          leftIcon={<BackButton />}
          style={{ marginBottom: 10 }}
        />
        <View style={styles.personDetailsContainer}>
          <View style={styles.personDetailsNameContainer}>
            <Typo size={22} fontWeight={"800"} color={colors.primary}>
              {name}
            </Typo>
          </View>
          <View style={styles.personDetailsAmountContainer}>
            <View style={styles.personDetailsBodyItem}>
              <Typo size={18} fontWeight={"800"} color={colors.neutral800}>
                Total :{" "}
                <Typo size={18} fontWeight={"600"} color={colors.neutral800}>
                  {Number(totalAmount)}
                </Typo>
              </Typo>
            </View>
            <View style={styles.personDetailsBodyItem}>
              <Typo size={18} fontWeight={"800"} color={colors.neutral800}>
                Paid :{" "}
                <Typo size={18} fontWeight={"600"} color={colors.neutral800}>
                  {Number(paidAmount)}
                </Typo>
              </Typo>
            </View>
            <View style={styles.personDetailsBodyItem}>
              <Typo size={18} fontWeight={"800"} color={colors.neutral800}>
                Remaining :{" "}
                <Typo
                  size={18}
                  fontWeight={"600"}
                  color={
                    Number(remainingAmount) === 0
                      ? colors.neutral800
                      : colors.error
                  }
                >
                  {Number(remainingAmount)}
                </Typo>
              </Typo>
            </View>
          </View>
        </View>
        <ScrollView>
          <View>
            <Typo size={18} fontWeight={"800"} color={colors.neutral800}>
              Add Expense
            </Typo>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  personDetailsContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.neutral200,
    marginBottom: 20,
  },
  personDetailsNameContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  personDetailsAmountContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 10,
    backgroundColor: colors.white,
    marginVertical: 20,
  },
  personDetailsBodyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PersonDetails;
