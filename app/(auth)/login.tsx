import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "expo-router";

type Props = {};

const LoginScreen = (props: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields");
      return;
    }
    try {
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);

      // Extract a more user-friendly error message
      let errorMessage = "Invalid email or password";

      if (error.message) {
        if (error.message.includes("Invalid credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("User not found")) {
          errorMessage = "No account found with this email";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address";
        }
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Loading..." : "Login"}
        onPress={handleLogin}
        disabled={loading}
      />
      <Link href="/(auth)/signup" style={styles.link}>
        Don't have an account? Sign up
      </Link>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  link: {
    marginTop: 15,
    color: "blue",
  },
});
