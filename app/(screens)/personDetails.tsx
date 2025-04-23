import { ScrollView, StyleSheet, View } from "react-native";
import React from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import Typo from "@/components/Typo";
import PersonDetailsShow from "@/components/PersonDetailsShow";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlusCircle } from "phosphor-react-native";

type Props = {};

const PersonDetails = (props: Props) => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
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

        {/* Add Entry and Payment */}
        <View style={styles.addExpenseContainer}>
          {/* Add Entry */}
          <Button
            onPress={() => {
              router.push({
                pathname: "/(modals)/addEntry",
                params: {
                  personId: id,
                },
              });
            }}
            style={{
              height: 42,
              paddingHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <PlusCircle size={24} color={colors.white} />
            <Typo size={18} fontWeight={"800"} color={colors.white}>
              Entry
            </Typo>
          </Button>
          {/* Add Payment */}
          <Button
            onPress={() => {}}
            style={{
              height: 42,
              paddingHorizontal: 10,
              backgroundColor: colors.success,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <PlusCircle size={24} color={colors.white} />
            <Typo size={18} fontWeight={"800"} color={colors.white}>
              Payment
            </Typo>
          </Button>
        </View>
        <ScrollView>
          <View>
            <Typo size={18} fontWeight={"800"} color={colors.neutral800}>
              Hariom
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
  addExpenseContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default PersonDetails;
