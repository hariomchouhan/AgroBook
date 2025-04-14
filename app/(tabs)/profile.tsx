import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { user, logout, loading } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user && (
        <>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>User ID: {user.$id}</Text>
        </>
      )}
      <Button 
        title={loading ? "Loading..." : "Logout"} 
        onPress={logout} 
        disabled={loading} 
      />
    </View>
  );
}

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
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});