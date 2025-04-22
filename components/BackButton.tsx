import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import { colors } from "@/constants/theme";

type Props = {};

const BackButton = ({ style, iconSize = 26 }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[styles.button, style]}
    >
      <CaretLeft size={iconSize} color={colors.white} weight="bold" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    borderRadius: 12,
    borderCurve: "continuous",
    padding: 5,
  },
});

export default BackButton;
