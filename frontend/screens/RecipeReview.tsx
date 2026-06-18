import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';

const starImages: Record<number, any> = {
  1: require('../assets/images/star1.png'),
  2: require('../assets/images/star2.png'),
  3: require('../assets/images/star3.png'),
  4: require('../assets/images/star4.png'),
  5: require('../assets/images/star5.png'),
};

const DIFFICULTY_LABEL: Record<number, string> = { 1: '쉬움', 2: '보통', 3: '어려움' };

export default function RecipeReview() {
  const navigation = useNavigation() as any;
  const route = useRoute() as any;

  // 재료(dict) → 배열로 변환해 편집, 업로드 시 다시 dict로
  const [recipe, setRecipe] = useState(() => {
    const r = route.params?.recipe ?? {};
    const ingredients = Array.isArray(r.ingredients)
      ? r.ingredients
      : Object.entries(r.ingredients ?? {}).map(([name, amount]) => ({ name, amount }));
    return { ...r, ingredients };
  });
  const [editMode, setEditMode] = useState(false);

  const setField = (field: string, value: any) =>
    setRecipe((prev: any) => ({ ...prev, [field]: value }));

  const updateStep = (order: number, field: string, value: any) =>
    setRecipe((prev: any) => ({
      ...prev,
      steps: prev.steps.map((s: any) => (s.step_order === order ? { ...s, [field]: value } : s)),
    }));

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) =>
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing: any, i: number) =>
        i === index ? { ...ing, [field]: value } : ing
      ),
    }));

  const addIngredient = () =>
    setRecipe((prev: any) => ({ ...prev, ingredients: [...prev.ingredients, { name: '', amount: '' }] }));

  const removeIngredient = (index: number) =>
    setRecipe((prev: any) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_: any, i: number) => i !== index),
    }));

  // timestamp는 분 단위 숫자로 오니까 "05:00" 형식으로 변환
  const formatTime = (minutes: number) => {
    const m = String(Math.floor(minutes)).padStart(2, '0');
    return `${m}:00`;
  };

  const handleUpload = () => {
    // 편집용 배열 → 백엔드용 dict 변환
    const ingredientsDict = recipe.ingredients.reduce((acc: any, ing: any) => {
      if (ing.name?.trim()) acc[ing.name.trim()] = ing.amount;
      return acc;
    }, {});
    const finalRecipe = {
      ...recipe,
      duration: Number(recipe.duration) || 0,
      ingredients: ingredientsDict,
    };
    navigation.navigate('RecipeUploadDone', { recipe: finalRecipe });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.editToggle, editMode && styles.editToggleActive]}
            onPress={() => setEditMode(v => !v)}
          >
            <Text style={[styles.editToggleText, editMode && styles.editToggleTextActive]}>
              {editMode ? '완료' : '수정하기'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 제목 영역 */}
        <View style={styles.titleSection}>
          {editMode ? (
            <>
              <View style={styles.editFieldRow}>
                <Text style={styles.editFieldLabel}>지역</Text>
                <TextInput
                  style={styles.titleInputBox}
                  value={String(recipe.region ?? '')}
                  onChangeText={(t) => setField('region', t)}
                  placeholder="지역"
                />
              </View>
              <TextInput
                style={[styles.title, styles.titleInputBox]}
                value={String(recipe.title ?? '')}
                onChangeText={(t) => setField('title', t)}
                placeholder="레시피 제목"
              />
              <TextInput
                style={[styles.subtitle, styles.titleInputBox]}
                value={String(recipe.description ?? '')}
                onChangeText={(t) => setField('description', t)}
                placeholder="한 줄 설명"
                multiline
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>{recipe.region} {recipe.title}</Text>
              <Text style={styles.subtitle}>{recipe.description}</Text>
            </>
          )}

          {/* 정보 */}
          <View style={styles.infoBox}>
            {/* 소요 시간 */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>소요 시간</Text>
              {editMode ? (
                <View style={styles.inlineInputWrap}>
                  <TextInput
                    style={styles.smallInput}
                    value={String(recipe.duration ?? '')}
                    onChangeText={(t) => setField('duration', t.replace(/[^0-9]/g, ''))}
                    keyboardType="number-pad"
                    placeholder="0"
                  />
                  <Text style={styles.infoValue}>분</Text>
                </View>
              ) : (
                <Text style={styles.infoValue}>{recipe.duration}분</Text>
              )}
            </View>

            {/* 난이도 */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>난이도</Text>
              {editMode ? (
                <View style={styles.difficultyRow}>
                  {[1, 2, 3].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[styles.diffBtn, recipe.difficulty === d && styles.diffBtnActive]}
                      onPress={() => setField('difficulty', d)}
                    >
                      <Text style={[styles.diffBtnText, recipe.difficulty === d && styles.diffBtnTextActive]}>
                        {DIFFICULTY_LABEL[d]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <Image source={starImages[recipe.difficulty]} style={styles.starImage} />
              )}
            </View>

            {/* 재료 */}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>재료</Text>
              {editMode ? (
                <View style={styles.ingredientEditCol}>
                  {recipe.ingredients.map((ing: any, i: number) => (
                    <View key={i} style={styles.ingredientEditRow}>
                      <TextInput
                        style={[styles.smallInput, styles.ingNameInput]}
                        value={String(ing.name ?? '')}
                        onChangeText={(t) => updateIngredient(i, 'name', t)}
                        placeholder="재료명"
                      />
                      <TextInput
                        style={[styles.smallInput, styles.ingAmountInput]}
                        value={String(ing.amount ?? '')}
                        onChangeText={(t) => updateIngredient(i, 'amount', t)}
                        placeholder="양"
                      />
                      <TouchableOpacity onPress={() => removeIngredient(i)} style={styles.removeBtn}>
                        <Text style={styles.removeBtnText}>×</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                  <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ 재료 추가</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.ingredientRow}>
                  {recipe.ingredients.map((ing: any) => (
                    <View key={ing.name} style={styles.ingredientItem}>
                      <Text style={styles.ingName}>{ing.name}</Text>
                      <Text style={styles.ingAmount}>{ing.amount as string}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 레시피 단계 */}
        <View style={styles.stepsSection}>
          <Text style={styles.sectionTitle}>레시피</Text>
          <View>
              {(() => {
                let accumulated = 0;
                return recipe.steps.map((step: any, index: number) => {
                  const current = accumulated
                  accumulated += Number(step.timestamp);
                  const isLast = index === recipe.steps.length - 1;
                  return (
                    <View key={step.step_order} style={styles.stepRow}>
                      <View style={styles.stepLeft}>
                        <View style={styles.stepBadge}>
                          <Text style={styles.stepBadgeText}>{step.step_order}</Text>
                        </View>
                        {!isLast && <View style={styles.dashedLine} />}
                      </View>
                      <View style={styles.stepRight}>
                        {editMode ? (
                          <View style={styles.inlineInputWrap}>
                            <TextInput
                              style={styles.smallInput}
                              value={String(step.timestamp ?? '')}
                              onChangeText={(t) => updateStep(step.step_order, 'timestamp', t.replace(/[^0-9]/g, ''))}
                              keyboardType="number-pad"
                              placeholder="0"
                            />
                            <Text style={styles.stepTime}>분</Text>
                          </View>
                        ) : (
                          <Text style={styles.stepTime}>{formatTime(current)}</Text>
                        )}
                        <View style={styles.stepCard}>
                          {editMode ? (
                            <>
                              <TextInput
                                style={[styles.stepTitle, styles.titleInput]}
                                value={String(step.title ?? '')}
                                onChangeText={(t) => updateStep(step.step_order, 'title', t)}
                                placeholder="단계 제목"
                              />
                              <TextInput
                                style={[styles.stepDesc, styles.descInput]}
                                value={String(step.description ?? '')}
                                onChangeText={(t) => updateStep(step.step_order, 'description', t)}
                                placeholder="단계 설명"
                                multiline
                              />
                            </>
                          ) : (
                            <>
                              <Text style={styles.stepTitle}>{step.title}</Text>
                              <Text style={styles.stepDesc}>{step.description}</Text>
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  );
                });
              })()}
          </View>
        </View>

      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
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
  editToggle: { borderWidth: 1, borderColor: '#FFA23E', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14 },
  editToggleActive: { backgroundColor: '#FFA23E' },
  editToggleText: { fontSize: 13, fontWeight: '700', color: '#FFA23E' },
  editToggleTextActive: { color: '#FFFFFF' },

  titleSection: { paddingHorizontal: 28, paddingTop: 8, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '800', color: '#181818', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#8D8986', marginBottom: 20 },

  editFieldRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  editFieldLabel: { width: 40, fontSize: 13, fontWeight: '700', color: '#181818' },
  titleInputBox: { borderWidth: 1, borderColor: '#FFA23E', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, flex: 1 },

  infoBox: { gap: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  infoLabel: { width: 60, fontSize: 12, fontWeight: '700', color: '#181818', paddingTop: 6 },
  infoValue: { fontSize: 12, color: '#181818', paddingTop: 6 },
  starImage: { width: 80, height: 16, resizeMode: 'contain', marginLeft: -20 },

  inlineInputWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  smallInput: { borderWidth: 1, borderColor: '#FFA23E', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5, fontSize: 13, color: '#181818', minWidth: 56 },

  difficultyRow: { flexDirection: 'row', gap: 8 },
  diffBtn: { borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 12 },
  diffBtnActive: { backgroundColor: '#FFF2E4', borderColor: '#FFA23E' },
  diffBtnText: { fontSize: 12, color: '#827E7B' },
  diffBtnTextActive: { color: '#FF9019', fontWeight: '700' },

  ingredientRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, flex: 1 },
  ingredientItem: { alignItems: 'center', gap: 2 },
  ingName: { fontSize: 12, color: '#181818', textAlign: 'center' },
  ingAmount: { fontSize: 11, color: '#42403D', textAlign: 'center' },

  ingredientEditCol: { flex: 1, gap: 8 },
  ingredientEditRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ingNameInput: { flex: 1 },
  ingAmountInput: { flex: 1 },
  removeBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F1F1F1', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { fontSize: 18, color: '#827E7B', lineHeight: 20 },
  addBtn: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#FFA23E', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginTop: 2 },
  addBtnText: { fontSize: 12, fontWeight: '700', color: '#FF9019' },

  divider: { height: 12, backgroundColor: '#F6F4F4', marginVertical: 8 },

  stepsSection: { paddingHorizontal: 28, paddingTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#181818', marginBottom: 20 },
  dashedLine: { position: 'absolute', top: 20, bottom: -12, left: 9, width: 2, borderStyle: 'dashed', borderLeftWidth: 2, borderColor: '#FFD8AF' },

  stepRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stepLeft: { width: 20, alignItems: 'center', zIndex: 1 },
  stepBadge: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFCA45', justifyContent: 'center', alignItems: 'center' },
  stepBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  stepRight: { flex: 1, gap: 4 },
  stepTime: { fontSize: 13, color: '#827E7B' },
  stepCard: { backgroundColor: '#FFFFFF', borderRadius: 4, borderWidth: 1, borderColor: '#E6E6E6', padding: 12, shadowColor: '#3D3B3A', shadowOpacity: 0.09, shadowRadius: 7.3, elevation: 2 },
  stepTitle: { fontSize: 14, fontWeight: '700', color: '#181818', marginBottom: 4 },
  stepDesc: { fontSize: 11, color: '#827E7B', lineHeight: 16 },
  titleInput: { borderBottomWidth: 1, borderBottomColor: '#FFA23E', paddingVertical: 2 },
  descInput: { borderWidth: 1, borderColor: '#FFA23E', borderRadius: 4, padding: 8, marginTop: 4, minHeight: 60, textAlignVertical: 'top' },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 28, paddingBottom: 40, paddingTop: 12, backgroundColor: '#FCFCFC' },
  uploadBtn: { backgroundColor: '#FFA23E', borderRadius: 15, height: 60, alignItems: 'center', justifyContent: 'center' },
  uploadBtnText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
});
