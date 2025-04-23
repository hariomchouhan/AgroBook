import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";

type Props = {};

const ModalWrapper = ({
  style,
  children,
  bg = colors.background,
}: ModalWrapperProps) => {
  return (
    <View style={[styles.container, { backgroundColor: bg }, style && style]}>
      {children}
    </View>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 15 : 50,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
  },
});
