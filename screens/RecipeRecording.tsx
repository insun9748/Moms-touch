import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function RecipeRecording() {
  const navigation = useNavigation() as any;

  return (
    <SafeAreaView style={styles.container}>

      {/* 뒤로가기 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* 타이틀 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>레시피 말하는 중</Text>
        <Text style={styles.subtitle}>말씀하신 내용을 차근차근 기록하고 있어요</Text>
      </View>

      {/* 마이크 버튼 (녹음 중 상태) */}
      <View style={styles.micWrapper}>
        <View style={styles.micOuter}>
          <View style={styles.glowOuter} />
          <View style={styles.glowMiddle} />
          <View style={styles.micCircle}>
            <Image source={require('../assets/images/record_ing.png')} style={styles.micIcon} />
          </View>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.endBtn} onPress={() => navigation.navigate('RegionSelect')}>
          <Text style={styles.endBtnText}>레시피 말하기 끝내기</Text>
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
  title: { fontSize: 24, fontWeight: '800', color: '#181818', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#8D8986', textAlign: 'center' },

  micWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  micOuter: { width: 180, height: 180, justifyContent: 'center', alignItems: 'center' },

  glowOuter: {
    position: 'absolute',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: '#FFCA45', opacity: 0.1,
  },
  glowMiddle: {
    position: 'absolute',
    width: 133, height: 133, borderRadius: 67,
    backgroundColor: '#FFCA45', opacity: 0.2,
  },
  micCircle: {
    width: 98, height: 98, borderRadius: 100,
    backgroundColor: '#FF9019',
    justifyContent: 'center', alignItems: 'center',
  },
  micIcon: { width: 58, height: 58, resizeMode: 'contain' },

  bottomBar: { paddingHorizontal: 28, paddingBottom: 104 },
  endBtn: {
    backgroundColor: '#FFA23E', borderRadius: 15,
    height: 60, justifyContent: 'center', alignItems: 'center',
  },
  endBtnText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
});
