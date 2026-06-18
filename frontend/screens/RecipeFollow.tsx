import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ScrollView, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect, useRef, useMemo } from 'react';
import Svg, { Circle } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

const STEPS = [
  { id: 1, time: '00:00', title: '재료 준비', desc: '감자, 애호박, 양파, 대파를 준비하고 감자는 껍질을 벗겨둡니다. 감자는 갈기 좋게 작게 잘라두면 좋아요.', hasTimer: false },
  { id: 2, time: '05:00', title: '감자 갈기', desc: '손질된 감자를 강판이나 믹서기로 곱게 갈아줍니다. 갈아낸 감자의 물을 살짝 따라 내어 농도를 맞춰두세요.', hasTimer: true, duration: 420 },
  { id: 3, time: '12:00', title: '물기 짜기와 전분 가라앉히기', desc: '간 감자를 면포에 넣고 물기를 꼭 짜주세요. 나온 감자 물은 바로 버리지 말고 잠시 두어 전분이 가라앉게 해주세요.', hasTimer: true, duration: 645 },
  { id: 4, time: '22:00', title: '반죽 만들기', desc: '갈아둔 감자에 전분가루와 소금을 넣고 농도가 맞게 섞어 반죽을 만들어 주세요.', hasTimer: false },
  { id: 5, time: '27:00', title: '옹심이 빚기', desc: '완성된 반죽을 둥글게 동글동글하게 빚어두세요.', hasTimer: false },
  { id: 6, time: '35:00', title: '육수 끓이기', desc: '끓여진 다시마 육수에 채소를 넣고 끓여주세요.', hasTimer: true, duration: 300 },
  { id: 7, time: '40:00', title: '옹심이 넣기', desc: '옹심이가 끓어오르면 떠오르는 것들이 조리 중이에요.', hasTimer: true, duration: 300 },
  { id: 8, time: '47:00', title: '담고 마무리 하기', desc: '끓여진 감자옹심이를 그릇에 담고 파를 올려 마무리해주세요.', hasTimer: false },
];

const RADIUS = 90;
const STROKE = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHEET_HEIGHT = height * 0.7;
const BAR_HEIGHT = 85;

export default function RecipeFollow() {
  const navigation = useNavigation() as any;
  const route = useRoute() as any;
  const steps = route.params?.steps ?? STEPS;

  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(steps[0].duration ?? 0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<any>(null);
  const sheetAnim = useRef(new Animated.Value(SHEET_HEIGHT - BAR_HEIGHT)).current;

  const step = steps[currentStep];
  const total = step.duration ?? 1;
  const progress = timeLeft / total;

  useEffect(() => {
    setTimeLeft(step.duration ?? 0);
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, [currentStep]);

  useEffect(() => {
    if (!step.hasTimer) return;
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev: number) => {
          if (prev <= 1) { clearInterval(intervalRef.current); setIsRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, step.hasTimer]);

  const [sheetOpen, setSheetOpen] = useState(false);
  const dragStartY = useRef(SHEET_HEIGHT - BAR_HEIGHT);

  const snapTo = (open: boolean) => {
    const toValue = open ? 0 : SHEET_HEIGHT - BAR_HEIGHT;
    setSheetOpen(open);
    Animated.spring(sheetAnim, { toValue, useNativeDriver: true, tension: 60, friction: 12 }).start();
    dragStartY.current = toValue;
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
    onPanResponderGrant: () => {
      sheetAnim.stopAnimation(val => { dragStartY.current = val; });
    },
    onPanResponderMove: (_, g) => {
      const next = dragStartY.current + g.dy;
      const clamped = Math.max(0, Math.min(SHEET_HEIGHT - BAR_HEIGHT, next));
      sheetAnim.setValue(clamped);
    },
    onPanResponderRelease: (_, g) => {
      const openByVelocity = g.vy < -0.5;
      const closeByVelocity = g.vy > 0.5;
      const midPoint = (SHEET_HEIGHT - BAR_HEIGHT) / 2;
      const currentVal = dragStartY.current + g.dy;
      if (closeByVelocity || (!openByVelocity && currentVal > midPoint)) {
        snapTo(false);
      } else {
        snapTo(true);
      }
    },
  }), []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const goNext = () => {
    if (currentStep < steps.length - 1) { setCurrentStep(prev => prev + 1); }
    else { navigation.navigate('RecipeComplete'); }
  };

  const goPrev = () => {
    if (currentStep > 0) { setCurrentStep(prev => prev - 1); }
  };

  const progressBarWidth = ((currentStep + 1) / steps.length) * (width - 56);

  return (
    <SafeAreaView style={styles.container}>

      {/* 상단 진행 바 */}
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: progressBarWidth }]} />
        <View style={[styles.progressDot, { left: progressBarWidth - 10 }]} />
      </View>

      {/* 단계 뱃지 + 제목 & 설명 */}
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentStep + 1}단계</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDesc}>{step.desc}</Text>
        </View>
      </View>

      {/* 타이머 (hasTimer인 단계만) */}
      {step.hasTimer && (
        <View style={styles.timerWrapper}>
          <Svg width={220} height={220} style={{ transform: [{ rotate: '135deg' }] }}>
            <Circle cx={110} cy={110} r={RADIUS} stroke="#E6E6E6" strokeWidth={STROKE} fill="none"
              strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE * 0.25}`} />
            <Circle cx={110} cy={110} r={RADIUS} stroke="#FFA23E" strokeWidth={STROKE} fill="none"
              strokeDasharray={`${CIRCUMFERENCE * 0.75 * progress} ${CIRCUMFERENCE - CIRCUMFERENCE * 0.75 * progress}`}
              strokeLinecap="round" />
          </Svg>
          <View style={styles.timeTextBox}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
          </View>
          <TouchableOpacity style={styles.playBtn} onPress={() => setIsRunning(prev => !prev)}>
            <Image
              source={isRunning ? require('../assets/images/timer_play.png') : require('../assets/images/timer_stop.png')}
              style={styles.playIcon}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* 이전 / 다음 버튼 */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={[styles.btn, styles.btnPrev, currentStep === 0 && styles.btnDisabled]}
          onPress={goPrev} disabled={currentStep === 0}
        >
          <Text style={[styles.btnText, styles.btnTextPrev]}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnNext]} onPress={goNext}>
          <Text style={[styles.btnText, styles.btnTextNext]}>
            {currentStep === steps.length - 1 ? '완료' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 바텀시트 (항상 마운트, translateY로 보이는 영역 제어) */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetAnim }] }]}>
        {/* 핸들 + 레시피 헤더 — 항상 보이는 영역 */}
        <TouchableOpacity
          onPress={() => snapTo(!sheetOpen)}
          activeOpacity={0.85}
          style={styles.sheetHeader}
          {...panResponder.panHandlers}
        >
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>레시피</Text>
        </TouchableOpacity>

        {/* 타임라인 */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 40, paddingBottom: 40 }}>
          <View style={{ position: 'relative', paddingLeft: 4 }}>
            {steps.map((s: any, i: number) => (
              <View key={s.id} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  {/* 마지막 단계 아래로는 연결선을 그리지 않음 */}
                  {i < steps.length - 1 && <View style={styles.dashedLine} />}
                  <View style={[styles.timelineBadge, i === currentStep && styles.timelineBadgeActive]}>
                    <Text style={styles.timelineBadgeText}>{s.id}</Text>
                  </View>
                </View>
                <View style={styles.timelineRight}>
                  <Text style={styles.timelineTime}>{s.time}</Text>
                  <View style={styles.timelineCard}>
                    <Text style={styles.timelineCardTitle}>{s.title}</Text>
                    <Text style={styles.timelineCardDesc}>{s.desc}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },

  progressBarBg: { height: 8, backgroundColor: '#E6E6E6', marginHorizontal: 28, borderRadius: 8, marginTop: 16, position: 'relative' },
  progressBarFill: { height: 8, backgroundColor: '#FFCA45', borderRadius: 8 },
  progressDot: { position: 'absolute', top: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFCA45', shadowColor: '#978D70', shadowOpacity: 0.25, shadowRadius: 2, elevation: 2 },

  content: { alignItems: 'center', marginTop: 40, paddingHorizontal: 28, gap: 16 },
  badge: { backgroundColor: '#FFA23E', borderRadius: 50, paddingHorizontal: 12, paddingVertical: 8 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.6 },
  textBox: { gap: 8, alignItems: 'center' },
  stepTitle: { fontSize: 18, fontWeight: '700', color: '#181818', textAlign: 'center' },
  stepDesc: { fontSize: 14, color: '#42403D', textAlign: 'center', lineHeight: 21 },

  timerWrapper: { alignItems: 'center', marginTop: 24, position: 'relative' },
  timeTextBox: { position: 'absolute', top: 85, alignItems: 'center' },
  timeText: { fontSize: 24, fontWeight: '700', color: '#181818', letterSpacing: 1.2 },
  playBtn: { marginTop: -16 },
  playIcon: { width: 64, height: 64, resizeMode: 'contain' },

  btnRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 28, position: 'absolute', bottom: BAR_HEIGHT + 16, left: 0, right: 0 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 15, alignItems: 'center' },
  btnPrev: { backgroundColor: '#E6E6E6' },
  btnNext: { backgroundColor: '#FFA23E' },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 22, fontWeight: '700' },
  btnTextPrev: { color: '#8D8986' },
  btnTextNext: { color: '#FFFFFF' },

  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    shadowColor: '#6B6B6B', shadowOpacity: 0.25, shadowRadius: 31.1,
    shadowOffset: { width: 0, height: 5 }, elevation: 20,
    paddingHorizontal: 28,
  },
  sheetHeader: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E6E6E6', marginBottom: 10 },
  sheetTitle: { fontSize: 14, fontWeight: '700', color: '#181818', alignSelf: 'flex-start' },

  dashedLine: { position: 'absolute', left: 9, top: 20, bottom: -12, width: 2, borderStyle: 'dashed', borderLeftWidth: 2, borderColor: '#FFD8AF' },
  timelineRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  timelineLeft: { width: 20, alignItems: 'center', zIndex: 1 },
  timelineBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFCA45', justifyContent: 'center', alignItems: 'center' },
  timelineBadgeActive: { backgroundColor: '#FFA23E', transform: [{ scale: 1.2 }] },
  timelineBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  timelineRight: { flex: 1, gap: 4 },
  timelineTime: { fontSize: 13, color: '#827E7B' },
  timelineCard: { backgroundColor: '#FFFFFF', borderRadius: 4, borderWidth: 1, borderColor: '#E6E6E6', padding: 12, shadowColor: '#3D3B3A', shadowOpacity: 0.09, shadowRadius: 7.3, elevation: 2 },
  timelineCardTitle: { fontSize: 14, fontWeight: '700', color: '#181818', marginBottom: 4 },
  timelineCardDesc: { fontSize: 11, color: '#827E7B', lineHeight: 16 },
});
