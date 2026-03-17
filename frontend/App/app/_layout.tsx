import { AuthProvider } from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import ServerConfigModal from "@/components/debug/ServerConfigModal";
import { setApiBaseUrl } from "@/lib/api/apiClient";
import { useTheme } from "@/hooks/useTheme";
import {
  ServerConfigProvider,
  useServerConfig,
} from "@/context/ServerConfigContext";
// https://sticket-undelinquently-caterina.ngrok-free.dev
const SERVER_URL = "https://sticket-undelinquently-caterina.ngrok-free.dev";
setApiBaseUrl(SERVER_URL);

function Root() {
  const { loading } = useAuth();
  const { colors } = useTheme(); // Get colors here
  
  // Pass colors to the style generator
  const styles = getStyles(colors); 

  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <TypedActivityIndicator size="large" color={colors.primary} />
  //     </View>
  //   );
  // }

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

function AppContent() {
  const { isModalVisible, hideModal, saveIpAddress, currentIp } = useServerConfig();

  const handleSkip = () => {
    hideModal();
  };

  return (
    <>
      <AuthProvider>
        <Root />
      </AuthProvider>

      <ServerConfigModal
        visible={isModalVisible}
        onSave={saveIpAddress}
        onSkip={handleSkip}
        currentIp={currentIp}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ServerConfigProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ServerConfigProvider>
  );
}

// Fixed: Accept 'colors' as an argument instead of calling useTheme() inside
export const getStyles = (colors: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
  });
};