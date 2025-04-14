import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "expo-router";

type Props = {};

const SignupScreen = (props: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signup, loading } = useAuth();

  const handleSignup = async () => {
    if (!name || !email || !password) {
        Alert.alert('Missing Fields', 'Please fill in all fields');
        return;
    }
    if (password.length < 8) {
        Alert.alert('Password too short', 'Password must be at least 8 characters');
        return;
    }
    try {
        await signup(name, email, password);
    } catch (error: any) {
        console.error('Signup error:', error);
        
        // Extract a more user-friendly error message
        let errorMessage = 'Failed to create account';
        
        if (error.message) {
            if (error.message.includes('already exists')) {
                errorMessage = 'An account with this email already exists';
            } else if (error.message.includes('Invalid email')) {
                errorMessage = 'Please enter a valid email address';
            } else if (error.message.includes('password')) {
                errorMessage = 'Password must be at least 8 characters';
            }
        }
        
        Alert.alert('Signup Failed', errorMessage);
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
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
        title={loading ? "Loading..." : "Sign Up"} 
        onPress={handleSignup} 
        disabled={loading} 
      />
      <Link href="/(auth)/login" style={styles.link}>
        Already have an account? Login
      </Link>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 15,
    },
    link: {
      marginTop: 15,
      color: 'blue',
    },
  });