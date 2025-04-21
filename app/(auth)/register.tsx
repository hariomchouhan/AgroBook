import { Alert, Pressable, StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import { colors } from "@/constants/theme";
import { At, Lock, User } from "phosphor-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/authContext";
import Typo from "@/components/Typo";
import ScreenWrapper from "@/components/ScreenWrapper";
import Input from "@/components/Input";
import Button from "@/components/Button";

type Props = {};

const Register = (props: Props) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign up", "Please fill the all fields");
      return;
    }
    setIsLoading(true);
    const res = await registerUser(
      emailRef.current,
      passwordRef.current,
      nameRef.current
    );
    setIsLoading(false);
    console.log("register result: ", res);
    if (!res.success) {
      Alert.alert("Sign up", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={{ gap: 5, marginTop: 20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let's
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Enter your name"
            onChange={(event) => (nameRef.current = event.nativeEvent.text)}
            icon={<User size={26} color={colors.neutral800} weight="fill" />}
          />
          <Input
            placeholder="Enter your email"
            onChange={(event) => (emailRef.current = event.nativeEvent.text)}
            icon={<At size={26} color={colors.neutral800} weight="fill" />}
            autoCapitalize="none"
          />
          <Input
            placeholder="Enter your password"
            secureTextEntry
            onChange={(event) => (passwordRef.current = event.nativeEvent.text)}
            icon={<Lock size={26} color={colors.neutral800} weight="fill" />}
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typo fontWeight={"700"} color={colors.white} size={21}>
              Sign Up
            </Typo>
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Login
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: 20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: 15,
  },
});

export default Register;
