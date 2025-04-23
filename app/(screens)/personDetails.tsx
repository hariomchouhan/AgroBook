import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import Typo from "@/components/Typo";
import PersonDetailsShow from "@/components/PersonDetailsShow";

type Props = {};

const PersonDetails = (props: Props) => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Person Details"
          leftIcon={<BackButton />}
          style={{ marginBottom: 10 }}
        />

        {/* Person Details */}
        <PersonDetailsShow />

        {/* Add Expense */}
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
});

export default PersonDetails;
