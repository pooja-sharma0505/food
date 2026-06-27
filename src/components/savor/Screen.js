import { ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavorColors, TAB_BAR_HEIGHT } from '../../constants/savorTheme';

export function Screen({
  children,
  scroll,
  edges = ['top', 'left', 'right'],
  bg = SavorColors.background,
  padBottom = true,
  keyboard,
  contentStyle,
}) {
  const bottomPad = padBottom ? TAB_BAR_HEIGHT + 16 : 16;

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }, contentStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, { paddingBottom: bottomPad }, contentStyle]}>{children}</View>
  );

  const wrapped = keyboard ? (
    <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {body}
    </KeyboardAvoidingView>
  ) : (
    body
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={edges}>
      {wrapped}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1, paddingHorizontal: 20 },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },
});
