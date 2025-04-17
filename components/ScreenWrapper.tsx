import { Dimensions, Platform, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "@/constants/Colors";

type Props = {};

const ScreenWrapper = ({ style, children }: any) => {
  const { height } = Dimensions.get("window");

  let paddingTop = Platform.OS === "ios" ? height * 0.06 : height * 0.04;
  return (
    <View
      style={[
        {
          paddingTop,
          flex: 1,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.background} />
      {children}
    </View>
  );
};

export default ScreenWrapper;

const styles = StyleSheet.create({});