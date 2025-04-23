import { StyleSheet, View } from "react-native";
import React from "react";
import { PersonType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "expo-router";
import { where } from "firebase/firestore";
import ScreenWrapper from "@/components/ScreenWrapper";
import useFetchData from "@/hooks/useFetchData";
import Typo from "@/components/Typo";
import Button from "@/components/Button";
import { colors } from "@/constants/theme";
import PersonCard from "@/components/PersonCard";
import { UserPlus } from "phosphor-react-native";
import Loading from "@/components/Loading";

type Props = {};

const HomeScreen = (props: Props) => {
  const { user } = useAuth();
  const router = useRouter();

  // Always call hooks at the top level, regardless of conditions
  const constraints = [where("uid", "==", user?.uid)];
  const {
    data: persons,
    loading: personsLoading,
    error: personsError,
  } = useFetchData<PersonType>("persons", constraints);

  // Show loading if user or user.uid is not available
  if (!user || !user.uid) {
    return <Loading />;
  }

  return (
    <ScreenWrapper>
      {/* header */}
      <View style={styles.header}>
        <View style={{ gap: 4, flexDirection: "row", alignItems: "center" }}>
          <Typo size={16} color={colors.neutral800} fontWeight={"500"}>
            Hello,
          </Typo>
          <Typo size={16} fontWeight={"700"} color={colors.primary}>
            {user?.name}
          </Typo>
        </View>
        <Button
          onPress={() => router.push("/(modals)/addPersonModal")}
          style={{ paddingHorizontal: 12, height: 42 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <UserPlus size={20} weight="fill" color={colors.white} />
            <Typo size={14} color={colors.white} fontWeight={"600"}>
              Add Person
            </Typo>
          </View>
        </Button>
      </View>

      {/* Persons List */}
      <View style={styles.container}>
        <Typo size={24} fontWeight="bold" color={colors.neutral900}>
          Persons List
        </Typo>
        <View style={{ flex: 1, marginTop: 10 }}>
          {personsLoading && <Loading />}
          {personsError && (
            <Typo size={16} color={colors.error}>
              Error: {personsError}
            </Typo>
          )}
          {persons &&
            persons.map((person, index) => (
              <PersonCard key={person.id} data={person} index={index} />
            ))}
          {!personsLoading && persons.length === 0 && (
            <Typo size={16} color={colors.neutral600}>
              No persons found.
            </Typo>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral300,
  },
});
