import { ScrollView, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "@/components/ScreenWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import { colors } from "@/constants/theme";
import Typo from "@/components/Typo";
import PersonDetailsShow from "@/components/PersonDetailsShow";
import Button from "@/components/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PlusCircle } from "phosphor-react-native";
import { EntryType, PersonType } from "@/types";
import useFetchData from "@/hooks/useFetchData";
import { where } from "firebase/firestore";
import EntryCard from "@/components/EntryCard";
import { getPersonById } from "@/services/personService";

type Props = {};

const PersonDetails = (props: Props) => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  console.log("id", id);

  // State for person data
  const [personData, setPersonData] = useState<PersonType | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch person data
  useEffect(() => {
    const fetchPerson = async () => {
      if (!id) return;
      try {
        const data = await getPersonById(id as string);
        setPersonData(data);
      } catch (error) {
        console.error("Error fetching person:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);

  // Always call hooks at the top level, regardless of conditions
  const constraints = [where("personId", "==", id)];
  // Try different field names for the person query
  const personConstraints = [
    where("id", "==", id),
    where("uid", "==", id),
    where("documentId", "==", id)
  ];
  console.log("personConstraints", personConstraints);
  
  const {
    data: entries,
    loading: entriesLoading,
    error: entriesError,
  } = useFetchData<EntryType>("entries", constraints);

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Person Details"
          leftIcon={<BackButton />}
          style={{ marginBottom: 10 }}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <Typo>Loading person details...</Typo>
          </View>
        ) : personData ? (
          <PersonDetailsShow person={personData} />
        ) : (
          <View style={styles.notFoundContainer}>
            <Typo>Person not found</Typo>
          </View>
        )}
       

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
        <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
            {entries?.map((entry) => (
              <EntryCard
              data={entry}
              key={entry.id}
            />
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PersonDetails;
