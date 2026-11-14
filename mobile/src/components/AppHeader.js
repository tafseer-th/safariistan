import { Linking, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, MessageCircle, Mountain } from "lucide-react-native";
import { T } from "@/components/ui";
import { colors, shadow } from "@/lib/theme";
import { whatsappUrl } from "@/lib/api";

export function Logo({ dark = false, size = 36 }) {
  return (
    <View style={styles.logo}>
      <View style={[styles.logoMark, { width: size, height: size, borderRadius: size * 0.3 }]}>
        <Mountain size={size * 0.55} color={colors.white} />
      </View>
      <T weight="extrabold" style={[styles.logoText, dark && { color: colors.white }]}>
        Safaristan
      </T>
    </View>
  );
}

// White top bar like the website navbar. With `back`, shows a back arrow instead of the CTA.
export default function AppHeader({ back = false, cta = true }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        {back ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            style={styles.back}
            hitSlop={10}
            accessibilityLabel="Back"
          >
            <ChevronLeft size={26} color={colors.gray800} />
          </Pressable>
        ) : null}
        <Pressable onPress={() => router.navigate("/")} style={{ flex: 1 }} accessibilityLabel="Home">
          <Logo />
        </Pressable>
        {cta && <Pressable
          onPress={() => router.push("/make-my-trip")}
          style={({ pressed }) => [styles.cta, pressed && { backgroundColor: colors.green700 }]}
        >
          <T weight="semibold" style={styles.ctaText}>
            Make My Trip
          </T>
        </Pressable>}
      </View>
    </View>
  );
}

// Green WhatsApp button that floats over the content (bottom right), like the website.
export function FloatingWhatsApp({ bottom = 20 }) {
  return (
    <Pressable
      onPress={() => Linking.openURL(whatsappUrl("Hi, I want a tour quote."))}
      style={({ pressed }) => [styles.fab, { bottom }, pressed && { transform: [{ scale: 0.95 }] }]}
      accessibilityLabel="WhatsApp"
    >
      <MessageCircle size={26} color={colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    ...shadow.sm,
    zIndex: 10,
  },
  row: { height: 64, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, gap: 8 },
  back: { marginLeft: -6, marginRight: 2 },
  logo: { flexDirection: "row", alignItems: "center", gap: 9 },
  logoMark: { backgroundColor: colors.green600, alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: 21, letterSpacing: -0.4 },
  cta: { backgroundColor: colors.green600, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 9 },
  ctaText: { color: colors.white, fontSize: 13 },
  fab: {
    position: "absolute",
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.green500,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.white,
    ...shadow.lg,
  },
});
