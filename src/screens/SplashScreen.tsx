import * as React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '../services/ThemeService';

export default function SplashScreen() {
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={[styles.centered, { backgroundColor: colors.background }]}>
          <Image source={require('../assets/favicon.png')} style={{ width: 200, height: 200, marginBottom: 20 }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>Pikkro Admin</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
}); 