import { useAuth } from '@/contexts/authContext';
import { colors } from '@/constants/theme';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { StyleSheet, View, Image, Pressable, ScrollView } from 'react-native';
import { User, Gear, SignOut, Bell, Shield, Question } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

const ProfileOption = ({ icon: Icon, title, onPress }: { icon: any; title: string; onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.option}>
    <View style={styles.optionIcon}>
      <Icon size={24} color={colors.primary} weight="fill" />
    </View>
    <Typo size={16} style={styles.optionText}>{title}</Typo>
  </Pressable>
);

export default function Profile() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={colors.white} weight="fill" />
              </View>
            )}
          </View>
          <View style={styles.userInfo}>
            <Typo size={24} fontWeight="700">{user?.name || 'User'}</Typo>
            <Typo size={16} color={colors.textLight}>{user?.email}</Typo>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          <ProfileOption 
            icon={Bell} 
            title="Notifications" 
            onPress={() => {}} 
          />
          <ProfileOption 
            icon={Shield} 
            title="Privacy & Security" 
            onPress={() => {}} 
          />
          <ProfileOption 
            icon={Question} 
            title="Help & Support" 
            onPress={() => {}} 
          />
          <ProfileOption 
            icon={Gear} 
            title="Settings" 
            onPress={() => {}} 
          />
          <ProfileOption 
            icon={SignOut} 
            title="Logout" 
            onPress={handleLogout} 
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  optionsContainer: {
    padding: 20,
    gap: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral200,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
});