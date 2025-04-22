import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { PersonType } from "@/types";
import { useAuth } from "@/contexts/authContext";
import ModalWrapper from "@/components/ModalWrapper";
import Header from "@/components/Header";
import BackButton from "@/components/BackButton";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { createPerson } from "@/services/personService";

type Props = {};

const AddPersonModal = (props: Props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [person, setPerson] = useState<PersonType>({
    name: "",
    uid: user?.uid,
    totalAmount: 0,
    remainingAmount: 0,
    paidAmount: 0,
    date: new Date(),
  });

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!person.name) {
      Alert.alert("Add Person", "Please fill the name field");
      return;
    }

    setLoading(true);

    const res = await createPerson(person);

    setLoading(false);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Add Person: ", res.msg);
    }
  };
  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header
          title={"Add Person"}
          leftIcon={<BackButton />}
          style={{ marginBottom: 10 }}
        />

        {/* form */}
        <ScrollView
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral800} size={16} fontWeight="600">
              Full Name
            </Typo>
            <Input
              placeholder="Enter Name"
              keyboardType="default"
              value={person.name}
              onChangeText={(value) =>
                setPerson({
                  ...person,
                  name: value,
                })
              }
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.white} fontWeight={"700"}>
            Submit
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default AddPersonModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    gap: 20,
    paddingVertical: 15,
    paddingBottom: 40,
  },
  inputContainer: {
    gap: 10,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
    paddingTop: 15,
    borderTopColor: colors.neutral700,
    marginBottom: 5,
    borderTopWidth: 1,
  },
});
