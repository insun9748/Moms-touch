import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AudioModule } from 'expo-audio';

export default function RecipeVoice() {
  const navigation = useNavigation() as any;

  // 마이크 버튼을 누르면 권한을 묻고, 허용되면 바로 녹음 화면으로 이동
  const handleStart = async () => {
    const permission = await AudioModule.requestRecordingPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        '마이크 권한이 필요해요',
        '레시피를 녹음하려면 마이크 접근을 허용해 주세요. 설정에서 권한을 켤 수 있어요.',
        [
          { text: '취소', style: 'cancel' },
          { text: '설정 열기', onPress: () => Linking.openSettings() },
        ]
      );
      return;
    }
    // 권한이 있으면 바로 녹음이 시작되도록 RecipeRecording으로 이동
    navigation.navigate('RecipeRecording', { autoStart: true });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 뒤로가기 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* 타이틀 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{'버튼을 눌러\n레시피를 말해주세요'}</Text>
        <Text style={styles.subtitle}>평소 요리하듯 편하게 말해주세요</Text>
      </View>

      {/* 마이크 버튼 (누르면 권한 요청 후 녹음 시작) */}
      <View style={styles.micWrapper}>
        <TouchableOpacity onPress={handleStart} activeOpacity={0.8}>
          <Image source={require('../assets/images/record_btn.png')} style={styles.micIcon} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },

  backBtn: { marginTop: 17, marginLeft: 28, padding: 4, width: 28, height: 28, justifyContent: 'center' },
  backIcon: { width: 20, height: 20, resizeMode: 'contain' },

  titleSection: {
    marginTop: 40, paddingHorizontal: 28,
    alignItems: 'center', gap: 9,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#181818', textAlign: 'center', lineHeight: 36 },
  subtitle: { fontSize: 16, color: '#8D8986', textAlign: 'center' },

  micWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  micIcon: { width: 180, height: 180, resizeMode: 'contain' },
});
