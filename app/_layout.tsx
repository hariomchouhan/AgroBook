import React from "react";
import { useFonts } from "expo-font";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider } from "@/contexts/AuthContext";
// import { DataProvider } from "@/contexts/DataContext";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuth } from "@/hooks/useAuth";
import { DataProvider } from "@/contexts/DataContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  useEffect(() => {
    if (loading) return;
    
    const inAuthGroup = segments[0] === "(auth)";
    
    // Use setTimeout to delay navigation until after the component is fully mounted
    setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        // Redirect to login if not authenticated and not already in auth group
        router.replace("/(auth)/login");
      } else if (isAuthenticated && inAuthGroup) {
        // Redirect to home if authenticated and in auth group
        router.replace("/(tabs)");
      }
    }, 100);
  }, [isAuthenticated, loading, segments]);
  
  // If still loading, don't render anything
  if (loading) {
    return null;
  }
  
  return <>{children}</>;
}

function RootLayoutNav() {
  return (
    <AuthProvider>
      <AuthGuard>
        <DataProvider>
          <ScreenWrapper>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)"/>
              <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
              <Stack.Screen name="(auth)/signup" options={{ title: 'Sign Up' }} />
              <Stack.Screen name="entries/new" options={{ title: 'New Entry' }} />
              <Stack.Screen name="entries/[id]" options={{ title: 'Entry Details' }} />
              <Stack.Screen name="entries/[id]/payments" options={{ title: 'Payments' }} />
              <Stack.Screen name="entries/[id]/payments/new" options={{ title: 'Add Payment' }} />
              {/* Add more non-tab screen routes here */}
            </Stack>
          </ScreenWrapper>
        </DataProvider>
      </AuthGuard>
    </AuthProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <RootLayoutNav />
    </>
  );
}
