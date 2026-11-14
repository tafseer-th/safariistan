import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowRight, RefreshCw } from "lucide-react-native";
import { colors, fonts } from "@/lib/theme";

// Text in Poppins. `weight` picks the font file (RN cannot synthesize weights for custom fonts).
export function T({ weight = "regular", style, ...props }) {
  return <Text {...props} style={[styles.text, { fontFamily: fonts[weight] }, style]} />;
}

export function Badge({ children, tone = "white", style, icon: Icon }) {
  const t = badgeTones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      {Icon && <Icon size={12} color={t.fg} />}
      <T weight={tone === "red" ? "bold" : "semibold"} style={[styles.badgeText, { color: t.fg }]}>
        {children}
      </T>
    </View>
  );
}

const badgeTones = {
  white: { bg: "rgba(255,255,255,0.95)", fg: colors.green700 },
  green: { bg: colors.green50, fg: colors.green700 },
  red: { bg: colors.red500, fg: colors.white },
};

export function Button({ title, onPress, icon: Icon, variant = "primary", loading, disabled, style }) {
  const v = buttonVariants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? v.pressed : v.bg, borderColor: v.border },
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={v.fg} /> : Icon && <Icon size={18} color={v.fg} />}
      <T weight="semibold" style={{ color: v.fg, fontSize: 15 }}>
        {title}
      </T>
    </Pressable>
  );
}

const buttonVariants = {
  primary: { bg: colors.green600, pressed: colors.green700, fg: colors.white, border: colors.green600 },
  outline: { bg: colors.white, pressed: colors.gray50, fg: colors.gray700, border: colors.gray300 },
};

// Home page section title: small green label, title + italic highlight, text, "view all".
export function SectionHeading({ eyebrow, title, highlight, text, linkLabel, onPress }) {
  return (
    <View style={{ paddingHorizontal: 16 }}>
      {eyebrow && (
        <T weight="semibold" style={styles.eyebrow}>
          {eyebrow.toUpperCase()}
        </T>
      )}
      <View style={styles.headingRow}>
        <T weight="extrabold" style={styles.h2}>
          {title}{" "}
          {highlight && <Text style={{ fontFamily: fonts.display, color: colors.green600 }}>{highlight}</Text>}
        </T>
        {onPress && (
          <Pressable onPress={onPress} style={styles.viewAll} hitSlop={8}>
            <T weight="semibold" style={{ fontSize: 13, color: colors.gray800 }}>
              {linkLabel || "View all"}
            </T>
            <ArrowRight size={14} color={colors.gray800} />
          </Pressable>
        )}
      </View>
      {text && <T style={styles.sectionText}>{text}</T>}
    </View>
  );
}

// Light green band at the top of list pages (like the website's page headers).
export function PageHero({ title, highlight, after, text }) {
  return (
    <View style={styles.pageHero}>
      <T weight="extrabold" style={styles.pageTitle}>
        {title} <Text style={{ color: colors.green600 }}>{highlight}</Text>
        {after ? ` ${after}` : ""}
      </T>
      {text && <T style={styles.pageText}>{text}</T>}
    </View>
  );
}

export function Loader({ style }) {
  return (
    <View style={[{ paddingVertical: 60, alignItems: "center" }, style]}>
      <ActivityIndicator size="large" color={colors.green600} />
    </View>
  );
}

export function ErrorBox({ message = "Could not load right now. Check your internet connection.", onRetry, style }) {
  return (
    <View style={[styles.errorBox, style]}>
      <T style={{ color: colors.red600, textAlign: "center" }}>{message}</T>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.retry} hitSlop={8}>
          <RefreshCw size={14} color={colors.green700} />
          <T weight="semibold" style={{ color: colors.green700 }}>
            Try again
          </T>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyBox({ message }) {
  return (
    <View style={styles.emptyBox}>
      <T style={{ color: colors.gray500, textAlign: "center" }}>{message}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  text: { color: colors.gray900, fontSize: 14 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 11 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  eyebrow: { fontSize: 12, letterSpacing: 1.2, color: colors.green600 },
  headingRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  h2: { flex: 1, fontSize: 26, lineHeight: 34 },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 4,
  },
  sectionText: { marginTop: 8, color: colors.gray600, lineHeight: 21 },
  pageHero: {
    backgroundColor: "rgba(240,253,244,0.6)",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 28,
    alignItems: "center",
  },
  pageTitle: { fontSize: 28, lineHeight: 36, textAlign: "center" },
  pageText: { marginTop: 10, color: colors.gray600, textAlign: "center", lineHeight: 21 },
  errorBox: { backgroundColor: colors.red50, borderRadius: 16, padding: 20, margin: 16, alignItems: "center", gap: 10 },
  retry: { flexDirection: "row", alignItems: "center", gap: 6 },
  emptyBox: { backgroundColor: colors.gray50, borderRadius: 16, padding: 32, margin: 16 },
});
