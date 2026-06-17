import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const starImages: Record<number, any> = {
  1: require('../assets/images/star1.png'),
  2: require('../assets/images/star2.png'),
  3: require('../assets/images/star3.png'),
  4: require('../assets/images/star4.png'),
  5: require('../assets/images/star5.png'),
};

const STEPS = [
  { id: 1, time: '00:00', title: '재료 준비', desc: '감자, 애호박, 양파, 대파를 준비하고 감자는 껍질을 벗겨둡니다. 감자는 갈기 좋게 작게 잘라두면 좋아요.' },
  { id: 2, time: '05:00', title: '감자 갈기', desc: '손질된 감자를 강판이나 믹서기로 곱게 갈아줍니다. 갈아낸 감자의 물을 살짝 따라 내어 농도를 맞춰두세요.' },
  { id: 3, time: '12:00', title: '육수 끓이기 및 채소 가닥하기', desc: '다시마를 물에 넣고 끓이다가 멸치를 넣어 육수를 내세요. 애호박과 양파, 대파를 먹기 좋게 잘라두세요.' },
  { id: 4, time: '22:00', title: '반죽 만들기', desc: '갈아둔 감자에 전분가루와 전분을 넣고 농도가 맞게 섞어 반죽을 만들어 주세요. 소금으로 간을 해 두면 좋아요.' },
  { id: 5, time: '28:00', title: '옹심이 빚기', desc: '완성된 반죽을 둥글게 동글동글하게 빚어두세요. 손가락으로 꾹 눌러 균형을 맞추어 나이의 옹심이를 빚어두세요.' },
  { id: 6, time: '35:00', title: '육수 끓이기', desc: '끓여진 다시마 육수에 채소를 넣고 끓여주세요. 육수가 다시 끓으면 빚어둔 옹심이를 넣어 주세요.' },
  { id: 7, time: '40:00', title: '옹심이 넣기', desc: '옹심이가 끓어오르면 떠오르는 것들이 조리 중이에요. 소금으로 간을 맞추고 파의 향이 올라올 때까지 좋아요.' },
  { id: 8, time: '47:00', title: '담고 마무리 하기', desc: '끓여진 감자옹심이를 그릇에 담고 파를 올려 마무리해주세요. 따뜻하게 드시면 가장 맛있어요.' },
];

const DIFFICULTY = 3;

const INFO = [
  { label: '지역', value: '강원도', type: 'text' },
  { label: '소요 시간', value: '50분', type: 'text' },
  { label: '난이도', value: DIFFICULTY, type: 'star' },
];

const INGREDIENTS = [
  { name: '감자', amount: '4개' },
  { name: '감자전분', amount: '1작은술' },
  { name: '국장', amount: '1큰술' },
  { name: '김치전분', amount: '3큰술' },
  { name: '소금', amount: '약간' },
  { name: '애호박', amount: '1/3개' },
];

export default function RecipeReview() {
  const navigation = useNavigation() as any;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchBtn}>
            <Image source={require('../assets/images/find_btn.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>

        {/* 제목 영역 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>강원도 감자옹심이</Text>
          <Text style={styles.subtitle}>감자로 빚어낸 투박하고 따뜻한 한 그릇</Text>

          {/* 정보 */}
          <View style={styles.infoBox}>
            {INFO.map(item => (
              <View key={item.label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                {item.type === 'star'
                  ? <Image source={starImages[item.value as number]} style={styles.starImage} />
                  : <Text style={styles.infoValue}>{item.value}</Text>
                }
              </View>
            ))}

            {/* 재료 */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>재료</Text>
              <View style={styles.ingredientRow}>
                {INGREDIENTS.map(ing => (
                  <View key={ing.name} style={styles.ingredientItem}>
                    <Text style={styles.ingName}>{ing.name}</Text>
                    <Text style={styles.ingAmount}>{ing.amount}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 레시피 단계 */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>레시피</Text>
          <View>
            <View style={styles.dashedLine} />
            {STEPS.map(step => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>{step.id}</Text>
                  </View>
                </View>
                <View style={styles.stepRight}>
                  <Text style={styles.stepTime}>{step.time}</Text>
                  <View style={styles.stepCard}>
                    <View style={styles.stepCardHeader}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>수정하기</Text>
                        <Image source={require('../assets/images/edit.png')} style={styles.editIcon} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.stepDesc}>{step.desc}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.uploadBtn} onPress={() => navigation.navigate('RecipeUploadDone')}>
          <Text style={styles.uploadBtnText}>업로드 하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 28, color: '#827E7B' },
  searchBtn: { padding: 4 },
  searchIcon: { width: 22, height: 22, resizeMode: 'contain' },

  titleSection: { paddingHorizontal: 28, paddingTop: 8, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#181818', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#8D8986', marginBottom: 20 },

  infoBox: { gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoLabel: { width: 60, fontSize: 12, fontWeight: '700', color: '#181818' },
  infoValue: { fontSize: 12, color: '#181818' },
  starImage: { width: 80, height: 16, resizeMode: 'contain', marginLeft: -20 },

  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, flex: 1 },
  ingredientItem: { alignItems: 'center', gap: 2 },
  ingName: { fontSize: 12, color: '#181818', textAlign: 'center' },
  ingAmount: { fontSize: 11, color: '#42403D', textAlign: 'center' },

  divider: { height: 12, backgroundColor: '#F6F4F4', marginVertical: 8 },

  stepsSection: { paddingHorizontal: 28, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#181818', marginBottom: 20 },
  dashedLine: { position: 'absolute', left: 9, top: 0, bottom: 0, width: 2, borderStyle: 'dashed', borderLeftWidth: 2, borderColor: '#FFD8AF' },

  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stepLeft: { width: 20, alignItems: 'center', zIndex: 1 },
  stepBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFCA45', justifyContent: 'center', alignItems: 'center' },
  stepBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  stepRight: { flex: 1, gap: 4 },
  stepTime: { fontSize: 13, color: '#827E7B' },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: 4, borderWidth: 1, borderColor: '#E6E6E6', padding: 12, shadowColor: '#3D3B3A', shadowOpacity: 0.09, shadowRadius: 7.3, elevation: 2 },
  stepCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#181818', flex: 1, marginRight: 8 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 4, paddingVertical: 4, paddingHorizontal: 8 },
  editIcon: { width: 16, height: 16, resizeMode: 'contain' },
  editBtnText: { fontSize: 11, color: '#827E7B' },
  stepDesc: { fontSize: 11, color: '#827E7B', lineHeight: 16 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 28, paddingBottom: 40, paddingTop: 12, backgroundColor: '#FCFCFC' },
  uploadBtn: { backgroundColor: '#FFA23E', borderRadius: 15, height: 60, alignItems: 'center', justifyContent: 'center' },
  uploadBtnText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
});
