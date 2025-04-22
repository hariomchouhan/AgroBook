import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { colors } from "@/constants/theme";

type Props = {};

const index = (props: Props) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("@/assets/images/splash-icon.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
    borderRadius: 20,
  },
});

export default index;
