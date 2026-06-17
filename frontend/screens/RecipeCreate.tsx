import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

export default function RecipeCreate() {
  const navigation = useNavigation() as any;
  const [selected, setSelected] = useState<'voice' | 'chat' | null>(null);

  const handlePress = (type: 'voice' | 'chat') => {
    if (selected) return;
    setSelected(type);
    setTimeout(() => {
      navigation.navigate(type === 'voice' ? 'RecipeVoice' : 'RecipeChat');
      setSelected(null);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* 타이틀 */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>레시피를 어떻게 남길까요?</Text>
        <Text style={styles.subtitle}>말로 설명하거나, 채팅으로 적어볼 수 있어요.</Text>
      </View>

      {/* 선택 카드 */}
      <View style={styles.cardRow}>

        {/* 말로 남기기 */}
        <TouchableOpacity
          style={[styles.card, selected === 'voice' && styles.cardSelected]}
          onPress={() => handlePress('voice')}
          activeOpacity={0.9}
        >
          <Image source={selected === 'voice' ? require('../assets/images/record_full.png') : require('../assets/images/record_empty.png')} style={styles.cardIcon} />
          <Text style={[styles.cardLabel, selected === 'voice' && styles.cardLabelSelected]}>말로 남기기</Text>
        </TouchableOpacity>

        {/* 채팅으로 남기기 */}
        <TouchableOpacity
          style={[styles.card, selected === 'chat' && styles.cardSelected]}
          onPress={() => handlePress('chat')}
          activeOpacity={0.9}
        >
          <Image source={selected === 'chat' ? require('../assets/images/message_full.png') : require('../assets/images/message_empty.png')} style={styles.cardIcon} />
          <Text style={[styles.cardLabel, selected === 'chat' && styles.cardLabelSelected]}>채팅으로 남기기</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },

  titleSection: {
    marginTop: 80, paddingHorizontal: 28,
    alignItems: 'center', gap: 9,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#181818', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#8D8986', textAlign: 'center' },

  cardRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 28, marginTop: 115,
  },
  card: {
    flex: 1, height: 203,
    backgroundColor: '#F2F2F2', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  cardSelected: { backgroundColor: '#FFF2E4', borderWidth: 2, borderColor: '#FFA23E' },
  cardIcon: { width: 57, height: 57, resizeMode: 'contain' },
  cardLabel: { fontSize: 15, fontWeight: '700', color: '#42403D' },
  cardLabelSelected: { color: '#FF9019' },
});
