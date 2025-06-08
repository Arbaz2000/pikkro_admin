import * as React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from '../../services/ThemeService';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'link';
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, style, textStyle, variant = 'primary', loading = false, disabled, ...props }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: variant === 'primary' ? colors.primary : 'transparent' },
        variant === 'link' && styles.linkButton,
        style,
        variant === 'primary' && styles.shadow,
        disabled && styles.disabled,
      ]}
      activeOpacity={0.8}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.primary} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: variant === 'primary' ? '#fff' : colors.primary },
            variant === 'link' && styles.linkText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  linkButton: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    marginVertical: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  linkText: {
    color: '#007bff',
    backgroundColor: 'transparent',
    fontWeight: '600',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button; 