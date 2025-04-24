import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import { PersonType } from "@/types";

type Props = {
  person: PersonType;
};

const PersonDetailsShow = ({ person }: Props) => {
  const { name, totalAmount, remainingAmount, paidAmount } = person;
  
  return (
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
                Number(remainingAmount) === 0 ? colors.neutral800 : colors.error
              }
            >
              {Number(remainingAmount)}
            </Typo>
          </Typo>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default PersonDetailsShow;
