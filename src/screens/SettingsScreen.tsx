import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { useTheme, ThemeType } from '../services/ThemeService';

interface SettingItemProps {
  title: string;
  description?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showBorder?: boolean;
}

function SettingItem({ title, description, onPress, rightElement, showBorder = true }: SettingItemProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.settingItem,
        { borderBottomColor: colors.border },
        showBorder ? { borderBottomWidth: 1 } : {},
      ]}
    >
      <View style={styles.settingItemContent}>
        <Text style={[styles.settingItemTitle, { color: colors.text }]}>{title}</Text>
        {description && (
          <Text style={[styles.settingItemDescription, { color: colors.secondary }]}>
            {description}
          </Text>
        )}
      </View>
      {rightElement}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const { theme, setTheme, colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [locationEnabled, setLocationEnabled] = React.useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement logout logic
            Alert.alert('Coming Soon', 'Logout functionality will be available soon');
          },
        },
      ],
    );
  };

  const getThemeButtonStyle = (currentTheme: ThemeType) => {
    const isSelected = theme === currentTheme;
    return {
      backgroundColor: isSelected ? colors.primary : 'transparent',
      borderColor: isSelected ? colors.primary : colors.border,
    };
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: '#ff8418' }]}>Settings</Text>
        </View>

        {/* Profile Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: '#ff8418' }]}>Profile</Text>
          <SettingItem
            title="Edit Profile"
            description="Update your personal information"
            onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
          />
          <SettingItem
            title="Change Password"
            description="Update your account password"
            onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon')}
          />
          <SettingItem
            title="Two-Factor Authentication"
            description="Add an extra layer of security"
            onPress={() => Alert.alert('Coming Soon', '2FA will be available soon')}
            showBorder={false}
          />
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: '#ff8418' }]}>Preferences</Text>
          <SettingItem
            title="Theme"
            description="Choose your preferred theme"
            rightElement={
              <View style={styles.themeSelector}>
                {(['light', 'dark', 'system'] as ThemeType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTheme(t)}
                    style={[
                      styles.themeButton,
                      getThemeButtonStyle(t),
                    ]}
                  >
                    <Text
                      style={[
                        styles.themeButtonText,
                        { color: theme === t ? '#fff' : colors.text },
                      ]}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <SettingItem
            title="Notifications"
            description="Manage notification preferences"
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor={Platform.OS === 'ios' ? '#fff' : notificationsEnabled ? colors.primary : colors.border}
                ios_backgroundColor={colors.border}
              />
            }
          />
          <SettingItem
            title="Location Services"
            description="Enable location tracking"
            rightElement={
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor={Platform.OS === 'ios' ? '#fff' : locationEnabled ? colors.primary : colors.border}
                ios_backgroundColor={colors.border}
              />
            }
            showBorder={false}
          />
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: '#ff8418' }]}>Support</Text>
          <SettingItem
            title="Help Center"
            description="Get help and support"
            onPress={() => Alert.alert('Coming Soon', 'Help center will be available soon')}
            rightElement={<Text style={{ color: '#0073d8' }}>Help</Text>}
          />
          <SettingItem
            title="Contact Support"
            description="Reach out to our support team"
            onPress={() => Alert.alert('Coming Soon', 'Support contact will be available soon')}
          />
          <SettingItem
            title="About"
            description="App version and information"
            onPress={() => Alert.alert('About', 'Delivery Admin App v1.0.0')}
            showBorder={false}
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.primary }]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemContent: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingItemDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
