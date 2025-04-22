import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { PersonType } from "@/types";
import Typo from "./Typo";
import { colors } from "@/constants/theme";
import { currency } from "@/constants/currency";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

type Props = { data: PersonType; index: number };

const PersonCard = ({ data, index }: Props) => {
  const router = useRouter();
  const { id, name, totalAmount, remainingAmount, paidAmount } = data;

  const handlePress = () => {};

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        onPress={handlePress}
        key={id}
        style={styles.personCard}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            width: "65%",
          }}
        >
          <Typo
            size={18}
            fontWeight="700"
            color={colors.neutral800}
            style={{ wordWrap: "break-word" }}
          >
            {name}
          </Typo>
        </View>
        <View style={styles.amountContainer}>
          <Typo
            size={16}
            color={colors.white}
            style={{
              ...styles.status,
              backgroundColor:
                remainingAmount === 0 ? colors.success : colors.error,
            }}
          >
            {remainingAmount === 0 ? "Paid" : "Not Paid"}
          </Typo>
          {remainingAmount === 0 && (
            <Typo
              size={16}
              color={colors.neutral800}
              style={{ textAlign: "right" }}
              fontWeight="700"
            >
              {currency} {remainingAmount} /-
            </Typo>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  personCard: {
    height: 90,
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountContainer: {
    gap: 10,
    width: "30%",
  },
  status: {
    textAlign: "center",
    fontWeight: "bold",
    color: colors.white,
    paddingVertical: 5,
    borderRadius: 10,
  },
});

export default PersonCard;
