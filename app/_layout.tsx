import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./(tabs)";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const NativeStack = createNativeStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    SatoshiBlack: require("../assets/fonts/Satoshi-Black.otf"),
    SatoshiMedium: require("../assets/fonts/Satoshi-Medium.otf"),
    SatoshiRegular: require("../assets/fonts/Satoshi-Regular.otf"),
    SatoshiLight: require("../assets/fonts/Satoshi-Light.otf"),
    SatoshiBold: require("../assets/fonts/Satoshi-Bold.otf"),
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
    <SafeAreaProvider>
      <NativeStack.Navigator>
        <NativeStack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
      </NativeStack.Navigator>
    </SafeAreaProvider>
  );
}
