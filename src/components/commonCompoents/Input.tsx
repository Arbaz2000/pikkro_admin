import * as React from 'react';
import { TextInput, StyleSheet, TextInputProps, View, Text } from 'react-native';
import { useTheme } from '../../services/ThemeService';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 18 }}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isFocused ? colors.background : colors.card,
            borderColor: isFocused ? colors.primary : colors.text,
            color: colors.text,
          },
          style,
        ]}
        placeholderTextColor={colors.secondary}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: { fontWeight: 'bold', marginBottom: 6, color: '#222', fontSize: 15 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f4f6fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  inputFocused: {
    borderColor: '#007bff',
    backgroundColor: '#fff',
  },
  error: { color: 'red', marginTop: 4, fontSize: 12 },
});

export default Input; 