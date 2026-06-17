import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function RecipeProcessing() {
  const navigation = useNavigation() as any;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('RecipeReview');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* 뒤로가기 */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Image source={require('../assets/images/back.png')} style={styles.backIcon} />
      </TouchableOpacity>

      {/* 타이틀 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>거의 다 됐어요!</Text>
        <Text style={styles.subtitle}>손맛을 레시피로 옮기는 중이에요</Text>
      </View>

      {/* 할머니 이미지 */}
      <View style={styles.imageSection}>
        <Image
          source={require('../assets/images/grandma_talk.png')}
          style={styles.grandmaImage}
          resizeMode="contain"
        />
      </View>

      {/* 손맛 변환 중 */}
      <View style={styles.statusRow}>
        <Text style={styles.statusText}>손맛 변환 중</Text>
        <Image source={require('../assets/images/twinkle.png')} style={styles.twinkleIcon} />
      </View>

      {/* 취소하기 */}
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.navigate('Main')}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>취소하기</Text>
        <View style={styles.cancelUnderline} />
      </TouchableOpacity>

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

  imageSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 48,
    height: 310,
  },
  grandmaImage: { width: 349, height: 302 },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  statusText: {
    fontSize: 18, fontWeight: '700',
    color: '#FF9019',
  },
  twinkleIcon: { width: 20, height: 24, resizeMode: 'contain' },

  cancelBtn: {
    alignItems: 'center',
    marginBottom: 100,
  },
  cancelText: { fontSize: 15, color: '#827E7B' },
  cancelUnderline: { width: 54, height: 1, backgroundColor: '#827E7B', marginTop: 2 },
});
