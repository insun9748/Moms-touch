import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function RecipeVoice() {
  const navigation = useNavigation() as any;

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

      {/* 마이크 버튼 */}
      <View style={styles.micWrapper}>
        <Image source={require('../assets/images/record_btn.png')} style={styles.micIcon} />
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('RecipeRecording')}>
          <Text style={styles.startBtnText}>레시피 말하기 시작</Text>
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

  bottomBar: { paddingHorizontal: 28, paddingBottom: 104 },
  startBtn: {
    backgroundColor: '#FFA23E', borderRadius: 15,
    height: 60, justifyContent: 'center', alignItems: 'center',
  },
  startBtnText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
});
